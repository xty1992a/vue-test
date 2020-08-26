<template>
  <div class="test">
    <section class="aside">
      <SubList accordion :data="subList" pickable>
        <template #title>
          <div class="title">
            <span>全部客服</span>
            <popper
              class="popper-container"
              style="margin-right: -1em;"
              trigger="clickToOpen"
              :options="{
                placement: 'right',
                modifiers: {
                  offset: {
                    offset: '0,5',
                  },
                },
              }"
            >
              <div class="popper">
                <p>编辑</p>
              </div>
              <Icon name="operation" slot="reference" />
            </popper>
          </div>
        </template>

        <template #node="item">
          <div class="sub-node">
            <span>{{ item.name }}</span>
            <popper
              v-if="item.isLeaf"
              trigger="clickToOpen"
              class="popper-container"
              :options="{
                placement: 'right',
                modifiers: {
                  offset: {
                    offset: '0,5',
                  },
                },
              }"
            >
              <div class="popper">
                <p>编辑</p>
                <p>修改</p>
              </div>
              <Icon name="operation" slot="reference" />
            </popper>
          </div>
        </template>
      </SubList>
      <cell
        border
        title="标题"
        :clickable="openBox"
        :value="openBox ? '关闭' : '打开'"
        @click="openBox = !openBox"
      />

      <collapse>
        <div v-if="openBox">
          <div class="box"></div>
        </div>
      </collapse>
      <cell title="标题" :bubble="{ color: 'red', opacity: 0.6 }" clickable>
        <popper
          trigger="clickToOpen"
          :options="{
            placement: 'right',
            modifiers: { offset: { offset: '0,10' } },
          }"
        >
          <div class="popper">
            <p>增加分组</p>
          </div>
          <Icon name="operation" slot="reference" />
        </popper>
      </cell>

      <SubList :data="tree" :render-node="renderNode" />
    </section>
    <section>
      <!--      <checkbox-->
      <!--        :value="isCheckAll"-->
      <!--        :indeterminate="indeterminate"-->
      <!--        @change="checkAll"-->
      <!--        >全选</checkbox-->
      <!--      >-->
      <!--      <checkbox-group v-model="checkedKeys">-->
      <!--        <checkbox-->
      <!--          v-for="it in checkboxList"-->
      <!--          :key="it.value"-->
      <!--          :label="it.label"-->
      <!--          :value="it.value"-->
      <!--        />-->
      <!--      </checkbox-group>-->
    </section>
  </div>
</template>

<script>
import SubList from "@/components/SubList";
import Collapse from "@/components/Collapse";
import { makeTree } from "@/utils/test";

export default {
  name: "test",
  components: { SubList, Collapse },
  props: {},
  data() {
    return {
      subList: [
        {
          name: "李四",
          value: "2",
          expand: true,
          children: [
            { name: "李四-早班", value: "2-1" },
            { name: "李四-中班", value: "2-2" },
            { name: "李四-晚班", value: "2-3" },
          ],
        },
        { name: "王五", value: "3", expand: true },
        { name: "周六", value: "4" },
        {
          name: "刘七",
          value: "5",
          expand: true,
          children: [
            { name: "刘七-早班", value: "5-1" },
            { name: "刘七-中班", value: "5-2" },
            { name: "刘七-晚班", value: "5-3" },
          ],
        },
        {
          name: "张三",
          value: "1",
          children: [
            { name: "张三-早班", value: "1-1" },
            { name: "张三-中班", value: "1-2" },
            { name: "张三-晚班", value: "1-3" },
            {
              name: "张三-夜班",
              value: "1-4",
              expand: true,
              children: [
                { name: "张三-夜班-前", value: "1-4-1" },
                { name: "张三-夜班-中", value: "1-4-2" },
                { name: "张三-夜班-后", value: "1-4-3" },
              ],
            },
          ],
        },
      ],

      tree: Object.freeze(makeTree(3, 10)),

      openBox: true,
      testValue: false,

      checkedKeys: ["sing"],
      checkboxList: [
        { label: "唱", value: "sing" },
        { label: "跳", value: "jump" },
        { label: "rap", value: "rap" },
        { label: "打篮球", value: "ball" },
      ],
    };
  },
  computed: {
    indeterminate() {
      return [this.checkboxList.length, 0].every(
        (v) => v !== this.checkedKeys.length
      );
    },
    isCheckAll() {
      return this.checkedKeys.length === this.checkboxList.length;
    },
  },
  methods: {
    renderNode(h, { node }) {
      return <div>{node.name}__render</div>;
    },

    checkAll() {
      if (this.isCheckAll) {
        this.checkedKeys = [];
        return;
      }
      this.checkedKeys = this.checkboxList.map((it) => it.value);
    },
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="less" rel="stylesheet/less">
.test {
  min-height: 100vh;
  padding: 10px;

  display: flex;

  .aside {
    width: 500px;
    /*width: 250px;*/
    /*height: ~"calc(100vh - 20px)";*/
    /*overflow: auto;*/
    border: 1px solid #e5e5e5;

    .title {
      display: flex;
      justify-content: space-between;
    }
    .sub-list {
      width: 500px;
    }
    .sub-node {
      display: flex;
      height: 100%;
      justify-content: space-between;
      svg {
        opacity: 0;
      }
      &:hover,
      &:active {
        svg {
          opacity: 1;
        }
      }
    }
    .popper-container {
      margin-right: -2em;
      width: 2em;
      text-align: center;
    }
    .popper-container {
      .popper {
        padding: 5px 0;
        p {
          line-height: 30px;
          width: 90px;
          text-align: center;
          cursor: pointer;
          &:hover {
            background-color: #d9e8fc;
          }
        }
      }
    }
  }

  .box {
    height: 300px;
    background-color: #f7f7f7;
  }
}
</style>
