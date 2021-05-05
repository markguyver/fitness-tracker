// Framework Javascript Imports
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vue from 'vue'
// import VueApexCharts from 'vue-apexcharts'
import VueRouter from 'vue-router';

// Framework CSS Imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Application Imports
import App from './App.vue'

// Configure Frameworkv
Vue.config.productionTip = false

// Load Framework Plugins
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(IconsPlugin);
// Vue.component('apexchart', VueApexCharts);

// Start Application
new Vue({
  render: h => h(App),
}).$mount('#app')
