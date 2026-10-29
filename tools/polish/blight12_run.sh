#!/bin/sh
# usage: blight12_run.sh "town=blight1&lvl=84" file.js [shot.png]
cd /c/Users/mirko/Downloads/workspace/Below-the-Abbey
BTA_CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe" BL_PORT=8601 timeout 240 python tools/blight_probe.py "$@"
