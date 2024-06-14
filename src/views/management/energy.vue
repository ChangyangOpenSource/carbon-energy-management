<template>
  <div class="bg tables">
    <div class="left">
      <div class="title">能耗历史曲线</div>
      <tree
        :treeList="treeList"
        v-if="treeList.length > 0"
        @onClick="onClick"
      />
    </div>
    <div class="right">
      <div class="right-top">
        <eacharts
          :type="3"
          :lisws="1"
          @onTime="onTime"
          @onIndexOfes="onIndexOfes"
          :topList="topList"
        />
      </div>
      <div class="right-bottom">
        <a-table
          :pagination="false"
          :columns="columns"
          :data-source="topList"
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
import { getByType, historyCostlist } from "@/api/tanpai.js";

export default {
  components: { tree, eacharts },
  data() {
    return {

      columns: [
        {
          title: "时间",
          dataIndex: "time",
          align: "center",
        },
        {
          title: "用电量（KWh）",
          dataIndex: "cost",
          align: "center",
        },
        {
          title: "折标煤（t）",
          dataIndex: "convert",
          align: "center",
        },
        {
          title: "碳排放（tCO2）",
          dataIndex: "co2",
          align: "center",
        },
      ],
      treeList: [],
      from: {
        beginTime: "",
        dateType: 3, //日期类型
        endTime: "",
        mapId: "",
        type: 1,
      },
      topList: [],
    };
  },
  created() {
    this.getByType();
    this.historyCostlist();
  },
  methods: {
    onClick(value) {
      this.from.mapId = value;
      this.historyCostlist();
    },
    onIndexOfes(value) {
      this.from.type = value;
      if (value == 1) {
        this.columns = [
          {
            title: "时间",
            dataIndex: "time",
            align: "center",
          },
          {
            title: "用电量（KWh）",
            dataIndex: "cost",
            align: "center",
          },
          {
            title: "折标煤（t）",
            dataIndex: "convert",
            align: "center",
          },
          {
          title: "碳排放（tCO2）",
          dataIndex: "co2",
          align: "center",
        },
        ];
      } else if (value == 2) {
        this.columns = [
          {
            title: "时间",
            dataIndex: "time",
            align: "center",
          },
          {
            title: "用水量（t）",
            dataIndex: "cost",
            align: "center",
          },
        ];
      } else if (value == 3) {
        this.columns = [
          {
            title: "时间",
            dataIndex: "time",
            align: "center",
          },
          {
            title: "用气量（M^3）",
            dataIndex: "cost",
            align: "center",
          },
          {
            title: "折标煤（t）",
            dataIndex: "convert",
            align: "center",
          },
          {
            title: "碳排放（tCO2）",
            dataIndex: "co2",
            align: "center",
          },
        ];
      }
      this.historyCostlist();
    },
    onTime(value) {
      this.from.beginTime = value[0];
      this.from.endTime = value[1];
      this.historyCostlist();
    },
    getByType() {
      getByType({ type: 1 }).then((res) => {
        console.log(res, "124578");
        if (res.code == 200) {
          this.from.mapId = res.result[0].id;
          this.treeList = res.result;
        }
      });
    },
    historyCostlist() {
      historyCostlist(this.from).then((res) => {
        if (res.code == 200) {
          if (res.result!=null) {
            this.topList = res.result;
          }else{
            this.topList=[]
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