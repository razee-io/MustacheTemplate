'use strict';

module.exports = function typecast(value) {
  if (typeof value !== 'string') return value;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '' || isNaN(value)) return value;
  if (isFinite(value)) return parseFloat(value);
};
