import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import VueUi from "@vue/ui";
import "@vue/ui/dist/vue-ui.css";
Vue.use(VueUi);

import "./services/firebase.ts";
import router from './router'

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
