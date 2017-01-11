# vue-numeric

[![npm version](https://badge.fury.io/js/vue-numeric.svg)](https://badge.fury.io/js/vue-numeric)
[![npm](https://img.shields.io/npm/dt/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/l/vue-numeric.svg)](http://opensource.org/licenses/MIT)

Input field component to display currency value based on [Vue](https://vuejs.org/).

## Installation

```sh
$ npm install vue-numeric --save
```


## Usage

![screen shot 2016-12-08 at 2 19 31 pm](https://cloud.githubusercontent.com/assets/15880638/21001265/f2322438-bd51-11e6-8985-f31a45702484.png)


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

## Props
```js
  /**
   * Currency symbol.
   */
  currency: {
    default: '',
    required: false,
    type: String
  },

  /**
   * Default value.
   */
  default: {
    required: false,
    type: [Number, String]
  },

  /**
   * Maximum value allowed.
   */
  max: {
    required: false,
    type: [Number, String]
  },

  /**
   * Minimum value allowed.
   */
  min: {
    default: 0,
    required: false,
    type: [Number, String]
  },

  /**
   * Enable/Disable minus value.
   */
  minus: {
    default: true,
    required: false,
    type: Boolean
  },

  /**
   * Input placeholder.
   */
  placeholder: {
    required: false,
    type: String
  },

  /**
   * Number of decimals.
   * Decimals symbol are the opposite of separator symbol.
   */
  precision: {
    required: false,
    type: [Number, String]
  },

  /**
   * Thousand separator type.
   * Separator props accept either . or , (default).
   */
  separator: {
    default: ',',
    required: false,
    type: String
  }
```

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
