'use strict';

const {assert} = require('chai');
const typecast = require('../src/typecast');

describe('typecast', function () {
  it('should convert string into appropriate types', function () {
    assert.deepEqual(typecast({x: 1}), {x: 1}, 'non string value');
    const cases = [{
      value: 'foo',
      expected: 'foo'
    }, {
      value: 'true',
      expected: true
    }, {
      value: 'false',
      expected: false
    }, {
      value: true,
      expected: true
    }, {
      value: false,
      expected: false
    }, {
      value: '123',
      expected: 123,
      message: 'integer value'
    }, {
      value: '123.45',
      expected: 123.45,
      message: 'float value'
    }, {
      value: 'null',
      expected: null,
      message: 'null string value'
    }, {
      value: null,
      expected: null,
      message: 'null literal value'
    }, {
      value: 'undefined',
      expected: undefined,
      message: 'undefined string value'
    }, {
      value: undefined,
      expected: undefined,
      message: 'undefined literal value'
    }, {
      value: '',
      expected: '',
      message: 'empty string value'
    }, {
      value: Infinity,
      expected: Infinity,
      message: 'Infinity returns input'
    }];

    for (const current of cases) {
      assert.equal(
        typecast(current.value),
        current.expected,
        current.message || `typecast(${current.value}) == ${current.expected}`
      );
    }
  });
});
