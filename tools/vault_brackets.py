"""python tools/vault_brackets.py file.js : prints the bracket depth at the start of every line that begins in column 0, to find an unbalanced brace.
Strings, template strings, comments and simple regex literals are skipped."""
import sys
s = open(sys.argv[1], encoding='utf-8').read()
i = 0; n = len(s); depth = 0; line = 1; stack = []
out = []
prev = ''
def push(c, ln): stack.append((c, ln))
while i < n:
    c = s[i]
    if c == '\n':
        line += 1
        i += 1
        if i < n and s[i] not in ' \t\n/' and depth != 0:
            out.append((line, depth, stack[-1] if stack else None))
        continue
    if c == '/' and s[i:i+2] == '//':
        while i < n and s[i] != '\n': i += 1
        continue
    if c == '/' and s[i:i+2] == '/*':
        j = s.index('*/', i + 2); line += s.count('\n', i, j); i = j + 2; continue
    if c in '"\'':
        q = c; i += 1
        while i < n and s[i] != q:
            if s[i] == '\\': i += 1
            if s[i] == '\n': line += 1
            i += 1
        i += 1; prev = 'x'; continue
    if c == '`':
        i += 1
        while i < n and s[i] != '`':
            if s[i] == '\\': i += 1
            if s[i] == '\n': line += 1
            i += 1
        i += 1; prev = 'x'; continue
    if c == '/' and prev in '(,=:[!&|?{};' + '':
        i += 1
        while i < n and s[i] != '/':
            if s[i] == '\\': i += 1
            if s[i] == '[':
                while s[i] != ']': i += 1
            i += 1
        i += 1; prev = 'x'; continue
    if c in '({[':
        depth += 1; push(c, line)
    elif c in ')}]':
        depth -= 1
        if stack: stack.pop()
    if not c.isspace(): prev = c
    i += 1
print('final depth', depth)
for ln, d, top in out[:60]:
    print('line', ln, 'depth', d, 'open', top)
