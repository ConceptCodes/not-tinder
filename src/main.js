import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
/* Import the firebase SDK and extend with firestore */
import firebase from 'firebase';
require('firebase/firestore');

Vue.config.productionTip = false
const config = {
  apiKey: "AIzaSyAdBUWBWab68z8Eo0ldaaFzfD9LEvGtkcQ",
  authDomain: "insider-stall.firebaseapp.com",
  projectId: "insider-stall",
  storageBucket: "insider-stall.appspot.com",
  messagingSenderId: "426981076390",
  appId: "1:426981076390:web:90f6b290ff6d571e917367"
};
firebase.initializeApp(config);
Vue.prototype.$firebase = firebase;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
