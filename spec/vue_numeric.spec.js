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


});
