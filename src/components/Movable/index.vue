<template>
  <div class="movable" @mousedown="onDown">
    <slot></slot>
    <div class="handler" :style="handlerStyle" ref="handler">
      <slot name="handler"></slot>
    </div>
  </div>
</template>

<script>
import * as utils from "@/utils";
const point = (e) => {
  if (e.touches && e.touches.length) return e.touches[0];
  if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
  return e;
};

const limitFactor = (state) => ({ x, y }) => {
  let { wrapHeight, wrapWidth, slideHeight, slideWidth } = state;
  slideWidth /= 2;
  slideHeight /= 2;

  const limitX = utils.limit(0, wrapWidth);
  const limitY = utils.limit(0, wrapHeight);
  return {
    x: limitX(x),
    y: limitY(y),
  };
};

export default {
  name: "movable",
  components: {},
  props: {
    direction: {
      type: String,
      validator: (v) => ["x", "y", "all"].includes(v),
      default: "all",
    },
    value: {
      type: Object,
      validator: (v) => ["x", "y"].every((k) => k in v),
    },
  },
  data() {
    return {
      point: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        x: 0,
        y: 0,
        timestamp: Date.now(),
      },
      state: {
        hadStart: false,
      },
      domState: {
        wrapHeight: 0,
        wrapWidth: 0,
        slideHeight: 0,
        slideWidth: 0,
        left: 0,
        top: 0,
      },
    };
  },
  computed: {
    allowX() {
      return ["all", "x"].includes(this.direction);
    },
    allowY() {
      return ["all", "y"].includes(this.direction);
    },
    handlerStyle() {
      return {
        transform: `translate3d(${this.point.x}px,${this.point.y}px,0)`,
      };
    },
  },
  methods: {
    listen() {
      const onUp = this.onUp.bind(this);
      const onMove = this.onMove.bind(this);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("mousemove", onMove);
      this.$once("hooks:beforeDestroy", () => {
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("mousemove", onMove);
      });
    },

    onDown(e) {
      const target = utils.getParentByClassName(e.target, "handler");
      if (target !== this.$refs["handler"]) return;
      this.getDomState();
      const { clientX, clientY } = point(e);
      this.state.hadStart = true;
      this.point.startX = clientX;
      this.point.startY = clientY;
      this.point.timestamp = Date.now();
    },
    onMove(e) {
      if (!this.state.hadStart) return;
      const { clientX, clientY } = point(e);
      const deltaX = clientX - this.point.startX;
      const deltaY = clientY - this.point.startY;

      const { x, y } = this.limit({
        x: this.allowX ? this.point.endX + deltaX : 0,
        y: this.allowY ? this.point.endY + deltaY : 0,
      });

      if (x !== this.point.x || y !== this.point.y) {
        const position = {
          x: +(x / this.domState.wrapWidth).toFixed(2),
          y: +(y / this.domState.wrapHeight).toFixed(2),
        };
        this.$emit("move", position);
        this.$emit("input", position);
      }

      this.point.x = x;
      this.point.y = y;
    },
    onUp(e) {
      if (!this.state.hadStart) return;
      this.state.hadStart = false;
      this.point.endX = this.point.x;
      this.point.endY = this.point.y;
    },

    getDomState() {
      const rect = this.$el.getBoundingClientRect();
      const slide = this.$refs["handler"].getBoundingClientRect();
      this.domState = {
        ...this.domState,
        wrapHeight: rect.height,
        wrapWidth: rect.width,
        left: rect.left,
        top: rect.top,
        slideHeight: slide.height,
        slideWidth: slide.width,
      };

      this.limit = limitFactor(this.domState);
    },
    setup() {
      this.getDomState();
      const { x, y } = this.value;
      const { wrapHeight, wrapWidth } = this.domState;
      this.point.x = x * wrapWidth;
      this.point.y = y * wrapHeight;
      this.point.endX = this.point.x;
      this.point.endY = this.point.y;
    },
  },
  watch: {},
  created() {
    const handler = this.$slots["handler"];
    if (!handler || !handler.length) {
      console.error("请提供handler");
    }
    this.limit = (a) => a;
    this.listen();
  },
  mounted() {
    this.$nextTick(this.setup);
  },
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.movable {
  position: relative;
  .handler {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
}
</style>
