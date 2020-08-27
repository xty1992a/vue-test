export function checkColor(color) {
  if (/^#/.test(color)) return checkHex(color);
  if (/^rgb/.test(color)) return checkRgb(color);
  return false;
}

function checkRgb(color) {
  if (!/^rgb\((\d{0,3},\d{0,3},\d{0,3})\)$/.test(color)) return false;
  const colors = RegExp.$1.split(",").map(Number);
  return colors.every((v) => 0 <= v && v <= 255);
}

function checkHex(color) {
  return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color);
}

class Num {
  static toHex(num) {
    return num.toString(16);
  }

  static toNormal(hex) {
    return parseInt("0x" + hex);
  }
}

// 颜色转换器
export class Color {
  // https://www.zhangxinxu.com/wordpress/2010/03/javascript-hex-rgb-hsl-color-convert/
  // http://en.wikipedia.org/wiki/HSL_color_space

  // 将rbg或hex拆分为r,r,b
  static splitColor(color) {
    if (checkHex(color)) {
      color = this.hex2rgb(color);
    }
    if (checkRgb(color)) {
      return RegExp.$1.split(",").map(Number);
    }
    return color;
  }

  static hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  // hsl转换
  static hsl2rgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = this.hue2rgb(p, q, h + 1 / 3);
      g = this.hue2rgb(p, q, h);
      b = this.hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  static rgb2Hsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  static hex2rgb(color) {
    if (!checkHex(color)) return color;
    color = color.substr(1);
    if (color.length === 3) {
      color = color
        .split("")
        .map((i) => i + i)
        .join("");
    }
    const [r, g, b] = Helper.chunkString(color, 2).map(Num.toNormal);
    return `rgb(${r},${g},${b})`;
  }

  static rgb2hex(color) {
    if (!checkRgb(color)) return color;
    const [r, g, b] = RegExp.$1.split(",").map((v) => {
      v = Num.toHex(+v);
      // 小于10的前面补0
      return v.length === 1 ? `0${v}` : v;
    });
    return `#${r}${g}${b}`;
  }

  // hsv/hsb转换
  static hsv2Rgb(h, s, v) {
    s = s / 100;
    v = v / 100;
    var r = 0,
      g = 0,
      b = 0;
    var i = parseInt((h / 60) % 6);
    var f = h / 60 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
      default:
        break;
    }
    r = parseInt(r * 255.0);
    g = parseInt(g * 255.0);
    b = parseInt(b * 255.0);
    return [r, g, b];
  }
  static rgb2Hsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var h, s, v;
    var min = Math.min(r, g, b);
    var max = (v = Math.max(r, g, b));
    var l = (min + max) / 2;
    var difference = max - min;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0);
          break;
        case g:
          h = 2.0 + (b - r) / difference;
          break;
        case b:
          h = 4.0 + (r - g) / difference;
          break;
      }
      h = Math.round(h * 60);
    }
    if (max === 0) {
      s = 0;
    } else {
      s = 1 - min / max;
    }
    s = Math.round(s * 100);
    v = Math.round(v * 100);
    return [h, s, v];
  }
}

class Helper {
  static chunk(list = [], length = 1) {
    const result = [];
    while (list.length) {
      result.push(list.splice(0, length));
    }
    return result;
  }

  static chunkString(string = "", length = 1) {
    return Helper.chunk([...string], length).map((i) => i.join(""));
  }
}

/*
  if (!/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) return false;
  console.log("ok");
  color = RegExp.$1;
  if (color.length === 3) {
    color = color
      .split("")
      .map((i) => i + i)
      .join("");
  }
  const colors = chunkString(color, 2);
  return colors.every((v) => Num.toNormal(v) <= 255 && Num.toNormal(v) >= 0);*/

// 生成色相环
export function createHueRing() {
  const cvs = document.createElement("canvas");
  cvs.id = "cvs";
  cvs.height = 360;
  cvs.width = 1;
  const ctx = cvs.getContext("2d");
  let range = 0;
  while (range <= 360) {
    const [r, g, b] = Color.hsv2Rgb(range, 100, 100);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, range, cvs.width, 1);
    range++;
  }
  return cvs.toDataURL("image/png");
}

// 生成饱和度与亮度二维图
export function createSVMap(hue) {
  const cvs = document.createElement("canvas");
  cvs.id = "cvs";
  cvs.height = 100;
  cvs.width = 100;
  const ctx = cvs.getContext("2d");
  const [r, g, b] = Color.hsv2Rgb(hue, 100, 100);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 100, 100);

  const white = ctx.createLinearGradient(0, 0, 100, 0);
  white.addColorStop(0, "#fff");
  white.addColorStop(1, "transparent");
  ctx.fillStyle = white;
  ctx.fillRect(0, 0, 100, 100);

  const black = ctx.createLinearGradient(0, 0, 0, 100);
  black.addColorStop(0, "transparent");
  black.addColorStop(1, "#000");
  ctx.fillStyle = black;
  ctx.fillRect(0, 0, 100, 100);

  return cvs.toDataURL("image/png");
}
