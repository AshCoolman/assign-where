'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};









































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// Note: There exists lodash/toPairs, alias of lodash/entries, and approximation of Object.entries

var entries = require('object.entries');

/**
 * Checks params of `assignWhere`, throwing errors on failures
 * 
 
 * @param {Function} predicate Tests if each enumerable key/value should be assigned to the `object`
 * @param {object} object The object to be assigned onto (to be mutated)
 * @param- {Object} [sources] The source objects
 */
var assignWhereChecker = function assignWhereChecker(predicate, target, sources) {
  if (typeof predicate !== 'function') {
    throw new TypeError('assignWhere expected predicate to be a function, instead got ' + predicate + ' (' + (typeof predicate === 'undefined' ? 'undefined' : _typeof(predicate)) + ')');
  }

  if (!['object', 'string'].includes(typeof target === 'undefined' ? 'undefined' : _typeof(target)) || target === null) {
    throw new TypeError('assignWhere expected target to be enumerable, instead got ' + target + ' (' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ')');
  }
};

/**
 * The base implementation of `assignWhere` without support for multiple sources
 *
 * @private
 * @param {Function} predicate Tests if each enumerable key/value should be assigned to `target`.
 * @param {object} target The object to be assigned onto (to be mutated).
 * @param {Object} [source] The source object.
 * @returns {Object} Returns `object`.
 */
var baseWhereAssign = function baseWhereAssign(predicate, target, source) {
  return (

    /*Object.*/entries(Object.assign(source))
    // ...ignore null/undefined (Object.assign behavior)...
    .filter(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];

      return typeof val !== 'undefined' && val !== null;
    })
    // ...where predicate passed...
    .filter(predicate).reduce(function (prev, _ref3) {
      var _ref4 = slicedToArray(_ref3, 2),
          key = _ref4[0],
          val = _ref4[1];

      // ...assign...
      prev[key] = val;
      return prev;
    },
    // ...onto initial value
    Object.assign(target))
  );
};

/**
 * Conditionally assigns `value` to `key` of source `objects enumerabl` string keyed properties, 
 * to a destination object 
 * 
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign) and [`Array.filter`](https://mdn.io/Array/filter).
 * The predicate params is based on the output of[`Object.entries`](https://mdn.io/Object/entries).
 * 
 * @category Object
 * @param {Function} predicate Tests if each enumerable key/value should be assigned to `target`.
 * @param {object} target The object to be assigned onto (to be mutated).
 * @param- {Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * assignWhere( entry => entry.key.startsWith('a'), {apple: 'Manzana'},  {'bannana': 'Banano'}, {'crab': 'crangrejo'} );
 * // {apple: 'Manzana'}
 */
var main = (function (predicate, target) {
  for (var _len = arguments.length, sources = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    sources[_key - 2] = arguments[_key];
  }

  return assignWhereChecker(predicate, target), sources.filter(function (e) {
    return e;
  }).reduce(function (prev, cur) {
    return baseWhereAssign(predicate, prev, cur);
  }, target);
});

module.exports = main;
