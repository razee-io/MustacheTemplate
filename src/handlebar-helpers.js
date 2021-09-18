// list of useful handlebars helpers we can bundle
// credit goes to https://stackoverflow.com/a/31632215 & https://stackoverflow.com/a/50427569
//
// TODO: maybe make this extensible via another CR field?

const objectPath = require('object-path');
const crypto = require('crypto');
const {REGEX_PATTERN, ROOT_PATH} = require('./constants');
const typecast = require('./typecast');

module.exports = {
  assign,
  eq,
  ne,
  lt,
  gt,
  lte,
  gte,
  and,
  or,
  split,
  divide ,
  add,
  substring,
  includes,
  sha256,
  concat,
  base64,
  jsonStringify,
  jsonDoubleStringify,
  envPattern
};


function assertRoot(options) {
  if (!objectPath.has(options, ROOT_PATH)) {
    objectPath.set(options, ROOT_PATH, {});
  }
  return objectPath.get(options, ROOT_PATH);
}

function assign (varName, varValue, options) {
  assertRoot(options);
  objectPath.set(options, ['data', 'root', varName], varValue);
}


function envPattern(pattern, options) {
  const root = assertRoot(options);
  const valid = REGEX_PATTERN.exec(pattern);

  if (!valid) {
    const error = new TypeError(`Invalid regular expression pattern ${pattern}`);
    error.code = 'ERR_INVALID_REGEX';
    error.controller = 'MustacheTemplate';
    error.helper = 'envPattern';
    error.input = pattern;
    error.expected = REGEX_PATTERN.source;

    throw error;
  }

  const {body, flags} = valid.groups;
  const expression = new RegExp(body, flags);
  const compiled = Object.create(null);

  for (const [key, value] of Object.entries(root)) {
    const match = expression.test(key);
    if (match) {
      objectPath.set(compiled, key.split('_'), typecast(value));
    }
  }

  for(const [key, value] of Object.entries(compiled)) {
    assign(key, value, options);
  }
}

function eq (v1, v2) {
  return v1 === v2;
}

function ne (v1, v2) {
  return v1 !== v2;
}

function lt (v1, v2) {
  return v1 < v2;
}

function gt (v1, v2) {
  return v1 > v2;
}
function lte (v1, v2) {
  return v1 <= v2;
}

function gte (v1, v2) {
  return v1 >= v2;
}

function and(...args) {
  return args.every(Boolean);
}

function or(...args) {
  return args.slice(0, -1).some(Boolean);
}

function split (data, delimiter) {
  if (typeof data === 'string' && typeof delimiter === 'string') {
    return data.split(delimiter);
  }
  return [data];
}

function divide (x, y) {
  if (typeof x === 'number' && typeof y === 'number' && y !== 0) {
    return parseInt(x / y);
  } else {
    return -1;
  }
}

function add (x, y) {
  if (typeof x === 'number' && typeof y === 'number') {
    return x + y;
  }
  return -1;
}

function substring (data, startIndex, endIndex) {
  startIndex = (typeof startIndex === 'number') ? startIndex : undefined;
  endIndex = (typeof endIndex === 'number') ? endIndex : undefined;
  if (typeof data === 'string') {
    return data.substring(startIndex, endIndex);
  }
  return data;
}

function includes (arr, valueToFind, fromIndex) {
  fromIndex = (typeof fromIndex === 'number') ? fromIndex : undefined;
  if (Array.isArray(arr) && valueToFind !== 'undefined') {
    return arr.includes(valueToFind, fromIndex);
  }
  return false;
}

function sha256 (data) {
  if (typeof data !== 'string') {
    return '';
  }
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash;
}

function concat (...arr) {
  arr.pop();
  let flat = arr.flat();
  return ''.concat(...flat);
}

function base64 (data) {
  if (typeof data !== 'string' && !Array.isArray(data)) {
    return '';
  }
  return Buffer.from(data).toString('base64');
}

function jsonStringify (data) {
  return JSON.stringify(data);
}

function jsonDoubleStringify (data) {
  // if you want to use this, you must use our strTemplate, and you must not put quotes around your template (ie. `my-field: {{ jsonStringify my-json }}` is valid but `my-field: "{{ jsonStringify my-json }}"` is not)
  return JSON.stringify(JSON.stringify(data));
}

