import bubble from "./bubble";

const directives = [bubble];

export default {
  install: function (Vue) {
    directives.forEach((obj) => {
      obj.install ? Vue.use(obj) : Vue.directive(obj.name, obj);
    });
  },
};
