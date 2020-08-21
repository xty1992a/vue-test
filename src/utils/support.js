const el = document.createElement("div");

export const supportCssVar = (() => {
  try {
    el.style.setProperty("--var-test", "14px");
    return el.style.getPropertyValue("--var-test") === "14px";
  } catch (e) {
    return false;
  }
})();
