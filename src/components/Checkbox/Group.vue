<template>
  <div class="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "checkbox-group",
  components: {},
  props: {
    value: Array,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    childRegister(child) {
      child.$on("change", (v) => {
        if (child.checked) {
          this.$emit(
            "input",
            this.value.filter((it) => it !== v)
          );
        } else {
          this.$emit("input", [...this.value, v]);
        }
      });
    },

    isCheck(value) {
      return this.value.includes(value);
    },
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.checkbox-group {
}
</style>
