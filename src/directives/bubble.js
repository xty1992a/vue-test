import { rdm, supportCssVar } from "@/utils";
import "./bubble.less";

const dftBinding = {
  color: "orange",
  size: 100,
  duration: "500ms",
  disabled: false,
  directive: "bubble",
  opacity: 1,
};

class Bubble {
  constructor(el, options) {
    this.$el = el;
    this.setOptions(options);
    this.listen();
  }

  onClick = (e) => {
    const el = this.$el;
    const { duration, color, size, disabled, opacity } = this.$options;
    if (disabled) return;

    const rect = el.getBoundingClientRect();
    const { clientX, clientY } = e;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    el.classList.add("v-bubble");

    el.style.cssText = `
      	--wave-duration: ${duration};
		--bubble-color: ${color};
		--wave-size: ${size}px;
      	--offset-y: ${y}px;
      	--offset-x: ${x}px;
      	--wave-opacity: ${opacity};
      `;
  };

  onAnimateEnd = () => {
    const el = this.$el;
    el.style.cssText = "";
    el.classList.remove("v-bubble");
  };

  listen() {
    this.$el.addEventListener("click", this.onClick);
    this.$el.addEventListener("animationend", this.onAnimateEnd);
  }

  unListen() {
    this.$el.removeEventListener("click", this.onClick);
    this.$el.removeEventListener("animationend", this.onAnimateEnd);
  }

  setOptions(options = {}) {
    this.$options = {
      ...dftBinding,
      ...options,
    };
    console.log("set option", this.$options);
  }

  static BubbleMap = {};

  static getInstance(el) {
    const key = el.dataset.bubble;
    return Bubble.BubbleMap[key];
  }

  static setInstance(instance) {
    const el = instance.$el;
    const key = rdm();
    el.dataset.bubble = key;
    Bubble.BubbleMap[key] = instance;
    return key;
  }

  static delInstance(el) {
    const instance = Bubble.getInstance(el);
    if (!instance) return;
    instance.unListen();
    const key = instance.$el.dataset.bubble;
    Bubble.BubbleMap[key] = null;
  }
}

const directive = {
  bind(el, binding) {
    if (!supportCssVar) {
      return console.error("It`s 2020 you still use this suck browser??");
    }
    const bubble = new Bubble(el, binding.value);
    Bubble.setInstance(bubble);
  },

  update(el, binding) {
    const bubble = Bubble.getInstance(el);
    if (!bubble) return;
    bubble.setOptions(binding.value);
  },

  unbind(el) {
    Bubble.delInstance(el);
  },
};

export default {
  install(Vue, options = {}) {
    // set initial binding
    Object.keys(options).forEach((k) => (dftBinding[k] = options[k]));
    Vue.directive(dftBinding.directive, directive);
  },

  ...directive,

  name: dftBinding.directive,
};
