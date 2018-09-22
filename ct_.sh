#!/bin/sh
search_dir="$1"
for entry in "$search_dir"/*
do
 	echo "$entry"
	node convertXmltoJSON.js $entry
done
