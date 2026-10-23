#!/usr/bin/env python3
"""Writes win-manifest.json: the list of every file of the game's content (what desktop/prepare.js copies into the
Windows app: index.html, manifest.json and assets/ without assets/detailed), each with its sha256 and size.

The Windows app (desktop/updater.js) reads this file from GitHub Pages at start-up. If the version is newer than the
one it holds, it downloads only the files whose hash changed (from the same Pages site that serves the browser game),
checks every hash and uses the new files the next time it starts.

The hash is of the bytes GitHub Pages will serve, not of the working copy: git is set to turn CRLF into LF when it
commits a text file, so a text file (no NUL byte in it) is hashed with CRLF turned into LF, the same as git does.

Run by tools/stamp.py, so every release has a manifest that matches its files. Run it again by hand after any change to
index.html or assets/ that is not followed by a stamp.
"""
import hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(data: bytes) -> bytes:
    """What git commits (and Pages serves) for this file."""
    if b'\0' in data[:8000]:
        return data
    return data.replace(b'\r\n', b'\n')


def version() -> str:
    src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', newline='').read()
    m = re.search(r"const VERSION='([^']+)'", src)
    if not m:
        raise SystemExit('make_win_manifest: no VERSION in index.html')
    return m.group(1)


def files():
    for f in ('index.html', 'manifest.json'):
        if os.path.exists(os.path.join(ROOT, f)):
            yield f
    base = os.path.join(ROOT, 'assets')
    for dp, dn, fn in os.walk(base):
        dn[:] = [d for d in dn if d != 'detailed']
        for f in fn:
            yield os.path.relpath(os.path.join(dp, f), ROOT).replace(os.sep, '/')


def main():
    out = {}
    for rel in sorted(files()):
        data = norm(open(os.path.join(ROOT, rel.replace('/', os.sep)), 'rb').read())
        out[rel] = [hashlib.sha256(data).hexdigest(), len(data)]
    doc = {'v': version(), 'files': out}
    with open(os.path.join(ROOT, 'win-manifest.json'), 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, separators=(',', ':'), sort_keys=True)
    total = sum(v[1] for v in out.values())
    print('win-manifest.json: version %s, %d files, %.1f MB' % (doc['v'], len(out), total / 1048576))


if __name__ == '__main__':
    main()
