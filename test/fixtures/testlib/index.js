'use strict';

class TestClass {

    constructor () {
        this.testMemberVar = false;
    }

    testMethod () {
        if (this.testMemberVar === false) {
            this.testMemberVar = true;
        }
        return this.testMemberVar;
    }
}

module.exports = TestClass;
