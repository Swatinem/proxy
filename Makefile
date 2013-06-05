test:
	NODE_ENV=test ./node_modules/.bin/mocha --harmony

lib-cov: clean-cov
	./node_modules/.bin/jscoverage lib lib-cov

clean-cov:
	rm -rf lib-cov

test-cov: lib-cov
	ESPROXY_COV=1 NODE_ENV=test ./node_modules/.bin/mocha --harmony --reporter html-cov 1> coverage.html

test-coveralls: lib-cov
	ESPROXY_COV=1 NODE_ENV=test ./node_modules/.bin/mocha --harmony --reporter mocha-lcov-reporter | ./node_modules/.bin/coveralls

.PHONY: test test-cov test-coveralls clean-cov
