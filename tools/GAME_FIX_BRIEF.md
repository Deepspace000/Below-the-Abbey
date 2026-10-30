# Whole-game fix pass: shared brief for the fixing agents

Owner's standard (from the castle work): everything placed tastefully and coherently; objects on walls are ON real walls and flush; nothing floats; nothing blocks one-wide passages or the walking route; doors and gates are set into walls and lead somewhere real; no webs or vines floating in rooms; people are normal height; enemies are fully visible in fights (except really big ones); no placeholder or jarring graphics; no hint text under signs (castle only). No em dashes anywhere (game text, notes, commits). Painted raster art only (Gemini via Claude in Chrome, strict front elevation, full length figures, see CLAUDE.md and tools/PS_ART_NOTES.md); never code-drawn art for creatures, people, items or props.

## Method
1. Setup: your worktree branches from an older main. First fetch the newest: `git fetch "C:/Users/mirko/Downloads/NIGHTFLYER RADIO SUBSPACE/RAT-CELLARS/.claude/worktrees/main-work" main && git merge FETCH_HEAD`.
2. Own server: `python -m http.server <unique port you pick between 9020 and 9990>` from your worktree root; ports are shared on Windows: confirm the served index.html size matches your tree before trusting any run. BTA_CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe", PYTHONIOENCODING=utf-8, GA_PORT=<your port>. Never kill python by name, only your own PID.
3. Read tools/GAME_AUDIT_REPORT.md for your area's findings. Run `python tools/game_audit.py --area "<AREA NAME>" --json my.json` (check `--help` for exact flags) to get exact findings with coordinates.
4. Fix the CAUSE in the source files you own (src/desert/*.js), not each instance, wherever a builder or table produces many. Then run `python tools/inject.py` (the injected block of index.html is regenerated; never hand-edit it). Re-run the audit for your area until your counts are zero or each remaining finding is in tools/game_audit_allow.json with a written reason (only for true false positives: say why).
5. LOOK at screenshots of what you changed (several angles, 1 and 3 squares away) and of a sample of untouched-but-flagged places; the audit does not see everything (angled art, wrong pictures). Say plainly what you looked at and what you did not.
6. Do not touch files outside your listed scope (other agents are editing them in parallel); if a fix needs another file, report it. Never edit the engine part of index.html.
7. Keep the game working: run the area's own tests (tools/*test*.py for your area, e.g. tools/blight_test.py, tools/ps_test.py, tools/nt_test.py, tools/pg_test.py as relevant; one mode at a time) and make sure `python tools/ps_audit.py` (castle) still prints AUDIT CLEAN.
8. Commit in your worktree (message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`), do NOT push, do not bump VERSION.

## Definition of done (report format)
First line: what you did NOT finish. Then: counts before and after per check for your area (paste the final audit lines), files changed, what you looked at, what remains and why. Do not claim a fix you did not see working.
