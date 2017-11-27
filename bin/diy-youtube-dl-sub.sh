#!/bin/bash

echo $1

./youtube-dl --sub-format vtt --write-sub --write-auto-sub --skip-download $1

cat *.vtt|sed -E "s;<[0-9]{2}:[^>]*?>;;g"|sed -E "s;</?c(\.color[^>]*?)?>;;g" | sed -E "s;[0-9]{2}:[0-9]{2}:.*?\s-->\s[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(.*?position:[0-9]+?%)?;;g" | tr '\n' ' '|sed -E 's;\s{2,}; ;g'|sed -E 's;WEBVTT.*##;;'

rm -f *.vtt
