'use strict';
// Note: There exists lodash/toPairs, alias of lodash/entries, and approximation of Object.entries

const entries = require('object.entries');

/**
 * Checks params of `assignWhere`, throwing errors on failures
 * 
 
 * @param {Function} predicate Tests if each enumerable key/value should be assigned to the `object`
 * @param {object} object The object to be assigned onto (to be mutated)
 * @param- {Object} [sources] The source objects
 */
const assignWhereChecker = (predicate, target, sources) => {
  if (typeof predicate !== 'function') {
    throw new TypeError(`assignWhere expected predicate to be a function, instead got ${predicate} (${typeof predicate})`);
  }
  
  if (!['object', 'string'].includes(typeof target) || target === null) {
    throw new TypeError(`assignWhere expected target to be enumerable, instead got ${target} (${typeof target})`);
  }
}


/**
 * The base implementation of `assignWhere` without support for multiple sources
 *
 * @private
 * @param {Function} predicate Tests if each enumerable key/value should be assigned to `target`.
 * @param {object} target The object to be assigned onto (to be mutated).
 * @param {Object} [source] The source object.
 * @returns {Object} Returns `object`.
 */
const baseWhereAssign = (predicate, target, source) =>
  
  /*Object.*/entries(Object.assign(source))
    // ...ignore null/undefined (Object.assign behavior)...
    .filter( ([key, val]) => typeof val !== 'undefined' && val !== null )
    // ...where predicate passed...
    .filter(predicate)
    .reduce(
      (prev, [key, val]) => {
        // ...assign...
        prev[key] = val; 
        return prev;
      },
      // ...onto initial value
      Object.assign(target)
    );

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
export default (predicate, target, ...sources) => (
  assignWhereChecker(predicate, target),
  sources
    .filter(e => e)
    .reduce(
      (prev, cur) => baseWhereAssign(predicate, prev, cur),
      target
    )
);