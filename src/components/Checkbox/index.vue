<template>
  <label
    class="checkbox"
    @click="onClick"
    :class="{
      'checkbox__is-checked': !indeterminate && checked,
      checkbox__indeterminate: indeterminate,
    }"
  >
    <span class="checkbox__inner"></span>
    <span class="checkbox__label" v-if="$slots.default || label"
      ><slot>{{ label }}</slot></span
    >
  </label>
</template>

<script>
import { findParent } from "@/utils";
export default {
  name: "checkbox",
  components: {},
  props: {
    value: [Boolean, String, Number],
    indeterminate: Boolean,
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    label: String,
  },
  data() {
    return {};
  },
  computed: {
    checked() {
      return this.group
        ? this.group.isCheck(this.value)
        : this.value === this.activeValue;
    },
  },
  methods: {
    onClick() {
      if (this.group) {
        this.$emit("change", this.value);
        return;
      }

      if (this.checked) {
        this.$emit("input", this.inactiveValue);
        this.$emit("change", this.inactiveValue);
      } else {
        this.$emit("input", this.activeValue);
        this.$emit("change", this.activeValue);
      }
    },
  },
  watch: {},
  created() {
    const group = findParent(this, "checkbox-group");
    this.group = group;
    group && group.childRegister(this);
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.checkbox {
  margin-right: 30px;
  line-height: 1;
  cursor: pointer;

  &__inner {
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
  }
  &__is-checked {
    .checkbox__inner {
      background-color: @active-color;
      position: relative;
      &:before {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(0.3em, 0.1em) rotate(45deg);
        width: 0.2em;
        height: 0.45em;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
        content: "";
      }
    }
  }
  &__indeterminate {
    .checkbox__inner {
      background-color: @active-color;
      position: relative;
      &:before {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0.5em;
        border-bottom: 1px solid #fff;
        content: "";
        transform: translate(-50%, -50%);
      }
    }
  }
  &__label {
    display: inline-block;
    vertical-align: middle;
    padding-left: 5px;
  }

  &:last-of-type {
    margin-right: 0;
  }
}
</style>
