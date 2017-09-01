# vue-numeric

[![npm](https://img.shields.io/npm/v/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/dt/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/dm/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![Build Status](https://travis-ci.org/kevinongko/vue-numeric.svg?branch=master)](https://travis-ci.org/kevinongko/vue-numeric)
[![Codecov](https://img.shields.io/codecov/c/github/kevinongko/vue-numeric.svg)](https://codecov.io/gh/kevinongko/vue-numeric)
[![npm](https://img.shields.io/npm/l/vue-numeric.svg)](http://opensource.org/licenses/MIT)

Input field component to display a formatted currency value based on [Vue](https://vuejs.org/).

[Live Demo](https://kevinongko.github.io/vue-numeric/)

**Works with Vue 2.***

## Installation

```sh
$ npm install vue-numeric --save
```

### Install as Component
```js
import Vue from 'vue'
import VueNumeric from 'vue-numeric'

export default {
  name: 'App',

  components: {
    VueNumeric
  }
}
```

### Install as Plugin
```js
import Vue from 'vue'
import VueNumeric from 'vue-numeric'

Vue.use(VueNumeric)
```

### Install via CDN
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-numeric"></script>

<script>
  Vue.use(VueNumeric.default)
</script>
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

### Currency symbol

Set the `currency` prop to add a currency symbol within the input.

```vue
<vue-numeric currency="$"></vue-numeric>
```

### Minimum & maximum constraint

Limit the minimum and maximum value by using `min` and `max` props.

- `min` defaults to `0`.
- `min` and `max` accept `String` or `Number` values.

```vue
<vue-numeric min="2000" v-bind:max="10000"></vue-numeric>
```

### Disable/enable negative values

`minus` defaults to `false` (no negative numbers).

```vue
<vue-numeric v-bind:minus="false"></vue-numeric>
```

### Enable decimal precision

By default the decimal value is disabled. To use decimals in the value, add the `precision` prop.
- `precision` accept a `String` or `Number` numeric value.

```vue
<vue-numeric v-bind:precision="2"></vue-numeric>
```

### Thousands separator
- Default thousand separator's symbol is `,`.
- Use the `separator` prop to change the thousands separator.
- `separator` only accepts `,` or `.`.
- When using the `.` as a separator, use a `,` for a decimal and vice versa.

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
|currency-symbol-position|Position of the symbol (accepted values: `prefix` or `suffix`)|false|String|`prefix`|
|max|Maximum value allowed|false|Number, String|-|
|min|Minimum value allowed|false|Number, String|0|
|minus|Enable/disable negative values|false|Boolean|`false`|
|placeholder|Input placeholder|false|String|-|
|precision|Number of decimals|false|Number, String|-|
|separator|Thousand separator symbole (accepts either `.` or `,`)|false|String|`,`|
|read-only|Hide input field and show the value as text|false|Boolean|false|
|read-only-class|Class for read-only element|false|String|''|

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
