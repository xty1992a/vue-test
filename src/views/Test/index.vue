<template>
  <div class="test">
    <section class="body">
      <SubList :data="subList">
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
      <div class="cell" @click="openBox = !openBox">
        <div class="cell__title">标题</div>
        <div class="cell__value">打开</div>
      </div>
      <Collapse duration="10000">
        <div v-if="openBox">
          <div class="box"></div>
        </div>
      </Collapse>
      <div class="cell">
        <div class="cell__title">标题</div>
        <div class="cell__value">
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
        </div>
      </div>

      <SubList :data="subList" />
    </section>
  </div>
</template>

<script>
import SubList from "@/components/SubList";
import Collapse from "@/components/Collapse";
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

      openBox: true,
    };
  },
  computed: {},
  methods: {},
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
  .body {
    width: 250px;
    /*height: ~"calc(100vh - 20px)";*/
    /*overflow: auto;*/
    /*border: 1px solid #e5e5e5;*/

    .title {
      display: flex;
      justify-content: space-between;
    }
    .sub-list {
    }
    .sub-node {
      display: flex;
      height: 100%;
      justify-content: space-between;
    }
    .popper-container {
      margin-right: -2em;
      width: 2em;
      text-align: center;
    }
  }

  .cell {
    padding: 10px 15px;
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    &__title {
      flex: 1;
    }
    &__value {
      flex: 1;
      text-align: right;
    }
  }

  .box {
    height: 300px;
    background-color: #f7f7f7;
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
</style>
