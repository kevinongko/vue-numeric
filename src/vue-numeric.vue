<template>
  <input
    :placeholder="placeholder"
    :value="value"
    @blur="formatValue(amountValue)"
    @input="processValue(amountValue)"
    @focus="focus"
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
     * Enable/Disable formatting on input.
     */
    formatInput: {
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
      if (this.formatInput && this.precision > 0) {
        let value = this.amount.replace(/[^0-9]/g, '')
        let decimalSeparatorPosition = value.length - this.precision
        return Number(value.slice(0, decimalSeparatorPosition) + '.' + value.slice(decimalSeparatorPosition, value.length))
      }

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

      if (this.formatInput) {
        this.formatValue(this.amountValue)
      }
    },

    /**
     * Format value using symbol and separator.
     * @param {Number} value
     */
    formatValue (value) {
      this.amount = accounting.formatMoney(value, {
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
    },

    /**
     * Check the format-input props is enable or not
     */
    focus () {
      if (!this.formatInput) {
        this.convertToNumber(this.numberValue)
      }
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
      this.formatValue(this.formatToNumber(this.value))
    }

    // Set read-only span element's class
    if (this.readOnly) {
      this.$refs.readOnly.className = this.readOnlyClass
    }

    // In case of delayed v-model new value.
    setTimeout(() => {
      this.processValue(this.formatToNumber(this.value))
      this.formatValue(this.formatToNumber(this.value))
    }, 500)
  }
}
</script>
