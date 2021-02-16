#!/bin/bash
echo "Running baseline benchmarking tests..."
git config --global user.email "pratiksharma@microsoft.com"
git config --global user.name "Pratik Sharma"
git config --global github.user "pratiksharma23"
git config --global github.token "248a22e97d0847eca79f825c7aef93952694019d"
for i in {1..25..3}
	  do 
		  sed -i -e "s/jest/jest --maxWorkers=$i/g" package.json
		  git add -A
		  git commit -m "maxWorkers=$i"
		  git push -u origin $1
done
