'use strict';
var assert = require('assert');
var assignWhere = require('./main');

describe('assertWhere', function() {
  it('is a function', () => {
    assert.equal(typeof assignWhere, 'function');
  });
  let isTrue, isFalse;
  it('setup', () => {
    isTrue = () => true;
    isFalse = () => false;
  });
  describe('input', function() {
    describe('valid', function() {
      it('can be invoked ', function() {
        assignWhere(
          isTrue, {}
        );
      });
    });
    describe('throwing error based on inputs', function() {
      describe('no params', function() {
        it('throws error when missing all params', function() {
          assert.throws(
            ()=>assignWhere(),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
      });
      describe('if predicate is not function', function() {
        it('null', function() {
          assert.throws(
            ()=>assignWhere(null, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('undefined', function() {
          assert.throws(
            ()=>assignWhere(undefined, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('string', function() {
          assert.throws(
            ()=>assignWhere('notfn', {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
        it('object', function() {
          assert.throws(
            ()=>assignWhere({}, {}, {}),
            TypeError,
            /assignWhere expects first param to be a function/
          );
        });
      });
      describe('if target is not an object', function() {
        it('object (no error)', function() {
          assignWhere(isTrue, {}, {})
        });
        it('null', function() {
          assert.throws(
            ()=>assignWhere(isTrue, null, {}),
            TypeError,
            /assignWhere expects second param to be a non-null object/
          );
        });
        it('undefined', function() {
          assert.throws(
            ()=>assignWhere(isTrue, undefined, {}),
            TypeError,
            /assignWhere expects second param to be a non-null object/
          );
        });
        it('string', function() {
          assert.throws(
            ()=>assignWhere(isTrue, 'notobject', {}),
            TypeError,
            /assignWhere expects second param to be a non-null object/
          );
        });
      });
      describe('if sources are enumerable or null', function() {

        it('object (no error)', function() {
          assignWhere(isTrue, {}, {})
        });
        it('null (no error)', function() {
          assignWhere(isTrue, {}, null)
        });
        it('undefined (no error)', function() {
          assignWhere(isTrue, {});
        });
        it('undefined + null + undefined (no error)', function() {
          assignWhere(isTrue, {}, null, undefined, {});
        });
        it('string', function() {
          assert.throws(
            ()=>assignWhere(isTrue, 'notobject', {}),
            TypeError,
            /assignWhere expects second param to be a non-null object/
          );
        });
        it('undefined + null + undefined + string', function() {
          assert.throws(
            () => assignWhere(isTrue, {}, null, undefined, {}, 'notObject'),
            TypeError,
            /assignWhere expects second param to be a non-null object/
          );
        });
      });
    });
  });
  describe('output', function() {
    var a = 'a';
    var a1 = 'a2';
    var a2 = 'a2';
    var b = 1;
    var c = {deep: true};
    var aNull = null;
    var aUndefined = undefined;
    var aFalse = false;

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
          ([ key, value ]) => key === 'a',
          {},
          {a,b,c}
        ),
        {a}
      );
    });
    it('filters on key (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          ([ key, value ]) => key === 'a',
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
          ([key, value])=>typeof value === 'object',
          {},
          {a,b,c}
        ),
        {c}
      );
    });
    it('filters on value  (multiple sources)', () => {
      assert.deepEqual(
        assignWhere(
          ([key, value])=>typeof value === 'object',
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
  });
});