import component from './vue-numeric.vue'

const plugin = {
  install: Vue => {
    Vue.component('vue-numeric', component)
  }
};

component.install = plugin.install

export default component
export { component, plugin }