#!/bin/sh
search_dir="/home/ubuntu/CT/dummy/xml"
for entry in "$search_dir"/*
do
  	echo "$entry"

	OLD_IFS=$IFS    # save internal field separator
	IFS="/"         # set it to '/'
	set -- $entry   # make the result positional parameters
	IFS=$OLD_IFS    # restore IFS
	echo "$7"

	
	./ct_.sh "$entry" >> $7.txt 2>&1 &
done
