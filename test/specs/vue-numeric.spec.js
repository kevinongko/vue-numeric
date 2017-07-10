/* eslint-env mocha */
import Vue from 'vue'
import { expect } from 'chai'
import { mount } from 'avoriaz'
import VueNumeric from '@/vue-numeric'

describe('vue-numeric.vue', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('has name', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 0 } })
    expect(wrapper.name()).to.equal('vue-numeric')
  })

  it('remove other than numeric value', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: '20as00df' } })
    expect(wrapper.data().amount).to.equal(' 2,000')
  })

  it('Use default decimal separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: '2000' } })
    expect(wrapper.data().amount).to.equal(' 2,000')
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

  it('format values with correct separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000000, currency: '$', separator: '.' }})
    expect(wrapper.data().amount).to.equal('$ 2.000.000')
  })

  it('format values with correct decimals symbol when using different thousand separator', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 20000.36, precision: 1, currency: '$', separator: '.' }})
    expect(wrapper.data().amount).to.equal('$ 20.000,4')
  })

  it('is <span> tag in read-only mode', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, currency: '$', readOnly: true, readOnlyClass: 'test-class' }})
    wrapper.update()
    expect(wrapper.is('span')).to.equal(true)
    expect(wrapper.hasClass('test-class')).to.equal(true)
    expect(wrapper.text()).is.equal('$ 2,000')
  })

  it('allow minus value when minus props is true', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: -2000, currency: '$', minus: true }})
    expect(wrapper.data().amount).is.equal('$ -2,000')
  })

  it('disallow minus value when minus props is false', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: -2000, currency: '$', minus: false }})
    expect(wrapper.data().amount).is.equal('$ 2,000')
  })

  it('method checkMaxValue return false if value smaller than max props', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 2000, max: 3000 }})
    expect(wrapper.vm.checkMaxValue(2000)).is.equal(false)
  })

  it('method checkMinValue return false if value bigger than min props', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 3000, min: 1000 }})
    expect(wrapper.vm.checkMinValue(1000)).is.equal(false)
  })

  it('computed minValue return 0 if min props undefined', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 3000 }})
    expect(wrapper.vm.minValue).to.equal(0)
  })

  it('computed maxValue return undefined if max props undefined', () => {
    const wrapper = mount(VueNumeric, { propsData: { value: 3000 }})
    expect(wrapper.vm.maxValue).to.equal(undefined)
  })

  it('cannot exceed max props', done => {
    const vm = new Vue({
      el,
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric v-model="total" :max="100"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).to.equal('100')
      done()
    })
  })

  it('cannot below min props', done => {
    const vm = new Vue({
      el,
      data: () => ({ total: 150 }),
      template: '<div><vue-numeric v-model="total" :min="200"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).to.equal('200')
      done()
    })
  })

  it('updates value with format if without focus', done => {
    const vm = new Vue({
      el,
      data: () => ({ total: 0 }),
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.total = 3000

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).to.equal('3,000')
      done()
    })
  })
})
