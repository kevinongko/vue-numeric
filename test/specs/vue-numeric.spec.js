/* eslint-env mocha */
import Vue from 'vue'
import { expect } from 'chai'
import { mount } from 'avoriaz'
import VueNumeric from '@/vue-numeric'
import sinon from 'sinon'

describe('vue-numeric.vue', () => {
  it('Use default decimal separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000 }})
    expect(wrapper.data().amount).to.equal('2,000')
  })

  it('format values with currency prefix', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, currency: 'USD' }})
    expect(wrapper.data().amount).to.equal('USD 2,000')
  })

  it('format values with currency suffix', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, currency: 'CZK', currencySymbolPosition: 'suffix' }})
    expect(wrapper.data().amount).to.equal('2,000 CZK')
  })

  it('format values with decimals', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000.34, precision: 2, currency: '$' }})
    expect(wrapper.data().amount).to.equal('$ 2,000.34')
  })

  it('format values with decimals even when no decimal specified', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, precision: 2, currency: '$' }})
    expect(wrapper.data().amount).to.equal('$ 2,000.00')
  })

  it('format values with decimals rounded', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000.36, precision: 1, currency: '$' }})
    expect(wrapper.data().amount).to.equal('$ 2,000.4')
  })

  it('format values with . separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000000, currency: '$', separator: '.', precision: 2 }})
    expect(wrapper.data().amount).to.equal('$ 2.000.000,00')
  })

  it('format values with , separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000000, currency: '$', separator: ',', precision: 2 }})
    expect(wrapper.data().amount).to.equal('$ 2,000,000.00')
  })

  it('format values with space separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000000, currency: '$', separator: 'space', precision: 2  }})
    expect(wrapper.data().amount).to.equal('$ 2 000 000,00')
  })

  it('format values with correct decimals symbol when using different thousand separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 20000.36, precision: 1, currency: '$', separator: '.' }})
    expect(wrapper.data().amount).to.equal('$ 20.000,4')
  })

  it('outputs Number type by default', () => {
    const component = Vue.extend({
      data: () => ({ total: 100 }),
      template: '<div><vue-numeric v-model="total" :min="1" :max="100"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(typeof wrapper.data().total).to.equal('number')
  })

  it('outputs String if specified', () => {
    const component = Vue.extend({
        data: () => ({ total: 100 }),
        template: '<div><vue-numeric v-model="total" outputType="String" :min="1" :max="100"></vue-numeric></div>',
        components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(typeof wrapper.data().total).to.equal('string')
  })

  it('is <span> tag in read-only mode', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, currency: '$', readOnly: true, readOnlyClass: 'test-class' }})
    wrapper.update()
    expect(wrapper.is('span')).to.equal(true)
    expect(wrapper.hasClass('test-class')).to.equal(true)
    expect(wrapper.text()).is.equal('$ 2,000')
  })

  it('apply class when read-only mode enabled', done => {
    const propsData = { value: 3000, readOnly: false, readOnlyClass: 'testclass' }
    const wrapper = mount(VueNumeric, { propsData })

    wrapper.setProps({ readOnly: true })

    wrapper.instance().$nextTick(() => {
      expect(wrapper.instance().$el.className).to.equal('testclass')
      done()
    })
  })

  it('does not apply class when read-only mode disabled', done => {
    const propsData = { value: 3000, readOnly: true, readOnlyClass: 'testclass' }
    const wrapper = mount(VueNumeric, { propsData })

    wrapper.setProps({ readOnly: false })
    wrapper.instance().$nextTick(() => {
      expect(wrapper.instance().$el.className).to.equal('')
      done()
    })
  })

  it('cannot exceed max props', () => {
    const component = Vue.extend({
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric v-model="total" :max="100"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(100)
  })

  it('cannot below min props', () => {
    const component = Vue.extend({
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric v-model="total" :min="200"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(200)
  })

  it('process valid value ', () => {
    const component = Vue.extend({
      data: () => ({ total: 100 }),
      template: '<div><vue-numeric v-model="total" :min="10" :max="200"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(100)
  })

  it('allow minus value when minus props is true', () => {
    const component = Vue.extend({
      data: () => ({ total: -150 }),
      template: '<div><vue-numeric v-model="total" :min="-150" :minus="true"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(-150)
  })

  it('disallow minus value when minus props is false', () => {
    const component = Vue.extend({
      data: () => ({ total: -150 }),
      template: '<div><vue-numeric v-model="total" :min="-150" :minus="false"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(0)
  })

  it('updates delayed value with format if without focus', done => {
    const el = document.createElement('div')
    const vm = new Vue({
      el,
      data: () => ({ total: 0 }),
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    setTimeout(() => {
      vm.total = 3000
    }, 100);

    setTimeout(() => {
      expect(vm.$el.firstChild.value.trim()).to.equal('3,000')
      done()
    }, 500);
  })

  it('remove space if currency props undefined', () => {
    const wrapper = mount(VueNumeric, {propsData: { value: 2000 }})
    expect(wrapper.data().amount).to.equal('2,000')
  })

  it('format value on blur', () => {
    const wrapper = mount(VueNumeric, {propsData: { value: 2000 }})
    wrapper.trigger('blur')
    expect(wrapper.data().amount).to.equal('2,000')
  })

  it('clear the field if zero value', () => {
    const wrapper = mount(VueNumeric, {propsData: { value: 0, separator: '.', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.data().amount).to.equal(null)
  })

  it('remove thousand separator and symbol on focus with , decimal', () => {
    const wrapper = mount(VueNumeric, {propsData: { value: 2000.21, separator: '.', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.data().amount).to.equal('2000,21')
  })

  it('remove thousand separator and symbol on focus with . decimal', () => {
    const wrapper = mount(VueNumeric, {propsData: { value: 2000.21, separator: ',', precision: 2 }})
    wrapper.trigger('focus')
    expect(wrapper.data().amount).to.equal('2000.21')
  })

  it('process value on input', () => {
    const process = sinon.stub()
    const wrapper = mount(VueNumeric, { propsData: { value: 2000 }, methods: { process }})
    wrapper.trigger('input')
    expect(process.called).to.equal(true)
  })

  it('does not show default value when placeholder if defined', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, placeholder: 'number here' }})
    expect(wrapper.data().amount).to.equal('')
  })

  it('sets the value to 0 when no empty value is provided and input is empty', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: '' }})
    expect(wrapper.data().amount).to.equal('0')
  })

  it('uses the provided empty value when input is empty', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: '', emptyValue: 1 }})
    expect(wrapper.data().amount).to.equal('1')
  })

  it('apply min props value if user input negative value when minus props disabled', () => {
    const component = Vue.extend({
      data: () => ({ total: -200 }),
      template: '<div><vue-numeric v-model="total" :min="150" :minus="false"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(150)
  })

  it('apply 0 value if user input negative value when minus props disabled and min props is negative too', () => {
    const component = Vue.extend({
      data: () => ({ total: -200 }),
      template: '<div><vue-numeric v-model="total" :min="-150" :minus="false"></vue-numeric></div>',
      components: { VueNumeric }
    })

    const wrapper = mount(component)
    expect(wrapper.data().total).to.equal(0)
  })

  it('apply new separator immediately if it is changed', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, separator: ',' }})
    wrapper.setProps({ separator: '.' })
    expect(wrapper.data().amount).to.equal('2.000')
  })

  it('apply new currency prop immediately if it is changed', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 0, currency: '$' }})
    wrapper.setProps({ currency: 'USD' })
    expect(wrapper.data().amount).to.equal('USD 0')
  })

  it('apply new precision immediately if it is changed', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000.17, precision: 2 }})
    wrapper.setProps({ precision: 1 })
    expect(wrapper.data().amount).to.equal('2,000.2')
  })

  it('allow to use arbitrary separators', () => {
    const wrapper = mount(VueNumeric, {
      propsData: {
        value: 1000.94 ,
        precision: 2,
        thousandSeparator: ' ',
        decimalSeparator: ','
      }
    })
    expect(wrapper.data().amount).to.equal('1 000,94')
  })
})
