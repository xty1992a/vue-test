export const rdm = () => Math.random().toString(36).substr(2, 15);

export * from "./support";

export const findParent = (vm, name) => {
  if (vm.$options.name === name) return vm;
  while ((vm = vm.$parent)) {
    if (vm.$options.name === name) return vm;
  }
  return null;
};
