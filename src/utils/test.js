import { rdm } from "./index";

export const makeTree = (deep = 3, count = 10) => {
  return Array(count)
    .fill(0)
    .map((n, i) => {
      const name = rdm();
      return {
        name,
        value: name,
        children: deep <= 0 ? undefined : makeTree(deep - 1, count),
      };
    });
};
