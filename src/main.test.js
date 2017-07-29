'use strict';
import assert from 'assert';
import assignWhere from './main.js';

describe('assertWhere', function() {
  let isTrue, isFalse;
  it('setup', () => {
    isTrue = () => true;
    isFalse = () => false;
  });
  describe('input', function() {
    describe('valid', function() {
      it('invokes with predicate and target', function() {
        assignWhere(isTrue, {});
      });
      it('invokes with predicate, target and source', function() {
        assignWhere(isTrue, {}, {})
      });
      it('invokes with predicate, target and source = null', function() {
        assignWhere(isTrue, {}, null)
      });
      it('invokes with predicate, target, and sources of undefined, null and enumerable objects', function() {
        assignWhere(isTrue, {}, null, undefined, {});
      });
    });

    describe('invalid inputs', function() {
      describe('missing params', function() {
        it('throws error when missing all params', function() {
          assert.throws(
            ()=>assignWhere(),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
      });
      describe('non-function predicate', function() {
        it('throws TypeError when predicate is null', function() {
          assert.throws(
            ()=>assignWhere(null, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('throws TypeError when predicate is undefined', function() {
          assert.throws(
            ()=>assignWhere(undefined, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('throws TypeError when predicate is a string', function() {
          assert.throws(
            ()=>assignWhere('notfn', {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('throws TypeError when predicate is a object', function() {
          assert.throws(
            ()=>assignWhere({}, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
      });
      describe('target is not an object', function() {
        it('throws TypeError if target is null', function() {
          assert.throws(
            ()=>assignWhere(isTrue, null, {}),
            TypeError,
            /Cannot convert null to object/
          );
        });
        it('throws TypeError if target is undefined', function() {
          assert.throws(
            ()=>assignWhere(isTrue, undefined, {}),
            TypeError,
            /Cannot convert undefined to object/
          );
        });
        it('coerces like Object.assign if target is a string', function() {
          assert.deepEqual(
            assignWhere(isTrue, 'notobject', {}),
            Object.assign('notobject', {})
          );
        });
      });
      describe('sources not being enumerable objects', function() {
        it('handles single string source like Object.assign', function() {
          assert.deepEqual(
            assignWhere(isTrue, {}, 'notobject'),
            Object.assign({}, 'notobject')
          );
        });
        it('handles string source like Object.assign', function() {
          assert.deepEqual(
            assignWhere(isTrue, {}, null, undefined, {}, 'notObject'),
            Object.assign({}, null, undefined, {}, 'notObject')
          );
        });
        it('handles number source like Object.assign', function() {
          assert.deepEqual(
            assignWhere(isTrue, {}, null, undefined, {}, 1),
            Object.assign({}, null, undefined, {}, 1)
          );
        });
        it('handles boolean source like Object.assign', function() {
          assert.deepEqual(
            assignWhere(isTrue, {}, null, undefined, {}, true, false),
            Object.assign({}, null, undefined, {}, true, false)
          );
        });
      });
    });
  });
  describe('output', function() {
    var a = 'a';
    var a1 = 'a1';
    var a2 = 'a2';
    var b = 1;
    var c = {deep: true};
    var aNull = null;
    var aUndefined = undefined;
    var aFalse = false;
    var isObject = ([key, value]) => typeof value === 'object';
    var startsWithA = ([ key, value ]) => key === 'a';
    it('setup', () => {
      assert.equal(isObject([null, undefined]), false);
      assert.equal(isObject([null, {}]), true);
    });
    it('returns same object if predicate function always returns true', () => {
      assert.deepEqual(
        assignWhere(
          isTrue,
          {},
          {a,b,c}
        ),
        { a,b,c }
      );
    });
    it('returns same object if predicate function always returns true (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          isTrue,
          {},
          {a},
          {b},
          {c}
        ),
        { a,b,c }
      );
    });

    it('returns empty object if predicate function always returns false', () => {
      assert.deepEqual(
        assignWhere(
          isFalse,
          {},
          {a,b,c}
        ),
        {}
      );
    });
    it('returns empty object if predicate function always returns false (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          isFalse,
          {},
          {a},
          {b},
          {c}
        ),
        {}
      );
    });

    it('filters on key', () => {
      assert.deepEqual(
        assignWhere(
          startsWithA,
          {},
          {a,b,c}
        ),
        {a}
      );
    });
    it('filters on key (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          startsWithA,
          {},
          {a},
          {b},
          {c}
        ),
        {a}
      );
    });

    it('filters on value', () => {
      assert.deepEqual(
        assignWhere(
          isObject,
          {},
          {a,b,c}
        ),
        {c}
      );
    });
    it('filters on value  (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          isObject,
          {},
          {a},
          {b},
          {c}
        ),
        {c}
      );
    });
    it('ignores unefined and null', () => {
      assert.deepEqual(
        assignWhere(
          isTrue,
          {},
          {aNull, aUndefined, aFalse}
        ),
        {aFalse}
      );
    });
    it('overwrites in the correct order', () => {
      assert.deepEqual(
        assignWhere(
          isTrue,
          {a},
          {a: a1},
          {a: a2},
          {a: a1},
          {a: a2}
        ),
        {a:a2}
      );
    });

    it('handles arrays', () => {
      assert.deepEqual(
        assignWhere(
          isTrue,
          {a},
          [1, 2]
        ),
        {
          a,
          "0": 1,
          "1": 2
        }
      );
    });
  });
  describe('readme example', () => {
    describe('filters on key', () => {
      let target = { existing: 'here'}, output;
      it('executes', () => {
        output = assignWhere(
          ([key, value]) => key.startsWith('a'),
          target,
          { apple: 'Manzana'},
          { bannana: 'Banano'},
          { crab: 'crangrejo'}
        );
      })
      it('assigns correct values', () => {
        assert.deepEqual(
          output,
          {
            existing: 'here',
            apple: 'Manzana'
          }
        );
      });
      it('mutates target', () => {
        assert.strictEqual(target, output); 
      });
    });
    describe('filters on value', () => {      
      let target = { existing: 'here'}, output;
      it('executes', () => {
        output = assignWhere(
          ([key, value]) => value.endsWith('o'),
          target,
          { apple: 'Manzana'},
          { bannana: 'Banano'},
          { crab: 'crangrejo'}
        );
      });
      it('assigns correct values', () => {
        assert.deepEqual(
          output,
          {
            existing: 'here',
            bannana: 'Banano',
            crab: 'crangrejo'
          }
        );
      });
      it('mutates target', () => {
        assert.strictEqual(target, output); 
      });
    });
  });
});


