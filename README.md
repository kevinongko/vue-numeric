# vue-numeric

[![npm](https://img.shields.io/npm/v/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/dt/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/dm/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![Build Status](https://travis-ci.org/kevinongko/vue-numeric.svg?branch=master)](https://travis-ci.org/kevinongko/vue-numeric)
[![Codecov](https://img.shields.io/codecov/c/github/kevinongko/vue-numeric.svg)](https://codecov.io/gh/kevinongko/vue-numeric)
[![npm](https://img.shields.io/npm/l/vue-numeric.svg)](http://opensource.org/licenses/MIT)

Input field component to display currency value based on [Vue](https://vuejs.org/).

[Live Demo](https://kevinongko.github.io/vue-numeric/)

`Works with Vue 2.*`

## Installation

```sh
$ npm install vue-numeric --save
```

## Usage

![screen shot 2016-12-08 at 2 19 31 pm](https://cloud.githubusercontent.com/assets/15880638/21001265/f2322438-bd51-11e6-8985-f31a45702484.png)

### Quick example

```vue
<template>
  <vue-numeric currency="$" separator="," v-model="price"></vue-numeric>
</template>

<script>
import VueNumeric from 'vue-numeric'

export default {

  name: 'App',

  components: {
    VueNumeric
  },

  data: () => ({
    price: ''
  }),
}
</script>

```

### Currency prefix

adding currency prefix to the input by using `currency` props.

```vue
<vue-numeric currency="$"></vue-numeric>
```

### Minimum & maximum constraint

Limit minimum and maximum input by using `min, max` props.

- `min` default to `0`.
- `min, max` accept `String` and `Number`.

```vue
<vue-numeric min="2000" v-bind:max="10000"></vue-numeric>
```

### Disable/enable minus value
- `minus` default to `false`.

```vue
<vue-numeric v-bind:minus="false"></vue-numeric>
```

### Enable decimal value
By default the decimal value is disabled, to use decimal value add `precision` props.
- `precision` accept `String` and `Number` numeric value.

```vue
<vue-numeric v-bind:precision="2"></vue-numeric>
```

### Thousand separator
- Default thousand separator's symbol is `,`.
- Use `separator` props to change separator's symbol.
- `separator` only accept either `,` or `.` value.
- When using `.` separator symbol, to input decimal value use `,` and vice versa.

```vue
<vue-numeric separator="."></vue-numeric>
```

### Input placeholder when empty
```vue
<vue-numeric placeholder="only number allowed"></vue-numeric>
```

## Props
|Props|Description|Required|Type|Default|
|-----|-----------|--------|----|-------|
|currency|Currency prefix|false|String|-|
|currency-symbol-position|Position for the symbol|false|String|'prefix'|
|max|Maximum value allowed|false|Number, String|-|
|min|Minimum value allowed|false|Number, String|0|
|minus|Enable/disable minus value|false|Boolean|false|
|placeholder|Input placeholder|false|String|-|
|precision|Number of decimals|false|Number, String|-|
|separator|Thousand separator type ( accept either `.` or `,` )|false|String|,|
|read-only|Hide input field and show the value in text|false|Boolean|false|
|read-only-class|Class for read-only element|false|String|''|

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
