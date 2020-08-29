<template>
  <div class="color-picker">
    <Movable class="s-v-wrap" v-model="svPosition">
      <!--   <div
        class="sv-map"
        :style="{ backgroundImage: `url(${svMapImage})` }"
      ></div>-->
      <canvas ref="sv-map" class="sv-map" />
      <div class="point" slot="handler"></div>
    </Movable>

    <Movable
      class="hue-side-bar"
      direction="y"
      v-model="hueRingPosition"
      @move="throttleHueCb"
    >
      <canvas ref="hue" class="hue-ring" />
      <!--      <div-->
      <!--        class="hue-ring"-->
      <!--        :style="{ backgroundImage: `url(${hueRingImage})` }"-->
      <!--      ></div>-->
      <div class="slide" slot="handler"></div>
    </Movable>
  </div>
</template>

<script>
import Movable from "@/components/Movable";
import * as helper from "./helper";
const { Color } = helper;
import * as utils from "@/utils/index";
import { HueCanvas, SVMapCanvas } from "./bg-canvas";

export default {
  name: "color-picker",
  components: { Movable },
  props: {
    value: {
      type: String,
      validator: (v) => v === "" || helper.checkColor(v),
    },
    defaultColor: {
      type: String,
      validator: (v) => helper.checkColor(v),
      default: "#ffffff",
    },
  },
  data() {
    return {
      hueRingImage: helper.createHueRing(),
      svMapImage: "",
    };
  },
  computed: {
    colorType() {
      if (/#/.test(this.value)) return "hex";
      if (/rgb/.test(this.value)) return "rgb";
    },
    hueRingPosition: {
      get() {
        const [hue] = this.hsvColor;

        return {
          x: 0,
          y: hue / 360,
        };
      },
      set({ x, y }) {
        const hue = Math.min(Math.max(+(y * 360).toFixed(2), 0), 359);
        const [, s, v] = this.hsvColor;
        this.emitValue(hue, s, v);
      },
    },

    svPosition: {
      // 此处的坐标是标准坐标,原点在左下角,非左上角
      get() {
        let [, x, y] = this.hsvColor;
        x /= 100;
        y /= 100;
        return {
          x,
          y: 1 - y,
        };
      },
      set({ x, y }) {
        const [h] = this.hsvColor;
        console.log("sv change", h, x, y);
        this.throttleEmit(h, x * 100, (1 - y) * 100);
      },
    },

    rgbColor() {
      let color = this.value || this.defaultColor;
      if (/#/.test(color)) color = Color.hex2rgb(this.value);
      return Color.splitColor(color);
    },

    hsvColor() {
      const [r, g, b] = this.rgbColor;
      return Color.rgb2Hsv(r, g, b);
    },
  },
  methods: {
    // 将新的颜色向上派发
    emitValue(h, s, v) {
      let color = Color.hsv2Rgb(h, s, v, true);
      if (this.colorType === "hex") {
        color = Color.rgb2hex(color);
      }
      this.$emit("input", color);
    },

    onHueChange() {
      const hue = this.hsvColor[0] || 0;
      // this.svMapImage = helper.createSVMap(this.hsvColor[0] || 0);
      this.svMap.draw(hue);
    },

    setup() {
      // 创建色相表
      new HueCanvas(this.$refs["hue"], {
        width: 20,
        height: 360,
      });
      // 创建饱和度/明度表
      this.svMap = new SVMapCanvas(this.$refs["sv-map"], {
        width: 100,
        height: 100,
      });
    },
  },
  watch: {},
  created() {
    // 节流高频事件
    this.throttleEmit = utils.throttle(this.emitValue, 16);
    this.throttleHueCb = utils.throttle(this.onHueChange, 16);
  },
  mounted() {
    this.setup();
    this.onHueChange();
  },
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.color-picker {
  display: inline-flex;
  height: 300px;

  .s-v-wrap {
    margin-right: 10px;
    .sv-map {
      width: 300px;
      height: 300px;
      box-shadow: 0 0 1px #333;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .point {
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid #fff;
    }
  }
  .hue-side-bar {
    .hue-ring {
      height: 100%;
      width: 20px;
      background-repeat: repeat-x;
      background-size: 1px 100%;
      position: relative;
    }
    .slide {
      width: 20px;
      height: 5px;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      transform: translateY(-50%);
    }
  }
}
</style>
