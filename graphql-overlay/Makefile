.DEFAULT_GOAL: start

start: /node_modules/
	./node_modules/.bin/babel-node index

/node_modules/: package.json
	yarn
	
.PHONY: start