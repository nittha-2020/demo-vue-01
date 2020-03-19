import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import msal from 'vue-msal' // MS Authentication 


Vue.config.productionTip = false

// MS Authentication 
Vue.use(msal, {
  auth: {
    clientId: process.env.VUE_APP_CLIENT_ID,
    redirectUri: process.env.VUE_APP_REDIRECT,
    scopes: process.env.VUE_APP_XSCOPE
  }
});


new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
