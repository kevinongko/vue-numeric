# vue-numeric

[![npm version](https://badge.fury.io/js/vue-numeric.svg)](https://badge.fury.io/js/vue-numeric)
[![npm](https://img.shields.io/npm/dt/vue-numeric.svg)](https://www.npmjs.com/package/vue-numeric)
[![npm](https://img.shields.io/npm/l/vue-numeric.svg)](http://opensource.org/licenses/MIT)

Input field component to display currency value based on [Vue](https://vuejs.org/).

## Installation

```sh
$ npm install vue-numeric --save-dev
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

  data () {
    return {
      price: ''
    }
  }

}
</script>

```

## Props
```js

 /**
  * Default value.
  */
 default: {
   type: [String, Number],
   required: false
 },

 /**
  * Input placeholder.
  */
 placeholder: {
   type: String,
   required: false
 },

  /**
  * Number of decimals.
  * decimals symbol are the opposite of separator props
  */
 precision: {
   type: [String, Number]
   required: false
 },

 /**
  * Minimum value.
  */
 min: {
   type: [String, Number],
   required: false
 },

 /**
  * Maximum value.
  */
 max: {
   type: [String, Number],
   required: false
 },

 /**
  * Currency prefix.
  */
 currency: {
   type: String,
   required: true
 },

 /**
  * Thousand separator type.
  * Separator props accept either . or , (default)
  */
 separator: {
   type: String,
   required: false
 },

```

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

