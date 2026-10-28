#!/bin/sh
# runs the "after" checks one after the other (one browser at a time)
cd "$(dirname "$0")/../.."
python tools/powers_audit/run_audit.py after 3 && python tools/powers_audit/analyse.py after | head -3
python tools/powers_audit/dump_inventory.py after
python tools/powers_audit/run_expected.py after
python tools/powers_audit/shots.py after
echo ALLDONE
