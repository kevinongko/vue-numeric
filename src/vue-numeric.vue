<template>
  <input type="tel" :value="value" v-model="amount" ref="numeric" :placeholder="placeholder" @blur="processValue(amountValue)">
</template>

<script>
import accounting from 'accounting-js'

export default {
  name: 'Vue-Numeric',

  props: {
    value: {
      type: [Number, String],
      required: true
    },

    default: {
      required: false,
      type: [Number, String]
    },

    precision: {
      required: false,
      type: [Number, String]
    },

    placeholder: {
      required: false,
      type: String
    },

    min: {
      default: 0,
      required: false,
      type: [Number, String]
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
      default: ',',
      required: true,
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
      if (this.min) return this.formatToNumber(this.min)
      return 0
    },

    maxValue () {
      if (this.max) return this.formatToNumber(this.max)
      return undefined
    },

    decimalSeparator () {
      if (this.separator === '.') return ','
      return '.'
    },

    thousandSeparator () {
      if (this.separator === '.') return '.'
      return ','
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
      if (this.thousandSeparator === '.') return Number(+value.replace(/[^0-9,]+/g, '').replace(',', '.'))
      if (this.thousandSeparator === ',') return Number(+value.replace(/[^0-9.]+/g, ''))
    },

    processValue (value) {
      if (isNaN(value)) {
        this.updateValue(this.minValue)
      } else if (this.checkMaxValue(value)) {
        this.updateValue(this.maxValue)
      } else if (this.checkMinValue(value)) {
        this.updateValue(this.minValue)
      } else {
        this.updateValue(value)
      }
    },

    updateValue (value) {
      this.amount = accounting.formatMoney(value, {
        symbol: this.currency + ' ',
        precision: Number(this.precision),
        decimal: this.decimalSeparator,
        thousand: this.thousandSeparator
      })

      this.$emit('input', accounting.toFixed(value, this.precision))
    }
  }
}
</script>