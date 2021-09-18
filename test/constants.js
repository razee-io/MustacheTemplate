'use strict';

const {assert} = require('chai');
const constants = require('../src/constants');

describe('constants', function () {
  describe('ROOT_PATH', function() {
    it('should point to the roo of the data context', function () {
      assert.equal(constants.ROOT_PATH, 'data.root');
    });
  });

  describe('REGEX_PATTERN', function() {
    it('should extract regex flags', function () {
      const {groups: {flags}} = constants.REGEX_PATTERN.exec('/test/gi');
      assert.equal(flags, 'gi');
    });

    it('should extract a regex pattern body', function () {
      const {groups: {body}} = constants.REGEX_PATTERN.exec('/^(?<name>\\w+)_(?:.*)$/i');
      assert.equal(body, '^(?<name>\\w+)_(?:.*)$');
    });
  });
});
