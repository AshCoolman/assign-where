# assign-where

Like [`Object.assign`](https://mdn.io/Object/assign), but key/value assigning is determined by a predicate function

[![Coverage Status](https://coveralls.io/repos/github/AshCoolman/assign-where/badge.svg?branch=feature%2Fcoveralls)](https://coveralls.io/github/AshCoolman/assign-where?branch=feature%2Fcoveralls) _I suspect the branch coverage should be 100%, I believe [istanbul does not handle babel](https://github.com/jmcriffey/babel-istanbul/issues/56) very well_

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
* `target` (object): The object to be assigned onto (to be mutated)
* `[sources]` (Array of objects): The source objects

## Examples

### On key

```
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

```
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

* `target` is mutated
* `sources` of `null` and `undefined` are ignored (like [`Object.assign`](https://mdn.io/Object/assign))
* Based on [`Object.assign`](https://mdn.io/Object/assign), and [`Array.filter`](https://mdn.io/Array/filter)
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


### Todo

1. Add test coverage report