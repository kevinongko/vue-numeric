<template>
  <input
    :placeholder="placeholder"
    @blur="onBlurHandler"
    @input="onInputHandler"
    @focus="onFocusHandler"
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
      default: Number.MAX_SAFE_INTEGER,
      required: false,
      type: Number
    },

    /**
     * Minimum value allowed.
     */
    min: {
      default: Number.MIN_SAFE_INTEGER,
      required: false,
      type: Number
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
      type: Number
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
      default: 0,
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
     * Number type of formatted value.
     * @return {Number}
     */
    amountNumber () {
      return this.unformat(this.amount)
    },

    /**
     * Number type of value props.
     * @return {Number}
     */
    valueNumber () {
      return this.unformat(this.value)
    },

    /**
     * Define decimal separator based on separator props.
     * @return {String} '.' or ','
     */
    decimalSeparator () {
      if (this.separator === ',') return '.'
      return ','
    },

    /**
     * Define thousand separator based on separator props.
     * @return {String} '.' or ','
     */
    thousandSeparator () {
      if (this.separator === '.') return '.'
      if (this.separator === 'space') return ' '
      return ','
    },

    /**
     * Define format position for currency symbol and value.
     * @return {String} format
     */
    symbolPosition () {
      if (!this.currency) return '%v'
      return this.currencySymbolPosition === 'suffix' ? '%v %s' : '%s %v'
    }
  },

  methods: {
    /**
     * Handle blur event.
     */
    onBlurHandler (e) {
      this.$emit('blur', e)
      this.amount = this.format(this.valueNumber)
    },

    /**
     * Handle focus event.
     */
    onFocusHandler (e) {
      this.$emit('focus', e)
      this.amount = accounting.formatMoney(this.valueNumber, {
        symbol: '',
        format: '%v',
        thousand: '',
        decimal: this.decimalSeparator,
        precision: Number(this.precision)
      })
    },

    /**
     * Handle input event.
     */
    onInputHandler () {
      this.process(this.amountNumber)
    },

    /**
     * Validate value before update the component.
     * @param {Number} value
     */
    process (value) {
      if (value >= this.max) this.update(this.max)
      if (value <= this.min) this.update(this.min)
      if (value > this.min && value < this.max) this.update(value)
      if (!this.minus && value < 0) this.min >= 0 ? this.update(this.min) : this.update(0)
    },

    /**
     * Update parent component model value.
     * @param {Number} value
     */
    update (value) {
      this.$emit('input', Number(accounting.toFixed(value, this.precision)))
    },

    /**
     * Format value using symbol and separator.
     * @param {Number} value
     * @return {String}
     */
    format (value) {
      return accounting.formatMoney(value, {
        symbol: this.currency,
        format: this.symbolPosition,
        precision: Number(this.precision),
        decimal: this.decimalSeparator,
        thousand: this.thousandSeparator
      })
    },

    /**
     * Remove symbol and separator.
     * @param {Number} value
     * @return {Number}
     */
    unformat (value) {
      return accounting.unformat(value, this.decimalSeparator)
    }
  },

  watch: {
    /**
     * Watch for value change from other input with same v-model.
     * @param {Number} newValue
     */
    valueNumber (newValue) {
      if (this.$refs.numeric !== document.activeElement) {
        this.amount = this.format(newValue)
      }
    },

    /**
     * When readOnly is true, replace the span tag class.
     * @param {Boolean} newValue
     * @param {Boolean} oldValue
     */
    readOnly (newValue, oldValue) {
      if (oldValue === false && newValue === true) {
        this.$nextTick(() => {
          this.$refs.readOnly.className = this.readOnlyClass
        })
      }
    },

    /**
     * Immediately reflect separator changes
     */
    separator () {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
    },

    /**
     * Immediately reflect currency changes
     */
    currency () {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)
    }
  },

  mounted () {
    // Set default value props when placeholder undefined.
    if (!this.placeholder) {
      this.process(this.valueNumber)
      this.amount = this.format(this.valueNumber)

      // In case of delayed props value.
      setTimeout(() => {
        this.process(this.valueNumber)
        this.amount = this.format(this.valueNumber)
      }, 500)
    }

    // Set read-only span element's class
    if (this.readOnly) this.$refs.readOnly.className = this.readOnlyClass
  }
}
</script>
