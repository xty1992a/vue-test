import { Color } from "components/ColorPicker/helper";

const dftOptions = {
  width: 100,
  height: 100,
  hue: 0,
};

export class ICanvas {
  constructor(el, options = {}) {
    this.$cvs = el;
    this.$options = options = { ...dftOptions, ...options };
    this.ctx = el.getContext("2d");
    el.width = options.width;
    el.height = options.height;
    this.draw();
  }
  draw() {}
}

export class HueCanvas extends ICanvas {
  draw() {
    const {
      ctx,
      $cvs: { width, height },
    } = this;
    let range = 0;
    while (range < height) {
      ctx.fillStyle = Color.hsv2Rgb(range, 100, 100, true);
      ctx.fillRect(0, range, width, 1);
      range++;
    }
  }
}

export class SVMapCanvas extends ICanvas {
  draw(hue) {
    if (typeof hue === "undefined") return;
    this.drawHsv(hue);
    // this.drawLinear(hue);
  }

  // 循环绘制,明度*饱和度
  drawHsv(hue) {
    const {
      ctx,
      $cvs: { width, height },
    } = this;
    console.time("draw");
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        ctx.fillStyle = Color.hsv2Rgb(hue, x, 100 - y, true);
        ctx.fillRect(x, y, 1, 1);
      }
    }
    console.timeEnd("draw");
  }

  // 绘制基础色,再叠加黑白蒙层
  drawLinear(hue) {
    const {
      ctx,
      $cvs: { width, height },
    } = this;

    // 基础色
    ctx.fillStyle = Color.hsv2Rgb(hue, 100, 100, true);
    ctx.fillRect(0, 0, width, height);

    // 横向
    const white = ctx.createLinearGradient(0, 0, width, 0);
    white.addColorStop(0, "#fff");
    white.addColorStop(1, "transparent");
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, width, height);

    // 纵向
    const black = ctx.createLinearGradient(0, 0, 0, height);
    black.addColorStop(0, "transparent");
    black.addColorStop(1, "#000");
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, width, height);
  }
}
