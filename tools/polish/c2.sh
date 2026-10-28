#!/bin/bash
# usage: c2.sh '<json>'  -> runs it in the daemon, prints the output
cd /c/Users/mirko/Downloads/workspace/Below-the-Abbey/tools/polish/c2_q
n=$(date +%s%N); printf "%s" "$1" > $n.tmp; mv $n.tmp $n.json
for i in $(seq 1 400); do [ -f $n.out ] && { cat $n.out; rm $n.out; exit; }; sleep 0.5; done; echo TIMEOUT
