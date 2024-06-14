<template>
  <div class="bg">
    <div class="left">
      <div class="title">光伏</div>
      <tree
        :treeList="treeList"
        v-if="treeList.length > 0"
        @onClick="onClick"
      />
    </div>
    <div class="right">
      <statistics :water="columns"  @onTime="onTime" :topList='topList' />
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import statistics from "@/components/statistics/statistics.vue";
import { getByType, statisticsDataphotoList } from "@/api/tanpai.js";
export default {
  components: { tree, statistics },
  data() {
    return {
      selectDischargeSatage: undefined, //选中阶段
      selectWorkshopRange: undefined, //选中范围
      columns: [
        {
          title: "电站",
          dataIndex: "name",
          key: "name",
          align: "center",
        },
        {
          title: "电站位置",
          dataIndex: "location",
          key: "location",
          align: "center",
        },
        {
          title: "产电量 (KWh)",
          dataIndex: "cost",
          key: "cost",
          ellipsis: true,
          align: "center",
        },
        {
          title: "折标煤 (t)",
          dataIndex: "convert",
          key: "convert",
          ellipsis: true,
          align: "center",
        },
        {
          title: "节碳 (tCO2)",
          dataIndex: "co2",
          key: "co2",
          ellipsis: true,
          align: "center",
        },
      ],
      treeList: {},
      from: {
        mapId: "",
        beginTime: "",
        dateType: "",
        endTime: "",
      },
      topList:[]
    };
  },
  created() {
    this.getByType();
  },
  methods: {
    getByType() {
      getByType({ type: 2 }).then((res) => {
        console.log(res.result[0], "124578");
        if (res.code == 200) {
          this.from.mapId = res.result[0].id;
          this.treeList = res.result;
          this.statisticsDataphotoList()
        }
      });
    },
    statisticsDataphotoList() {
      statisticsDataphotoList(this.from).then((res) => {
        if (res.code == 200) {
          if(res.result!=null){
            this.topList = res.result;
          }else{
            this.topList=[]
          }
         
          this.$forceUpdate();
        }
      });
    },
    onClick(value) {
      this.from.mapId = value;
      this.statisticsDataphotoList();
    },

    onTime(value, indextag) {
      this.from.beginTime = value[0];
      this.from.endTime = value[1];
      this.from.dateType = indextag;
      this.statisticsDataphotoList();
    },
  },
};
</script>

<style scoped lang="less">
.bg {
  display: flex;
  width: 100%;
  height: 100%;
}
.left {
  flex: 1;
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
.right {
  width: 1300px;
  background: #013038;
  height: 500px;
}
</style>
