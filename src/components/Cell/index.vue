<template>
  <div
    class="cell"
    :class="{ 'hair-line__bottom': border }"
    v-on="$listeners"
    v-bubble="localBubble"
  >
    <div class="cell__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="cell__value">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "cell",
  components: {},
  props: {
    title: String,
    value: String,
    border: Boolean,
    bubble: {
      type: Object,
      default: () => null,
    },
    clickable: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    localBubble() {
      return {
        ...this.bubble,
        disabled: !this.clickable,
      };
    },
  },
  methods: {},
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.cell {
  position: relative;
  padding: 10px 15px;
  display: flex;
  line-height: 24px;
  &__title {
    flex: 1;
  }
  &__value {
    flex: 1;
    text-align: right;
  }
}
</style>
