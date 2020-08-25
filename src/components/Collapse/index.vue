<template>
  <transition
    @enter="onEnter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="onLeave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "collapse",
  props: {
    duration: {
      type: [Number, String],
      default: 300,
      validator: (v) => !isNaN(+v),
    },
  },
  methods: {
    onEnter(el, done) {
      const cacheHeight = el.clientHeight;
      el.style.cssText = `
        overflow: hidden;
        height: 0;
      `;
      setTimeout(() => {
        el.style.cssText = `
        overflow: hidden;
        height: ${cacheHeight}px;
        transition: ${this.duration}ms;
      `;
        setTimeout(done, this.duration);
      }, 20);
    },
    afterEnter(el) {
      el.style.cssText = "";
    },
    beforeLeave(el) {
      el.style.cssText = `
        height: ${el.clientHeight}px;
      `;
      // 读取属性,强迫重排
      el.clientHeight;
    },
    onLeave(el, done) {
      this.$nextTick(() => {
        el.style.cssText = `
          height: 0px;
          overflow: hidden;
          transition: ${this.duration}ms;
        `;
        setTimeout(done, this.duration);
      });
    },
    afterLeave(el) {
      el.style.cssText = "";
    },
  },
};
</script>
