const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
function loadTs(file, globals = {}) {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(root, file), 'utf8').replaceAll('import.meta.env', '__env');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, AbortController, setTimeout, clearTimeout,
    require(name) {
      if (name === './api') return { API_URL: '/api' };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    ...globals,
  });
  return module.exports;
}

const user = { id: 'test-user', name: 'Test', role: 'buyer' };
function fixture(fetch, pathname = '/', extra = {}) {
  const storage = new Map([['user', JSON.stringify(user)], ['chatbot', '{}']]);
  const redirects = [];
  const location = { pathname, replace: url => redirects.push(url) };
  const session = loadTs('src/lib/session.ts', {
    fetch,
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
    window: { location },
    ...extra,
  });
  return { ...session, storage, redirects, location };
}

test('production uses the same-origin API despite an old external environment URL', () => {
  const api = loadTs('src/lib/api.ts', { __env: { PROD: true, VITE_API_URL: 'https://old-api.invalid' } });
  assert.equal(api.API_URL, '/api');
});

test('development keeps the configured API and normalizes its prefix', () => {
  for (const url of ['http://localhost:3001', 'http://localhost:3001/api/']) {
    assert.equal(loadTs('src/lib/api.ts', { __env: { PROD: false, VITE_API_URL: url } }).API_URL,
      'http://localhost:3001/api');
  }
});

test('API proxy takes precedence over the SPA fallback and prevents cached sessions', () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  assert.equal(config.rewrites[0].source, '/api/:path*');
  assert.equal(config.rewrites[0].destination,
    'https://sabangkarsa-production-3793.up.railway.app/api/:path*');
  assert.ok(config.headers.some(rule => rule.source === '/api/:path*' &&
    rule.headers.some(header => header.key === 'Cache-Control' && header.value.includes('no-store'))));
});

test('a valid session retains the user and sends credentials without caching', async () => {
  let requested;
  const f = fixture(async (url, options) => {
    requested = { url, options };
    return Response.json({ active: true });
  });
  await f.restoreSession();
  assert.equal(requested.url, '/api/token');
  assert.equal(requested.options.credentials, 'include');
  assert.equal(requested.options.cache, 'no-store');
  assert.ok(f.storage.has('user'));
  assert.equal(f.redirects.length, 0);
});

for (const status of [401, 403, 429, 500, 502, 503]) {
  test(`HTTP ${status} ${status < 429 ? 'invalidates' : 'preserves'} the cached session`, async () => {
    const f = fixture(async () => new Response('{}', { status }));
    await f.restoreSession();
    const invalid = status === 401 || status === 403;
    assert.equal(f.storage.has('user'), !invalid);
    assert.equal(f.storage.has('chatbot'), !invalid);
    assert.deepEqual(f.redirects, invalid ? ['/login?reason=session-expired'] : []);
  });
}

test('expired JWT response invalidates the session even when HTTP status is 200', async () => {
  const f = fixture(async () => Response.json({ active: false }));
  await f.restoreSession();
  assert.equal(f.storage.has('user'), false);
  assert.deepEqual(f.redirects, ['/login?reason=session-expired']);
});

for (const [label, fetch] of [
  ['network error', async () => { throw new TypeError('Failed to fetch'); }],
  ['HTML gateway response', async () => new Response('<html>Gateway error</html>')],
  ['unexpected JSON', async () => Response.json({})],
]) {
  test(`${label} does not sign the user out`, async () => {
    const f = fixture(fetch);
    await f.restoreSession();
    assert.ok(f.storage.has('user'));
    assert.equal(f.redirects.length, 0);
  });
}

test('a slow session request times out without signing the user out', async () => {
  const f = fixture((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('timeout')), { once: true });
  }), '/', { setTimeout: callback => queueMicrotask(callback), clearTimeout() {} });
  await f.restoreSession();
  assert.ok(f.storage.has('user'));
  assert.equal(f.redirects.length, 0);
});

test('an aborted startup request cannot erase a session', async () => {
  const controller = new AbortController();
  const f = fixture(async () => {
    controller.abort();
    return new Response('{}', { status: 401 });
  });
  await f.restoreSession(controller.signal);
  assert.ok(f.storage.has('user'));
});

test('an older session check cannot erase a newer login from another tab', async () => {
  const f = fixture(async () => {
    f.storage.set('user', JSON.stringify({ ...user, id: 'new-user' }));
    return new Response('{}', { status: 401 });
  });
  await f.restoreSession();
  assert.equal(JSON.parse(f.storage.get('user')).id, 'new-user');
  assert.equal(f.redirects.length, 0);
});

test('cached users do not trigger an automatic redirect from auth pages', async () => {
  for (const pathname of ['/login', '/register']) {
    let calls = 0;
    const f = fixture(async () => { calls++; return new Response('{}', { status: 401 }); }, pathname);
    await f.restoreSession();
    assert.equal(calls, 0);
    assert.equal(f.redirects.length, 0);
  }
});

test('an in-flight startup check does not interfere after opening the login page', async () => {
  const f = fixture(async () => {
    f.location.pathname = '/login';
    return new Response('{}', { status: 401 });
  });
  await f.restoreSession();
  assert.ok(f.storage.has('user'));
  assert.equal(f.redirects.length, 0);
});

test('successful sign-in persists a user only after the session cookie is confirmed', async () => {
  const f = fixture(async () => Response.json({ active: true }));
  f.storage.clear();
  await f.completeSignIn(user);
  assert.deepEqual(JSON.parse(f.storage.get('user')), user);
});

for (const status of [401, 503]) {
  test(`login followed by HTTP ${status} does not record a false successful sign-in`, async () => {
    const f = fixture(async () => new Response('{}', { status }));
    f.storage.clear();
    await assert.rejects(f.completeSignIn(user), error =>
      error.name === 'SessionError' && error.status === (status === 401 ? 'unauthenticated' : 'unavailable'));
    assert.equal(f.storage.has('user'), false);
  });
}
