# Below the Abbey: the printed manual (shared brief for every chapter writer)

We are making an old school game manual for **Below the Abbey** (first person, grid movement, turn based RPG, by Bickering Goat Studios),
to be uploaded with the game on itch.io. It is styled on the manuals that came in the box of the old Ultima games (see the reference
`../uuwppc-manual.pdf`): a small booklet, Times text, Helvetica labels, numbered chapters, italic captions, **gameplay shots in black and
white inside a heavy black frame**. It is also laid out like a magazine: two columns, drop caps, pull quotes, sidebars, plenty of pictures.
Page size is 6 x 9 inches. The whole book will be about 90 to 110 pages: eight writers each own one chapter of roughly 10 to 14 pages.

## What you deliver
One file: `manual/chapters/NN_name.html` (your NN and name are in your task). It is an HTML **fragment**: a single
`<section class="chapter" id="chNN"> ... </section>`, no `<html>` or `<head>`. Start it with

    <section class="chapter" id="chNN">
    <h1><span class="no">Chapter N</span>Title</h1>
    <div class="deck">One italic line that sells the chapter.</div>
    ...

Give every main heading in your chapter an id so the contents page can link to it: `<h2 id="chNN-short-name">Heading</h2>` (prefix your chapter id,
ids must be unique across the book). Link to other chapters with `<a href="#ch05">` where useful (the book is a PDF with clickable links).
Your images go in `manual/img/chNN_*.png` (or .jpg). Do not edit any other file in `manual/` (manual.css, build.py, shotlib.py are shared; tell me
in your final report if you need a new style). Do NOT touch the game files, and never commit or push anything. Never run `build.py`.

## Styles you can use (all in manual.css; read it first, it is short)
`.cols` (two column body, wrap the main text), `.dropcap` (on a .cols or a p), `h2`, `h3`, `h4`, `figure.shot` (B&W framed gameplay shot),
`figure.art` (colour painted art, thin frame), `figure.bw`, `figure.full` (full bleed), `.pair`, `.trio` (grids of figures), `.float-r` / `.float-l`,
`.box` (sidebar; `.box.dark`, `.box.tint`), `.pull` (pull quote), `.hint` (`<p class="hint"><b>Hint:</b> ...</p>`), `.spoiler` (dashed box labelled SPOILER),
`dl.def` (name / effect lists like the old spell lists: `<dt>Name</dt><dd data-k="Effect">...</dd>`), `table.t`, `ul.tick`, `.kbd` for key caps, `.pb` (force a page break),
`.nobreak`. Wrap each `<img>` in a `<figure>` with a `<figcaption>`.

## Pictures: every page needs something to look at
* **Gameplay shots**: use `shotlib.py` (read its docstring; the game is served at http://localhost:8399/ , check with
  `curl -s -o /dev/null -w "%{http_code}" http://localhost:8399/index.html`, if it is not 200 start it with
  `cd C:/Users/mirko/Downloads/workspace/Below-the-Abbey && python -m http.server 8399`). It saves **greyscale** PNGs. Put them in a `figure class="shot"`.
  Look at every shot with the Read tool before using it: no blurry grey screens (you are standing inside a wall or stall), no dialog boxes covering the view, no half-loaded areas.
  Use `g.shot(name, ui=True)` for shots of the whole window with the HUD, menus and inventory (open them with `g.js(...)`; find the right G.menu values in index.html), and plain `g.shot(name)` for the 3D view.
  Each Game() session takes about 15 seconds to start, so take many shots per session. Name files `chNN_something`; shots land in `manual/img/shots/` and you reference them as `img/shots/chNN_something.png`.
  Several writers run the game at the same time: keep sessions short and close them.
* **Painted art from the game** is in `../assets/` (relative to manual/). Creatures (`assets/*.png`), item icons (`icn_*.png`), area art, portraits, signs, flags, gargoyles, ships and so on. Browse with Glob. Look at the pictures before you use them (Read tool). Colour is fine for painted art,
  use `figure.art`; use `figure.bw` where B&W suits the page. Transparent sprites look good on a plain white or grey box, or inside a `.box`. Do not stretch pictures; keep their aspect ratio.
* Parchment area maps and the in-game world map are good graphics too (take a shot with ui=True after opening the map: find the G.menu value for it in index.html).
* The game's own pictures only. Nothing from the internet. Never draw creatures or props in code or SVG.

## Writing
* **No em dashes anywhere** (this is a standing rule of the owner). Use commas, colons, full stops or brackets. Do not use the long dash character at all.
* British / Australian spelling (colour, armour, grey, defence).
* **Only write what is true.** Read the game (`../index.html` is large: use Grep; `../src/desert/*.js`; `../STORY.md` has the story; `../CLAUDE.md`; `../UPDATE_LOG_3.412.md` and the other CHANGES files summarise features) or play it. If you cannot confirm a fact,
  leave it out. Do not invent names, numbers, quests or rules. Quote real numbers from the code.
* Tone: an old manual, warm and slightly formal, speaking to "you" and "your party". Clear instructions, vivid but short flavour text. Hint chapters keep spoilers behind `.spoiler` boxes or in clearly labelled "Spoiler" sections.
* Keep paragraphs short. Use lists and tables for rules. The booklet is read on screen and printed, so keep type at the sizes in manual.css.

## Check your work
Run `python preview.py chapters/NN_name.html` (from the manual folder). It writes page PNGs and a contact sheet to `_preview/NN_name/`. **Look at the pages** with the Read tool: no text running off a page, no big white gaps, no figure split across pages, no empty pages,
pictures sharp and in proportion, columns balanced. Fix and re-run until it is good. Aim for 10 to 14 pages, full of pictures and information, with a mix of layouts (full bleed shot, pairs, sidebars, pull quote, tables), not a wall of text.

## Final report
Reply with: the file name, the page count, the list of anchors you made (id + heading), and any fact you were unsure about or any style you wished you had. Keep it under 200 words.
