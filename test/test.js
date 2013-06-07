
var Proxy = require('../');
var should = require('should');

describe('Proxy', function () {
	it('should forward to the object by default', function () {
		var o = {};
		var p = new Proxy(o, {});
		p.a = 'foo';
		p.a.should.eql('foo');
		('a' in p).should.be.ok;
		Object.keys(p).should.eql(['a']);
		delete p.a;
		should.not.exist(p.a);
		p.hasOwnProperty('a').should.not.be.ok;
		p.b = 'bar';
		for (var i in p) {}
		i.should.eql('b');
		Object.getOwnPropertyDescriptor(p, 'b').value.should.eql('bar');
		Object.getOwnPropertyNames(p).should.eql(['b']);
		Object.defineProperty(p, 'c', {value: 'foobar'});
		o.c.should.eql('foobar');
	});
	it('should support new style Proxies', function () {
		var o = {};
		var calls = [];
		var p = new Proxy(o, {
			getOwnPropertyDescriptor: function (target, name) { calls[0] = true; return {value: 'bar', configurable: true}; },
			getOwnPropertyNames: function (target, name) { calls[1] = true; return ['b']; },
			defineProperty: function (target, name, desc) {calls[2] = true; Object.defineProperty(target, name, desc); return true; },
			deleteProperty: function (target, name) { calls[3] = true; delete target[name]; },
			has: function (target, name) { calls[4] = true; return name in target; },
			hasOwn: function (target, name) { calls[5] = true; return Object.prototype.hasOwnProperty.call(target, name); },
			get: function (target, name) { calls[6] = true; return target[name]; },
			set: function (target, name, val) { calls[7] = true; target[name] = val; return true; },
			enumerate: function () { calls[8] = true; return ['b']; },
			keys: function () { calls[9] = true; return ['a']; }
		});
		p.a = 'foo';
		p.a.should.eql('foo');
		('a' in p).should.be.ok;
		Object.keys(p).should.eql(['a']);
		delete p.a;
		should.not.exist(p.a);
		p.hasOwnProperty('a').should.not.be.ok;
		p.b = 'bar';
		for (var i in p) {}
		i.should.eql('b');
		Object.getOwnPropertyDescriptor(p, 'b').value.should.eql('bar');
		Object.getOwnPropertyNames(p).should.eql(['b']);
		Object.defineProperty(p, 'c', {value: 'foobar'});
		o.c.should.eql('foobar');
		calls.should.eql(Array(10).join('.').split('.').map(function () { return true; }));
	});
	it('should support the new style Proxies also for functions', function () {
		var fn = function () {};
		var called = [];
		var p = new Proxy(fn, {
			apply: function (target, thisVal, args) {
				called[0] = true;
				args.should.eql([1]);
			},
			construct: function (target, args) {
				called[1] = true;
				args.should.eql([1, 2]);
			}
		});
		p(1);
		new p(1, 2);
		called.should.eql([true, true]);
	});
	it('should use the correct prototype', function () {
		function T() {}
		var t = new T;
		var p = new Proxy(t, {});
		p.should.be.an.instanceof.T;
		Object.getPrototypeOf(p).should.equal(T.prototype);
	});
});

