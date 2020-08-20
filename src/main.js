import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/index.less";
import "@/icons";
import Directives from "@/directives";
import UI from "@/utils/ui";

Vue.use(Directives);
Vue.use(UI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
