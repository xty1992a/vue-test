import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Popper from "vue-popperjs";
import "./styles/index.less";
import "vue-popperjs/dist/vue-popper.css";
import "@/icons";

Vue.component("Popper", Popper);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
