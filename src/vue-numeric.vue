<template>
  <input type="tel" ref="numeric" :value="value" @input="updateValue(amountValue)" v-model="amount">
</template>

<script>
import _ from 'lodash'

export default {

  name: 'vue-numeric',

  props: {
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

    min: {
      required: false,
      type: Number
    },

    max: {
      required: false,
      type: Number
    },

    separator: {
      default: '',
      required: false,
      type: String
    }
  },

  data: () => ({
    amount: ''
  }),

  computed: {
    defaultValue () {
      return _.toNumber(this.value)
    },

    amountValue () {
      return _.toNumber(this.amount)
    }
  },

  methods: {
    checkMinValue (value) {
      if (this.min) {
        if (value >= this.min) return true
        return false
      }
      return true
    },

    checkMaxValue (value) {
      if (this.max) {
        if (value <= this.max) return true
        return false
      }
      return true
    },

    format (value) {
      const numberWithSeparator = Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)
      return this.currency + ' ' + numberWithSeparator
    },

    updateValue (value) {
      if (this.checkMinValue(value) && this.checkMaxValue(value)) {
        this.amount = this.format(value)
        this.$emit('input', value)
      }
    }
  },

  mounted () {
    this.updateValue(this.defaultValue)
  }
}
</script>
