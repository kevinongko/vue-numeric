<template>
  <input type="tel" :placeholder="placeholder" ref="numeric" @input="processValue(amountValue)" v-model="amount">
</template>

<script>
export default {
  name: 'Vue-Numeric',

  props: {
    default: {
      required: false,
      type: [String, Number]
    },

    placeholder: {
      required: false,
      type: String
    },

    min: {
      required: false,
      type: [String, Number]
    },

    max: {
      required: false,
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

  data: () => ({
    amount: ''
  }),

  computed: {
    amountValue () {
      return this.formatToNumber(this.amount)
    },

    defaultValue () {
      if (this.default) return this.formatToNumber(this.default)
      return 0
    },

    minValue () {
      return this.formatToNumber(this.min)
    },

    maxValue () {
      return this.formatToNumber(this.max)
    }
  },

  mounted () {
    if (this.default) this.processValue(this.defaultValue)
  },

  methods: {
    checkMaxValue (value) {
      if (this.max) {
        if (value <= this.maxValue) return false
        return true
      }
      return false
    },

    checkMinValue (value) {
      if (this.min) {
        if (value >= this.minValue) return false
        return true
      }
      return false
    },

    formatToNumber (value) {
      return Number(+value.replace(/[^0-9]+/g, ''))
    },

    formatToCurrency (value) {
      const numberWithSeparator = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)
      return this.currency + ' ' + numberWithSeparator
    },

    processValue (value) {
      if (this.checkMaxValue(value)) {
        this.updateValue(this.maxValue)
      } else if (this.checkMinValue(value)) {
        this.updateValue(this.minValue)
      } else {
        this.updateValue(value)
      }
    },

    updateValue (value) {
      this.amount = this.formatToCurrency(value)
      this.$emit('input', value)
    }

  }
}
</script>