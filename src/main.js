import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import store from './store'
import VueRouter from 'vue-router'
import VueLuxon from "vue-luxon";

//import Home from './components/FloorCard'
import Reservations from '@/components/Reservations'
import Home from '@/components/FloorCardHome'
Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueLuxon);
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/reservations', component: Reservations}
]

const router = new VueRouter({
  mode: 'history',
  routes
})
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
