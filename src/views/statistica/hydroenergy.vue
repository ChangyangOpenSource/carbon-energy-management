<template>
  <div class="bg">
    <div class="left">
      <div class="title">水能</div>
      <tree  :treeList="treeList"
        v-if="treeList.length > 0"
        @onClick="onClick"/>
    </div>
    <div class="right">
      <statistics :water="columns" @onTime="onTime" :topList='topList'/>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import statistics from "@/components/statistics/statistics.vue";
import { getByType,statisticsDatalist } from "@/api/tanpai.js";
export default {
  components: { tree, statistics },
  data() {
    return {
     
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name",
          align: "center",
        },
        {
          title: "初始时间",
          dataIndex: "begin",
      
          align: "center",
        },
        {
          title: "初始表底值",
          dataIndex: "beginValue",
         
          align: "center",
        },
        {
          title: "截止时间",
          dataIndex: "end",
         
          align: "center",
        },
        {
          title: "截止表底值",
          align: "center",
          dataIndex: "endValue",
         
          ellipsis: true,
        },
        {
          title: "用水量 (t)",
          dataIndex: "cost",
          align: "center",
         
        },
        {
          title: "折标煤 (t)",
          dataIndex: "convert",
      
          align: "center",
        },
        {
          title: "碳排放 (CO2)",
          dataIndex: "co2",
        
          align: "center",
        
        },
      ],
      treeList: {},
      from: {
        mapId: "",
        beginTime:"",
        dateType:'',
        endTime:'',
        type:2,
       
      },
      topList:[]

    };
  },
  created() {
    this.getByType() 
  },
  methods:{
   
    statisticsDatalist() {
      statisticsDatalist(this.from).then((res) => {
        if (res.code == 200) {
         
          if(res.result!=null){
            
            res.result.forEach(item=>{
            item.begin=item.begin||'-'
            item.beginValue=item.beginValue===null?'-':item.beginValue
            item.end=item.end||'-'
            item.endValue=item.endValue===null?'-':item.endValue
            item.cost=item.cost===null?'-':item.cost
            item.convert=item.convert===null?'-':item.convert
            item.co2=item.co2===null?'-':item.co2
          })
          this.topList = res.result;
          }else{
            this.topList=[]
          }
          
          this.$forceUpdate();
        }
      });
    },
    getByType() {
      getByType({ type: 1 }).then((res) => {
        console.log(res.result[0], "124578");
        if (res.code == 200) {
          this.from.mapId = res.result[0].id;
          this.treeList = res.result;
          this.statisticsDatalist()
        }
      });
    },
    onClick(value) {
      this.from.mapId = value;
      this.statisticsDatalist();
    },

    onTime(value, indextag) {
      this.from.beginTime = value[0];
      this.from.endTime = value[1];
      this.from.dateType = indextag;
     
      this.statisticsDatalist();
    },
  }
};
</script>

<style scoped lang="less">
.bg {
  display: flex;
  width: 100%;
  height: 100%;
}
.left {
  flex: 1;    height: 100%;
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
