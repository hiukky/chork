<div align="center">
  <img width="250" alt="chork logo" src="./assets/chork.svg"/>
</div>

<h3 align="center"> Minimalist JS data type checking utility. </h3>

<p align="center">
  <sub>Built with ❤︎ by <a href="https://hiukky.com">Hiukky</a>
  <br/>
</p>

<br>

<div align="center">
  <a href="https://github.com/hiukky/chork/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/hiukky/chork?color=FF7A92&style=for-the-badge&colorA=1F2630">
  </a>
  <a href="https://github.com/hiukky/chork/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/hiukky/chork?style=for-the-badge&color=FF7A92&colorA=1F2630">
  </a>
  <a href="https://github.com/hiukky/chork/network">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/hiukky/chork?color=FF7A92&style=for-the-badge&colorA=1F2630">
  </a>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/chork">
   <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/chork?color=1F2630&style=for-the-badge&colorA=1F2630&label=size">
  </a>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/chork">
    <img alt="NPM" src="https://img.shields.io/npm/dt/chork?color=1F2630&style=for-the-badge&colorA=1F2630" />
    </a>
</div>

# About

Chork is a minimal library for checking data types in javascript.

Typeof `typeof` works well, but only for variables of the primitive type and not for structures like Array, Date and others. Chork solves this by bringing the real type of past value.

<br>

# Installation

### Using NPM

```
npm i chork
```

### Using Yarn

```
yarn add chork
```

<br>

# Use

Currently, chork has two test functions which are `check` and `checkAll`.

- ### check

It receives only one argument of any kind.

```ts
import { check } from 'chork'

check(1) // 'number'
check('foo') // 'string'
check([1, 'foo']) // 'array'
check({ key: 1 }) // 'object'
check(new Date()) // 'date'
```

- ### checkAll

The `checkAll` function works in the same way as `check`, the only difference is that it returns an object with a `key` being its own value and a `value` being the result with the type of data tested.

```ts
import { check } from 'chork'

checkAll(1) // { '1': 'number' }
checkAll('foo') // { foo: 'string' }
checkAll([1, 'foo']) // { '1': 'number', foo: 'string' }
checkAll({ key: 1 }) // { key: 'number' }
checkAll(new Date()) // { 'Sat Feb 06 2021 12:35:41 GMT-0300 (Brasilia Standard Time)': 'date' }
```

### Available types

- **string**
- **number**
- **bigint**
- **boolean**
- **undefined**
- **symbol**
- **null**
- **object**
- **array**
- **map**
- **date**
- **function**

<br>

# Contributing

Chork is in an initial version without many features yet, but you can feel free to send your suggestion or open a PR.

<br>

<div align="center">
  <a target="_blank" rel="noopener noreferrer" href="https://www.buymeacoffee.com/hiukky">
    <img width="250" alt="buy me a coffee" src="./assets/coffe.svg"/>
  </a>
</div>

<br>

<div align="center">
  <a href="https://github.com/hiukky/chork/blob/master/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/hiukky/chork?color=1F2630&style=for-the-badge&colorA=1F2630" />
  </a>
</div>
