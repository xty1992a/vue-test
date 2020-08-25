<template>
  <div class="sub-list">
    <h3 class="sub-list__title sub-list__panel" v-if="isRoot">
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
    </h3>
    <ul class="sub-list__list">
      <li
        class="sub-list__item"
        :class="{ 'sub-list__item__leaf': it.isLeaf }"
        v-for="(it, index) in list"
        :key="it.value"
      >
        <div
          class="sub-list__panel sub-item"
          :class="{
            'sub-item__normal': !it.expand && index !== data.length - 1,
            'sub-item__up': it.expand || index === data.length - 1,
          }"
          :style="{
            paddingLeft: expandIconAppend ? '2em' : '2.5em',
          }"
        >
          <NodeContent :node="{ ...it, children: undefined }" />
          <div
            v-if="!it.isLeaf"
            class="nest-icon"
            :class="{
              'nest-icon__expand': it.expand,
              'nest-icon__prepend': !expandIconAppend,
              'nest-icon__append': expandIconAppend,
            }"
            @click="toggleNest(it)"
          >
            <Icon name="arrow_down" />
          </div>
        </div>

        <Collapse duration="150">
          <sub-list
            v-if="it.expand"
            v-bind="{
              expandIconAppend,
              alias,
              accordion,
              data: it.children,
            }"
          />
        </Collapse>
      </li>
    </ul>
  </div>
</template>

<script>
const findParent = (vm, name) => {
  while ((vm = vm.$parent)) {
    if (vm.$options.name === name) return vm;
  }
  return null;
};

import Collapse from "@/components/Collapse";
export default {
  name: "sub-list",
  components: {
    Collapse,
    NodeContent: {
      props: {
        node: Object,
      },
      render(h) {
        const parent = this.$parent;
        const root = parent.root;
        return root.renderNode ? (
          root.renderNode.call(root._renderProxy, h, {
            _self: root.$vnode.context,
            node: this.node,
          })
        ) : root.$scopedSlots.node ? (
          root.$scopedSlots.node(this.node)
        ) : (
          <span>{this.node.name}</span>
        );
      },
    },
  },
  props: {
    data: Array,
    // 属性别名
    alias: {
      type: Object,
      default: () => ({
        name: "name",
        value: "value",
        children: "children",
      }),
    },
    title: String,
    // 通过props的方式定义节点展示形式
    renderNode: Function,
    expandIconAppend: Boolean, // 展开按钮位置改为右侧
    accordion: Boolean, // 最多只能展开一个节点
  },
  data() {
    return {
      // 子节点需要被展开的节点key值
      expandItemKeys: [],
    };
  },
  computed: {
    // 检查自己是否是根节点
    isRoot() {
      const self = findParent(this, this.$options.name);
      return self === null;
    },

    // 用于展示的数据,非展开时减少children(以避免不必要的reactive)
    list() {
      return this.data.map((it) => {
        const { name, value, children } = this.alias;
        const isLeaf = this.isLeaf(it);
        const expand = !isLeaf && this.expandItemKeys.includes(it[value]);

        return {
          name: it[name],
          value: it[value],
          expand,
          isLeaf,
          children: expand
            ? it[children].map((it) => ({
                ...it,
                [children]: Object.freeze(it.children),
              }))
            : undefined,
        };
      });
    },
  },
  methods: {
    // 检查item是否是叶子节点(声明是叶子或没有children)
    isLeaf(item) {
      return (
        item?.isLeaf ??
        (item[this.alias.children] === undefined ||
          item[this.alias.children].length === 0)
      );
    },

    // 将item[key]加入展开组
    toggleNest(item) {
      const key = this.alias.value;
      const accordion = this.accordion;
      const expand = this.expandItemKeys.includes(item[key]);
      if (expand) {
        this.expandItemKeys = this.expandItemKeys.filter(
          (it) => it !== item[key]
        );
        if (accordion) {
          this.expandItemKeys = [];
        }
      } else {
        this.expandItemKeys.push(item[key]);
        if (accordion) {
          this.expandItemKeys = [item[key]];
        }
      }
    },

    // 自动展开指定的展开项目
    autoExpand() {
      // 考虑到性能问题,没有递归检查是否包含展开的后代节点(好吧,懒得写了)
      this.data.forEach((it) => {
        !this.isLeaf(it) &&
          it.expand &&
          this.expandItemKeys.push(it[this.alias.value]);
      });
      this.expandItemKeys = [...new Set(this.expandItemKeys)];
      if (this.accordion) {
        this.expandItemKeys = this.expandItemKeys.slice(0, 1);
      }
    },
  },
  watch: {
    data: {
      handler() {
        this.autoExpand();
      },
      immediate: true,
    },
  },
  created() {
    // 为递归组件提供一个根节点
    if (this.isRoot) {
      this.root = this;
    } else {
      const root = findParent(this, this.$options.name);
      this.root = root.root;
    }
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.sub-list {
  background-color: #fff;

  &__title {
    padding: 0 1em;
    font-weight: 500;
  }

  &__list {
    padding: 0;
    margin: 0 0 0 3em;
    list-style: none;
    &__item {
    }
  }

  &__panel {
    position: relative;
    line-height: 1.4em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;

    &:hover {
      background-color: rgba(217, 232, 252, 0.6);
      .popper-reference {
        opacity: 1;
      }
    }

    .nest-icon {
      width: 2em;
      position: absolute;
      bottom: 0;
      top: 0;
      cursor: pointer;

      display: flex;
      align-items: center;
      justify-content: center;

      &__append {
        right: 0;
        svg {
          transform: rotate(90deg);
        }
      }
      &__prepend {
        left: 0.5em;
        svg {
          transform: rotate(-90deg);
        }
      }

      .icon-arrow_down {
        font-size: 10px;
        color: #333;
      }
      svg {
        transition: 0.2s;
      }
      &__expand {
        svg {
          transform: rotate(0deg) !important;
        }
      }
    }
  }

  .sub-item {
    padding-left: 2em;
    padding-right: 2em;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-left: 1px solid;
      transform-origin: 0 50%;
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 1em;
      border-bottom: 1px solid;
      transform: scaleY(0.5);
    }

    &__normal {
      &:before {
        transform: scale(0.5, 1);
      }
    }

    &__down {
    }

    &__up {
      &:before {
        transform: scale(0.5) translateY(-50%);
      }
    }
  }
}
</style>
