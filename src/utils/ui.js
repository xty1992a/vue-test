import Cell from "@/components/Cell";
import Collapse from "@/components/Collapse";
import SubList from "@/components/SubList";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";

const components = [Cell, SubList, Collapse, Checkbox, CheckboxGroup];

export default {
  install(Vue) {
    Vue.component("Popper", Popper);
    components.forEach((com) => Vue.component(com.name, com));
  },
};
