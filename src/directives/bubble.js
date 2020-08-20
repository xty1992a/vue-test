import { rdm } from "@/utils";
import "./bubble.less";

const dftBinding = {
  color: "orange",
  size: 100,
  duration: "500ms",
};

const callbackMap = {};

function bindCallback(el, binding) {
  removeCallback(el);

  const clickKey = rdm();
  const animateKey = rdm();

  el.dataset.callback = [clickKey, animateKey].join(",");

  const { duration, color, size } = binding;

  const onClick = (e) => {
    const rect = el.getBoundingClientRect();
    const { clientX, clientY } = e;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    el.classList.add("v-bubble");

    el.style.cssText = `
      	--wave-duration: ${duration};
		--wave-size: ${size}px;
		--bubble-color: ${color};
      	--offset-y: ${y}px;
      	--offset-x: ${x}px;
      `;
  };

  const onAnimateEnd = (e) => {
    el.style.cssText = "";
    el.classList.remove("v-bubble");
  };

  callbackMap[clickKey] = onClick;
  callbackMap[animateKey] = onAnimateEnd;

  el.addEventListener("click", onClick);
  el.addEventListener("animationend", onAnimateEnd);
}

function removeCallback(el) {
  if (!el.dataset.callback) return;
  const [clickKey, animateKey] = el.dataset.callback.split(",");
  if (clickKey) {
    callbackMap[clickKey] = null;
    el.removeEventListener(clickKey, callbackMap[clickKey]);
  }
  if (animateKey) {
    callbackMap[animateKey] = null;
    el.removeEventListener(animateKey, callbackMap[animateKey]);
  }
}

export default {
  bind(el, binding) {
    bindCallback(el, {
      ...dftBinding,
      ...(binding.value || {}),
    });
  },

  update(el, binding) {
    console.log("update");
    bindCallback(el, {
      ...dftBinding,
      ...(binding.value || {}),
    });
  },

  name: "bubble",
};
