# vue-numeric

[![npm version](https://badge.fury.io/js/vue-numeric.svg)](https://badge.fury.io/js/vue-numeric)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](http://opensource.org/licenses/MIT)

Numeric input component based on [Vue](https://vuejs.org/).

## Installation

```sh
$ npm install vue-numeric --save-dev
```


## Usage

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

## License

Vue-Numeric is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

