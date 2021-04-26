import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VCurrencyField from 'v-currency-field';
import { VTextField } from 'vuetify/lib';  //Globally import VTextField


Vue.config.productionTip = false

Vue.component('v-text-field', VTextField)
Vue.use(VCurrencyField, { 
	locale: 'pt-BR',
	decimalLength: 2,
	autoDecimalMode: true,
	min: null,
	max: null,
	defaultValue: 0,
    valueAsInteger: false,
    allowNegative: true
})

new Vue({
  created() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit('SET_AUTHENTICATION_DATA', userData);
    }
  },
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
