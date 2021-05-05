// list of useful handlebars helpers we can bundle
// credit goes to https://stackoverflow.com/a/31632215 & https://stackoverflow.com/a/50427569
//
// TODO: maybe make this extensible via another CR field?

const objectPath = require('object-path');
const crypto = require('crypto');

const helpers = {
  assign: function (varName, varValue, options) {
    if (!objectPath.has(options, 'data.root')) {
      objectPath.set(options, 'data.root', {});
    }
    objectPath.set(options, ['data', 'root', varName], varValue);
  },
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  split: function (data, delimiter) {
    if (typeof data === 'string' && typeof delimiter === 'string') {
      return data.split(delimiter);
    }
    return [data];
  },
  divide: function (x, y) {
    if ( typeof x === 'number' && typeof y === 'number' && y !== 0) {
      return parseInt(x / y);
    } else {
      return -1;
    }
  },
  add: function(x, y) {
    if ( typeof x === 'number' && typeof y === 'number') {
      return x + y;
    }
    return -1;
  },
  substring: function (data, startIndex, endIndex) {
    startIndex = ( typeof startIndex === 'number' ) ? startIndex : undefined;
    endIndex = ( typeof endIndex === 'number' ) ? endIndex : undefined;
    if ( typeof data  === 'string') {
      return data.substring(startIndex, endIndex);
    }
    return data;
  },
  includes: function (arr, valueToFind, fromIndex) {
    fromIndex = ( typeof fromIndex === 'number' ) ? fromIndex : undefined;
    if ( Array.isArray(arr) && valueToFind !== 'undefined') {
      return arr.includes(valueToFind, fromIndex);
    }
    return false;
  },
  sha256: function(data) {
    if (typeof data !== 'string') {
      return "";
    }
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
  }
};

module.exports = helpers;
