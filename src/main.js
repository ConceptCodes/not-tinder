import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
/* Import the firebase SDK and extend with firestore */
import firebase from 'firebase';
require('firebase/firestore');

Vue.config.productionTip = false
firebase.initializeApp(config);
Vue.prototype.$firebase = firebase;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
