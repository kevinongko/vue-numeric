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
  <span v-else ref="readOnly"> {{ amount }} </span>
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
      required: false,
      type: [Number, String],
      default: null
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
     * Empty value allowed.
     */
    empty: {
      default: false,
      required: false,
      type: Boolean
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
      return (this.canFormat(this.amount)) ? this.formatToNumber(this.amount) : null
    },

    /**
     * Number type from value props.
     * @return {Number}
     */
    numberValue () {
      return (this.canFormat(this.amount)) ? this.formatToNumber(this.value) : null
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
     * Checks whether the value can be formatted
     * @param {Number} value
     * @return {Boolean}
     */
    canFormat (value) {
      if (this.empty && (value === "" || value === null))
        return false
      return true      
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
      if (this.canFormat(value)) {
        if (isNaN(value)) {
          this.updateValue(this.minValue)
        } else if (this.checkMaxValue(value)) {
          this.updateValue(this.maxValue)
        } else if (this.checkMinValue(value)) {
          this.updateValue(this.minValue)
        } else {
          this.updateValue(value)
        }
      } else {
        this.updateValue(value)
      }
    },

    /**
     * Format value using symbol and separator.
     */
    formatValue () {
      if (this.canFormat(this.amount))
        this.amount = accounting.formatMoney(this.numberValue, {
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
      this.$emit('input', this.canFormat(value) ? Number(accounting.toFixed(value, this.precision)) : value)
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
      if (this.canFormat(value))
        this.amount = this.numberToString(value)
      else
        this.amount = value
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
    // Set read-only span element's class
    if (this.readOnly) {
      this.$refs.readOnly.className = this.readOnlyClass
    }

    // Check default value from parent v-model.
    if (this.canFormat(this.value) && this.value) {
      this.processValue(this.formatToNumber(this.value))
      this.formatValue(this.value)
    }

    // In case of delayed v-model new value.
    setTimeout(() => {
      if (this.canFormat(this.value)) {
        this.processValue(this.formatToNumber(this.value))
        this.formatValue(this.value)
      }
    }, 500)
  }
}
</script>
