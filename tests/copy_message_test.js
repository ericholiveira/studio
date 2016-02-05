var expect = require("chai").expect;
var Studio = require('../src/studio');
Studio = Studio.module('copyMessage');

describe("A message", function () {
	Studio(function * copyTest(msg){
		msg.hello = 'copy';
		msg.inner.content = 'new';
		delete msg.toDelete;
		msg.arr.push(3);
		return yield msg;
	});
	it("should not change the originalMessage", function (done) {
		var message = {
			hello: 'hello',
			inner: {
				content: 'content'
			},
			toDelete: 'delete',
			arr: [1, 2]
		};
		Studio('copyTest')(message).then(function(){
			expect(message.hello).to.equal('hello');
			expect(message.inner.content).to.equal('content');
			expect(message.toDelete).to.equal('delete');
			expect(message.arr.length).to.equal(2);
			expect(message.arr[0]).to.equal(1);
			expect(message.arr[1]).to.equal(2);
			done();
		}).catch(console.log);
	});

	function MyModel(options) {
		options = options || {};
		this.id = +options.id;
	}
	it("should be clonable", function () {
		var message = {
			hello: 'hello',
			inner: {
				content: 'content',
				num: new MyModel({
					id: 33
				}),
				nul: null
			},
			toDelete: 'delete',
			num: 1,
			data: new Date(),
			regExp: /[0-9]/gim,
			buf: new Buffer(1)
		};
		var cloned = clone(message);
		expect(2).to.equal(clone(2));
		expect(message.hello).to.equal(cloned.hello);
		cloned.hello = 'copy';
		expect(message.hello).not.to.equal(cloned.hello);
		expect(message.inner.content).to.equal(cloned.inner.content);
		expect(message.inner.num.id).to.equal(cloned.inner.num.id);
		expect(message.inner.nul).to.equal(cloned.inner.nul);
		expect(message.toDelete).to.equal(cloned.toDelete);
		expect(message.num).to.equal(cloned.num);
		expect(message.data/1).to.equal(cloned.data/1);
	});
	it("should accept user defined clone", function () {
		var obj = {
			a: 1
		};
		obj.clone = function () {
			return null;
		};
		expect(clone(obj)).to.equal(null);
	});
});
