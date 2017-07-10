<template>
  <input
    :placeholder="placeholder"
    :value="value"
    @blur="formatValue"
    @input="processValue(amountValue)"
    @focus="convertToNumber(numberValue)"
    ref="numeric"
    type="tel"
    v-model="amount"
    v-if="!readOnly"
  >
  <span v-else ref="readOnly">{{ amount }}</span>
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
    },

    /**
     * Hide input and show value in text only.
     */
    readOnly: {
      default: false,
      required: false,
      type: Boolean
    },

    /**
     * Class for the span tag when readOnly props is true.
     */
    readOnlyClass: {
      default: '',
      required: false,
      type: String
    },

    /**
     * Position of currency symbol
     * Symbol position props accept either 'suffix' or 'prefix' (default).
     */
    currencySymbolPosition: {
      default: 'prefix',
      required: false,
      type: String
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
     * Number type from value props.
     * @return {Number}
     */
    numberValue () {
      return this.formatToNumber(this.value)
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
    },

    /**
     * Define format for currency symbol and value.
     * @return {String} format
     */
    formatString () {
      return this.currencySymbolPosition === 'suffix' ? '%v %s' : '%s %v'
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
        let cleanValue = value
        if (typeof value !== 'string') {
          cleanValue = this.numberToString(value)
        }
        number = Number(String(cleanValue).replace(/[^0-9-,]+/g, '').replace(',', '.'))
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
      this.amount = accounting.formatMoney(this.numberValue, {
        symbol: this.currency,
        format: this.formatString,
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
     * Remove symbol and separator.
     * @param {Number} value
     */
    numberToString (value) {
      return accounting.formatMoney(value, {
        symbol: '',
        precision: Number(this.precision),
        decimal: this.decimalSeparator,
        thousand: ''
      })
    },

    /**
     * Remove symbol and separator.
     * @param {Number} value
     */
    convertToNumber (value) {
      this.amount = this.numberToString(value)
    }
  },

  watch: {
    /**
     * Watch for value change from other input.
     *
     * @param {Number} val
     * @param {Number} oldVal
     */
    numberValue (val, oldVal) {
      if (this.amountValue !== val && this.amountValue === oldVal) {
        this.convertToNumber(val)
        if (this.$refs.numeric !== document.activeElement) {
          this.formatValue(val)
        }
      }
    },

    /**
     * When readOnly is true, replace the span tag class.
     *
     * @param {Boolean} val
     * @param {Boolean} oldVal
     */
    readOnly (val, oldVal) {
      if (oldVal === false && val === true) {
        this.$nextTick(() => {
          this.$refs.readOnly.className = this.readOnlyClass
        })
      }
    }
  },

  mounted () {
    // Check default value from parent v-model.
    if (this.value) {
      this.processValue(this.formatToNumber(this.value))
      this.formatValue(this.value)
    }

    // Set read-only span element's class
    if (this.readOnly) {
      this.$refs.readOnly.className = this.readOnlyClass
    }

    // In case of delayed v-model new value.
    setTimeout(() => {
      this.processValue(this.formatToNumber(this.value))
      this.formatValue(this.value)
    }, 500)
  }
}
</script>
