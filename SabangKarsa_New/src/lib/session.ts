import { API_URL } from "./api";
import type { UserData } from "@/types/userData";

export type SessionStatus = "authenticated" | "unauthenticated" | "unavailable";

export class SessionError extends Error {
  readonly status: Exclude<SessionStatus, "authenticated">;

  constructor(status: Exclude<SessionStatus, "authenticated">) {
    super(`Session ${status}`);
    this.name = "SessionError";
    this.status = status;
  }
}

export async function checkSession(signal?: AbortSignal): Promise<SessionStatus> {
  if (signal?.aborted) return "unavailable";
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, 10000);

  try {
    const response = await fetch(`${API_URL}/token`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });
    if (response.status === 401 || response.status === 403) return "unauthenticated";
    if (!response.ok) return "unavailable";
    const data: { active?: unknown } = await response.json();
    if (data.active === true) return "authenticated";
    if (data.active === false) return "unauthenticated";
    return "unavailable";
  } catch {
    return "unavailable";
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

const onAuthPage = () => ["/login", "/register"].includes(window.location.pathname);

export async function restoreSession(signal?: AbortSignal): Promise<void> {
  const originalUser = localStorage.getItem("user");
  // A stale cached user must not block a fresh login or registration attempt.
  if (!originalUser || onAuthPage()) return;
  const status = await checkSession(signal);
  if (signal?.aborted || status !== "unauthenticated" || onAuthPage()) return;
  // Do not erase a newer login from another tab while this request was pending.
  if (localStorage.getItem("user") !== originalUser) return;
  localStorage.removeItem("user");
  localStorage.removeItem("chatbot");
  window.location.replace("/login?reason=session-expired");
}

export async function completeSignIn(user: UserData): Promise<void> {
  if (!user?.id) throw new SessionError("unavailable");
  const status = await checkSession();
  if (status !== "authenticated") throw new SessionError(status);
  // A successful login response alone does not prove that the cookie persisted.
  localStorage.setItem("user", JSON.stringify(user));
}
