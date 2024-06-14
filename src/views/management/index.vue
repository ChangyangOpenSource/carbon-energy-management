<template>
  <div class="bg tables">
    <div class="left">
      <div class="title">生产能耗</div>
      <tree
        :treeList="treeList"
        v-if="treeList.length > 0"
        @onClick="onClick"
      />
    </div>
    <div class="right">
      <div class="right-top">
        <eacharts
          :type="1"
          @onTime="onTime"
          @onIndexOfes="onIndexOfes"
          :topList="topList"
        />
      </div>
      <div class="right-bottom">
        <a-table
          :pagination="false"
          :columns="columns"
          :data-source="topList.tableRes"
          :scroll="{ y: 280 }"
          @change="handleTableChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import { productCostControllerlist, getByType } from "@/api/tanpai.js";
export default {
  components: { tree, eacharts },
  data() {
    return {
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      columns: [
        {
          title: "碳排范围",
          dataIndex: "mapName",
          align: "center",
        },
        {
          title: "电能（KWh）",
          dataIndex: "ele",
          align: "center",
        },
        {
          title: "电（t折标煤）",
          dataIndex: "eleConvert",
          align: "center",
        },
        {
          title: "天然气（M^3）",
          dataIndex: "gas",
          align: "center",
        },
        {
          title: "天然气（t折标煤）",
          dataIndex: "gasConvert",
          align: "center",
        },
      ],
      data: [],
      treeList: [],
      from: {
        beginTime: "", //开始日期
        dateType: 3, //日期类型
        endTime: "", //	结束日期
        mapId: "", //车间id
        type: "", //计量类型
      },
      topList: {},
    };
  },
  mounted() {
    this.getByType();
  },
  methods: {
    onClick(value) {
      this.from.mapId = value;
      this.productCostControllerlist();
    },
    onIndexOfes(value) {
      console.log(value, "切換");
      this.from.type = value;
      if (value == "") {
        this.columns = [
          {
            title: "排碳范围",
            dataIndex: "mapName",
            align: "center",
          },
          {
            title: "电能（KWh）",
            dataIndex: "ele",
            align: "center",
          },
          {
            title: "电（t折标煤）",
            dataIndex: "eleConvert",
            align: "center",
          },
          {
            title: "天然气（M^3）",
            dataIndex: "gas",
            align: "center",
          },
          {
            title: "天然气（t折标煤）",
            dataIndex: "gasConvert",
            align: "center",
          },
        ];
      } else if (value == 1) {
        this.columns = [
          {
            title: "排碳范围",
            dataIndex: "mapName",
            align: "center",
          },
          {
            title: "电能（KWh）",
            dataIndex: "ele",
            align: "center",
          },
          {
            title: "折标煤（t）",
            dataIndex: "eleConvert",
            align: "center",
          },
        ];
      } else if (value == 2) {
        this.columns = [
          {
            title: "排碳范围",
            dataIndex: "mapName",
            align: "center",
          },
          {
            title: "用水（t）",
            dataIndex: "waterCost",
            align: "center",
          },
        ];
      } else if (value == 3) {
        this.columns = [
          {
            title: "排碳范围",
            dataIndex: "mapName",
            align: "center",
          },
          {
            title: "天然气（M^3）",
            dataIndex: "gas",
            align: "center",
          },
          {
            title: "折标煤（t）",
            dataIndex: "gasConvert",
            align: "center",
          },
        ];
      }
      this.productCostControllerlist();
    },
    onTime(value) {
      this.from.beginTime = value[0];
      this.from.endTime = value[1];
      this.productCostControllerlist();
    },
    getByType() {
      getByType({ type: 1 }).then((res) => {
        console.log(res, "124578");
        if (res.code == 200) {
          this.treeList = res.result;
          this.from.mapId = res.result[0].id;
          this.productCostControllerlist();
        }
      });
    },
    productCostControllerlist() {
      productCostControllerlist(this.from).then((res) => {
        if (res.code == 200) {
          if (res.result != null) {
            this.topList = res.result;
          } else {
            this.topList = {
              tableRes: [],
            };
          }
          this.$forceUpdate();
        }
      });
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination);
      if (Object.keys(sorter).length > 0) {
        this.sortedInfo = this.sortedInfo = sorter;
      } else {
        this.sortedInfo = {};
      }
      this.ipagination = pagination;
      //   this.loadData();
    },
  },
};
</script>
<style lang="less">
</style>
<style scoped lang="less">
.bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.right-top {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
}
.right-bottom {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
}
.left {
  min-width: 331px;
  height: 100%;
  background: #053c43;
  border-radius: 0px 0px 0px 0px;
  padding: 24px;
  margin-right: 24px;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
}
</style>
  

