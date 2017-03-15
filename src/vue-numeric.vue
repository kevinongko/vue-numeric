<template>
  <input
    :placeholder="placeholder"
    :value="value"
    @blur="formatValue(amountValue)"
    @input="processValue(amountValue)"
    @focus="convertValueToNumberType"
    ref="numeric"
    type="tel"
    v-model="amount"
  >
</template>

<script>
import accounting from 'accounting-js'

export default {
  name: 'vue-numeric',

  props: {
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
      default: false,
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
    },

    /**
     * v-model value.
     */
    value: {
      required: true,
      type: [Number, String]
    }
  },

  data: () => ({
    amount: ''
  }),

  computed: {
    /**
     * Number formatted user typed value.
     * @return {Number}
     */
    amountValue () {
      return this.formatToNumber(this.amount)
    },

    /**
     * Number formatted default value.
     * @return {Number}
     */
    defaultValue () {
      if (this.default) return this.formatToNumber(this.default)
      return 0
    },

    /**
     * Number formatted minimum value.
     * @return {Number}
     */
    minValue () {
      if (this.min) return this.formatToNumber(this.min)
      return 0
    },

    /**
     * Number formatted maximum value.
     * @return {Number|undefined}
     */
    maxValue () {
      if (this.max) return this.formatToNumber(this.max)
      return undefined
    },

    /**
     * Define decimal separator based on separator props.
     * @return {String} '.' or ','
     */
    decimalSeparator () {
      if (this.separator === '.') return ','
      return '.'
    },

    /**
     * Define thousand separator based on separator props.
     * @return {String} '.' or ','
     */
    thousandSeparator () {
      if (this.separator === '.') return '.'
      return ','
    }
  },

  methods: {
    /**
     * Check provided value againts maximum allowed.
     * @param {Number} value
     * @return {Boolean}
     */
    checkMaxValue (value) {
      if (this.max) {
        if (value <= this.maxValue) return false
        return true
      }
      return false
    },

    /**
     * Check provided value againts minimum allowed.
     * @param {Number} value
     * @return {Boolean}
     */
    checkMinValue (value) {
      if (this.min) {
        if (value >= this.minValue) return false
        return true
      }
      return false
    },

    /**
     * Format provided value to number type.
     * @param {String} value
     * @return {Number}
     */
    formatToNumber (value) {
      let number = 0

      if (this.separator === '.') {
        number = Number(String(value).replace(/[^0-9-,]+/g, '').replace(',', '.'))
      } else {
        number = Number(String(value).replace(/[^0-9-.]+/g, ''))
      }

      if (!this.minus) return Math.abs(number)
      return number
    },

    /**
     * Validate value before apply to the component.
     * @param {Number} value
     */
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

    /**
     * Format value using symbol and separator.
     */
    formatValue () {
      this.amount = accounting.formatMoney(this.value, {
        symbol: this.currency + ' ',
        precision: Number(this.precision),
        decimal: this.decimalSeparator,
        thousand: this.thousandSeparator
      })
    },

    /**
     * Update parent component model value.
     * @param {Number} value
     */
    updateValue (value) {
      this.$emit('input', Number(accounting.toFixed(value, this.precision)))
    },

    /**
     * Remove symbol and separator on focus.
     */
    convertValueToNumberType () {
      this.amount = this.value
    }
  },

  watch: {
    'default' (val, old) {
      this.processValue(this.defaultValue)
      this.formatValue(this.defaultValue)
    }
  },

  mounted () {
    if (this.defaultValue) {
      this.processValue(this.defaultValue)
      this.formatValue(this.defaultValue)
    }
  }
}
</script>
