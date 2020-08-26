import Vue from "vue";

export default {
  data() {
    return {
      // 勾选的子节点(不包括有子节点的节点)
      // pickedLeafKeys: [],
    };
  },

  computed: {
    tree() {
      if (this.isRoot) return this.store;
      return this.root.tree;
    },
  },

  methods: {
    onCheck(item, checked) {
      if (item.isLeaf) {
        if (item.checked) {
          this.tree.pickedLeafKeys = this.tree.pickedLeafKeys.filter(
            (k) => k !== item.value
          );
        } else {
          this.tree.pickedLeafKeys.push(item.value);
        }
      }

      console.log(item, checked);
    },

    isCheck(item) {
      if (item.isLeaf) {
        return this.isSelfCheck(item);
      }
      return this.isLeafCheck(item);
    },

    // item的子节点均勾选了
    isLeafCheck(item) {
      return false;
    },

    isSelfCheck(item) {
      return this.tree.pickedLeafKeys.includes(item[this.alias.value]);
    },

    checkboxSetup() {
      if (!this.isRoot) return;
      this.store = Vue.observable({
        pickedLeafKeys: [],
      });
    },
  },

  created() {},
};
