import bubble from "./bubble";

const directives = {
  [bubble.name]: bubble,
};

export default {
  install: function (Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};
