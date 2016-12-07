<template>
  <input type="tel" ref="numeric" :value="value" @input="updateValue(amount)" v-model="amount">
</template>

<script>
export default {

  name: 'Vue-Numeric',

  props: {
    placeholder: {
      required: false,
      type: String
    },

    value: {
      default: 0,
      required: true,
      type: [String, Number]
    },

    currency: {
      default: '',
      required: false,
      type: String
    },

    separator: {
      default: '',
      required: false,
      type: String
    }
  },

  data () {
    return {
      amount: ''
    }
  },

  mounted () {
    this.updateValue(this.value)
  },

  methods: {
    updateValue (value) {
      const number = +value.replace(/[^0-9]+/g, '')
      this.amount = this.format(number)
      this.$emit('input', number)
    },

    format (value) {
      const numberWithSeparator = Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)
      return this.currency + ' ' + numberWithSeparator
    }
  }

}
</script>
