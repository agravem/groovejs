test:
	@./node_modules/.bin/mocha --ui qunit --reporter dot

wtest:
	@./node_modules/.bin/mocha --ui qunit --reporter min --watch

.PHONY: test wtest
