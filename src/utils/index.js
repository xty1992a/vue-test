export const rdm = () => Math.random().toString(36).substr(2, 15);

export * from "./support";

export const findParent = (vm, name) => {
  if (vm.$options.name === name) return vm;
  while ((vm = vm.$parent)) {
    if (vm.$options.name === name) return vm;
  }
  return null;
};

export function getParentByClassName(
  el,
  className,
  stop = document.documentElement
) {
  if (el.classList.contains(className)) return el;
  let parent = el.parentNode;
  let target = null;
  while (parent) {
    if (parent === stop) {
      return null;
    }
    if (parent.classList.contains(className)) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return target;
}
export const limit = (min, max) => (value) =>
  Math.max(Math.min(max, value), min);

// 防抖,time时间内,只有最后一次有效
export const debounce = (fn, time = 100) => {
  let timer = 0;
  return function () {
    const context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn.apply(context, args);
    }, time);
  };
};

// 节流,降低事件频率
export function throttle(fn, gapTime = 500) {
  let _lastTime = null;
  return function () {
    const context = this;
    let args = arguments;
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(context, args);
      _lastTime = _nowTime;
    }
  };
}
