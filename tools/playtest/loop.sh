#!/bin/bash
# usage: loop.sh script.py  -- reruns after a browser crash (exit 3) until the script exits 0
cd "$(dirname "$0")"
for i in $(seq 1 60); do python -u "$1" >> run.log 2>&1; c=$?; if [ $c -ne 3 ]; then exit $c; fi; echo "restart $i" >> run.log; done
