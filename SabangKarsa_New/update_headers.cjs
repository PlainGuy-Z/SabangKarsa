const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('/home/azlan/SabangKarsa/SabangKarsa_New/src');
let modifiedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We want to add credentials: "include" to fetch calls that use Authorization header.
    // This regex looks for fetch(..., { ... headers: { ... Authorization: ... } ... })
    // It's safer to just blindly add credentials: "include" to options if we see headers: { Authorization
    // Actually, let's just globally replace `headers: { Authorization: \`Bearer \${token}\` }` with `credentials: "include"`
    // Or if it's `headers: { 'Content-Type': 'application/json', Authorization: ... }`
    
    // Pattern 1: { headers: { Authorization: `Bearer ${token}` } } => { credentials: "include" }
    content = content.replace(/\{\s*headers:\s*\{\s*Authorization:\s*`Bearer \$\{.*?}`\s*\}\s*,?/g, '{ credentials: "include", ');
    
    // Pattern 2: headers: { Authorization: `Bearer ${...}` }, => credentials: "include", 
    content = content.replace(/headers:\s*\{\s*Authorization:\s*`Bearer \$\{.*?}`\s*\},?/g, 'credentials: "include",');
    
    // Pattern 3: headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${...}` }
    content = content.replace(/headers:\s*\{\s*'Content-Type':\s*'application\/json',\s*Authorization:\s*`Bearer \$\{.*?}`\s*\},?/g, 'headers: { "Content-Type": "application/json" }, credentials: "include",');

    // Pattern 4: headers: { "Content-Type": "application/json", Authorization: `Bearer ${...}` }
    content = content.replace(/headers:\s*\{\s*"Content-Type":\s*"application\/json",\s*Authorization:\s*`Bearer \$\{.*?}`\s*\},?/g, 'headers: { "Content-Type": "application/json" }, credentials: "include",');

    // Clean up any double commas if created
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/{\s*credentials: "include",\s*}/g, '{ credentials: "include" }');

    // Also remove the `const token = localStorage.getItem('token');` since it's unused now, 
    // but wait, TypeScript might complain if we remove it and it's used elsewhere. 
    // We can just leave `token` there, TS might give a warning but won't crash build immediately (vite often just warns).
    // Actually, let's replace `const token = localStorage.getItem("token");` with `// const token = null;` just in case.
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        modifiedFiles++;
        console.log("Modified:", file);
    }
});

console.log(`Modified ${modifiedFiles} files.`);
