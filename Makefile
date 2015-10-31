export ENV ?= development

.PHONY: server
server:
	node index.js | ./node_modules/.bin/bunyan -o short
