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
  components: {},
  props: {
    duration: {
      type: [Number, String],
      default: 300,
      validator: (v) => !isNaN(+v),
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    onEnter(el, done) {
      const cacheHeight = el.clientHeight;
      el.style.cssText = `
        overflow: hidden;
        height: 0;
      `;
      console.log("enter", cacheHeight, el.style.cssText);
      setTimeout(() => {
        el.style.cssText = `
        overflow: hidden;
        height: ${cacheHeight}px;
        transition: ${this.duration}ms;
      `;
        console.log("enter", cacheHeight, el.style.cssText);
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
      console.log("before leave", el.clientHeight, el.style.cssText);
    },
    onLeave(el, done) {
      this.$nextTick(() => {
        console.log("set height zero", this.duration);
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
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
