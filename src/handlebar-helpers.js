// list of useful handlebars helpers we can bundle
// credit goes to https://stackoverflow.com/a/31632215 & https://stackoverflow.com/a/50427569
//
// TODO: maybe make this extensible via another CR field?

const objectPath = require('object-path');

const helpers = {
  assign: function (varName, varValue, options) {
    if (!isNumber(varName)) {
      objectPath.set(options, ['data', 'root', varName], varValue);
    } else {
      throw Error(`Cannot assign number: ${varName}`); 
    }
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
  }
};

function isNumber(x) {
  return parseFloat(x) == x;
}

module.exports = helpers;
