#!/bin/bash
echo "Running baseline benchmarking tests..."
git config --global user.email "pratiksharma@microsoft.com"
git config --global user.name "Pratik Sharma"
for i in {1..25..3}
	  do 
		  sed -i -e "s/jest/jest --maxWorkers=$i/g" package.json
		  git add -A
		  git commit -m "maxWorkers=$i"
		  git push -u origin $1
done
