import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/host/:table",
      name: "host",
      component: () =>
        import(/* webpackChunkName: "host" */ "./views/HostMode.vue"),
      children: [
        {
          path: "asset/:asset",
          component: () =>
            import(/* webpackChunkName: "host" */ "./views/HostModeDetail.vue")
        }
      ]
    },
    {
      path: "/view/:table",
      name: "view",
      component: () =>
        import(/* webpackChunkName: "view" */ "./views/ViewMode.vue")
    }
  ]
});
