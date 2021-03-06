# assign-where

Like [`Object.assign`](https://mdn.io/Object/assign), but key/value assigning is determined by a predicate function

[![Coverage Status](https://coveralls.io/repos/github/AshCoolman/assign-where/badge.svg?branch=master)](https://coveralls.io/github/AshCoolman/assign-where?branch=master) 

## Installation

```sh
npm install assign-where --save
```

## API

```
assignWhere( predicate, target, [sources]);
```

Arguments:

* `predicate` (function): Takes an array `[key, value]`, and returns bool, This determins if each enumerable key/value should be assigned to `target`
* `target` (enumerable): The value to be assigned onto (to be mutated)
* `[sources]` (enumerables): The source values

NOTE: Like Object.assign, assignWhere will attempted to coerce target and sources to objects

## Examples

### On key

```js
import assignWhere from 'assign-where';

const target = { existing: 'here'};

const output = assignWhere(
  ([key, value]) => key.startsWith('a'),
  target,
  { apple: 'Manzana'},
  { bannana: 'Banano'},
  { crab: 'crangrejo'}
);

console.log(output);
// { existing: "here", apple: "Manzana" }

console.log(target === output);
// true
```

### On value

```js
import assignWhere from 'assign-where';

const target = { existing: 'here'};

const output = assignWhere(
  ([key, value]) => value.endsWith('o'),
  target,
  { apple: 'Manzana'},
  { bannana: 'Banano'},
  { crab: 'crangrejo'}
);

console.log(output);
// { existing: "here", bannana: "Banano", crab: "crangrejo" }

console.log(target === output);
// true
```

### Alternative

Use in-built functions

```js
let target = { existing: 'here'};

Object
  .entries(
    Object.assign(
      { apple: 'Manzana'},
      { bannana: 'Banano'},
      { crab: 'crangrejo'}
    )
  ).filter(
    ([key, value]) => value.endsWith('o')
  ).forEach(
    ([key, value]) => target[key] = value
  );

console.log(target);
// { existing: "here", bannana: "Banano", crab: "crangrejo" }

```

## Why?

The initial use case was in React, wanting to examine a Component's props and find all the custom data attributes `data-`.

```js
const dataAttr = ([k,v]) => k.startsWith('data-')
const MyComp = props =>
  <div
    {...assignWhere(dataAttr, props)}
  >
    <h1>{props.heading}</h1>
      <p>{props.content}</p>
  </div>

ReactDOM.render(
  <MyComp data-test data-x data-y />,
  document.getElementById('root')
);

document.querySelector('[data-test]']); // Works
```

## Notes

* Based on [`Object.assign`](https://mdn.io/Object/assign) (`target` is mutated), and [`Array.filter`](https://mdn.io/Array/filter)
* `sources` of `null` and `undefined` are ignored (like [`Object.assign`](https://mdn.io/Object/assign))
* `predicate` params based on output of [`Object.entries`](https://mdn.io/Object/entries)
* Uses [rollupjs](https://rollupjs.org/) & [babeljs](http://babeljs.io/) to build a commonjs module `bundle.js` from `src/main.js`


## NPM commands

### Tests

```sh
npm test
```

### Dev

```
npm run dev
```

### Build

```
npm run build
```
