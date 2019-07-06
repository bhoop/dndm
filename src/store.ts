import Vue from "vue";
import Vuex from "vuex";
import { db } from "./services/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    assets: []
  },
  mutations: {
    assets(state, newstuff) {
      state.assets = newstuff;
    }
  },
  actions: {}
});
