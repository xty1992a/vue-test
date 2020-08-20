import Cell from "@/components/Cell";
import Collapse from "@/components/Collapse";
import SubList from "@/components/SubList";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

const components = [Cell, SubList, Collapse];

export default {
  install(Vue) {
    Vue.component("Popper", Popper);
    components.forEach((com) => Vue.component(com.name, com));
  },
};
