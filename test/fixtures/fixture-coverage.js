'use strict';
const assert = require('assert');
const TestClass = require('./testlib');

it('should create TestClass and call testMethod', () => {
    var t = new TestClass();
    assert(t.testMethod());
});
