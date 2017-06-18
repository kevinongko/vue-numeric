/* global beforeEach, expect, it, describe */

import Vue from 'vue'
import VueNumeric from './../src/vue-numeric.vue'
Vue.config.productionTip = false

function getInput (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el
}

describe('vue-numeric', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')

    document.body.appendChild(el)
  })

  it('Uses the default decimal separator ,', done => {
    var input = getInput(VueNumeric, { value: '2000' })
    Vue.nextTick(() => {
      expect(input.value).toEqual(' 2,000')
      done()
    })
  })

  it('updates value with format if without focus', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 0
        }
      },
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.total = 3000

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).toEqual('3,000')
      done()
    })
  })

  it('updates values decimals', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 0
        }
      },
      template: `<div>
        <vue-numeric v-model="total" separator="." precision="2"></vue-numeric>
        <span>{{total}}</span>
      </div>`,
      components: { VueNumeric }
    }).$mount()

    vm.total = 3000

    Vue.nextTick(() => {
      const span = vm.$el.getElementsByTagName('span')[0]
      expect(span.textContent.trim()).toEqual('3000')
      expect(vm.$el.firstChild.value.trim()).toEqual('3.000,00')
      done()
    })
  })

  it('accepts decimal values', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 200.22,
          subtotal: '110.98',
          large: '10.000,1'
        }
      },
      template: `<div>
        <vue-numeric v-model="large" separator="." precision="2"></vue-numeric>
        <vue-numeric v-model="total" separator="." precision="2"></vue-numeric>
        <vue-numeric v-model="subtotal" precision="2"></vue-numeric>
      </div>`,
      components: { VueNumeric }
    }).$mount()

    Vue.nextTick(() => {
      expect(vm.$el.children[0].value.trim()).toEqual('10.000,10')
      expect(vm.$el.children[1].value.trim()).toEqual('200,22')
      expect(vm.$el.children[2].value.trim()).toEqual('110.98')
      done()
    })
  })

  it('updates values with correct separator', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 0
        }
      },
      template: `<div>
        <vue-numeric v-model="total" separator="."></vue-numeric>
        <span>{{total}}</span>
      </div>`,
      components: { VueNumeric }
    }).$mount()

    vm.total = 3000

    Vue.nextTick(() => {
      const span = vm.$el.getElementsByTagName('span')[0]
      expect(span.textContent.trim()).toEqual('3000')
      expect(vm.$el.firstChild.value.trim()).toEqual('3.000')
      done()
    })
  })

  it('updates value without format', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 0
        }
      },
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.$el.firstChild.focus()
    vm.total = 3000

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).toEqual('3000')
      done()
    })
  })

  it('show span tag in read-only mode', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 100
        }
      },
      template: '<div><vue-numeric v-model="total" :read-only="true" read-only-class="test-class"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.tagName).toEqual('SPAN')
      const span = vm.$el.getElementsByTagName('span')[0]
      expect(span.textContent.trim()).toEqual('100')
      expect(span.className).toEqual('test-class')
      done()
    })
  })

  it('show correct span tag when toggle read-only mode', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: 100,
          readOnly: false
        }
      },
      template: '<div><vue-numeric v-model="total" :read-only="readOnly" read-only-class="test-class"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.readOnly = true

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.tagName).toEqual('SPAN')
      const span = vm.$el.getElementsByTagName('span')[0]
      expect(span.textContent.trim()).toEqual('100')

      Vue.nextTick(() => { expect(span.className).toEqual('test-class') })
      done()
    })
  })

  it('don\'t format empty values', done => {
    const vm = new Vue({
      el,
      data () {
        return {
          total: ""
        }
      },
      template: '<div><vue-numeric :empty="true" v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    Vue.nextTick(() => {
      setTimeout(() => {
        expect(vm.$el.firstChild.value).toEqual("")
        done()
      }, 600)
    })
  })


})
