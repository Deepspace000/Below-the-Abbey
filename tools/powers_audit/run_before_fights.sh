#!/bin/sh
# builds index.html WITHOUT powers_scaling.js, runs the fight sim for the "before" numbers, then puts the file back
cd "$(dirname "$0")/../.."
sed -i "s/'powers_scaling.js','jump_ready.js'/'jump_ready.js'/" tools/inject.py && python tools/inject.py > /dev/null
python tools/powers_audit/run_fight.py before
python tools/powers_audit/run_expected.py before
sed -i "s/'jump_ready.js'\]/'powers_scaling.js','jump_ready.js']/" tools/inject.py && python tools/inject.py
