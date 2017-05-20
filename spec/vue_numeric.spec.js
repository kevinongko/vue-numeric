import Vue from 'vue';
Vue.config.productionTip = false;
import VueNumeric from './../src/vue-numeric.vue';

function getInput(Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData: propsData }).$mount()
  return vm.$el;
}

describe("vue-numeric", function() {

  let el;

  beforeEach(() => {
    el = document.createElement('div');

    document.body.appendChild(el);
  });

  it("Uses the default decimal separator ,", done => {

    var input = getInput(VueNumeric, { value: '2000' });
    Vue.nextTick(() => {
      expect(input.value).toEqual(' 2,000')
      done()
    });

  });

  it('updates value with format if without focus', done => {
    const vm = new Vue({
      el,
      data: function() {
        return {
          total: 0
        }
      },
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.total = 3000;

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).toEqual('3,000')
      done()
    });

  });


  it('updates value without format', done => {
    const vm = new Vue({
      el,
      data: function() {
        return {
          total: 0
        }
      },
      template: '<div><vue-numeric v-model="total"></vue-numeric></div>',
      components: { VueNumeric }
    }).$mount()

    vm.$el.firstChild.focus();
    vm.total = 3000;

    Vue.nextTick(() => {
      expect(vm.$el.firstChild.value.trim()).toEqual('3000');
      done()
    });

  });


});
