<template>
  <div class="bg tables bgs">
    <div class="left">
      <div class="title">抄表记录</div>
      <tree 
      :treeList="treeList"
        v-if="treeList.length > 0"
      @onClick="onClick"
      />
    </div>
    <div class="right">
      <div class="right-top">
        <div class="flex" style="gap: 50px">
          <div class="times">
            日期：
            <a-range-picker  >
              <img src="@assets/hotai/rili.png" slot="suffixIcon" alt="" />
            </a-range-picker>
          </div>
          <div class="flex" style="gap: 24px">
            <div
              v-for="(item) in listArr"
              :key="item.id"
              :class="{ selcrt: energyofs != item.id, selcrt1: energyofs == item.id }"
              @click="ontable(item.id)"
            >
              {{ item.text }}
            </div>
          </div>
          <div class="exportButton">
            <a-button type="primary">导出数据</a-button>
          </div>
        </div>
      </div>
      <div class="right-bottom">
        <a-table
          :pagination="ipagination"
          :columns="columns"
          :data-source="data"

          :scroll="{ y: 480 }"
          @change="handleTableChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import { queryRecordsList } from "@/api/meterReading";
import { getByType } from "@/api/tanpai";

export default {
  components: { tree, eacharts },
  data() {
    return {
      mapId:undefined,//车间id
      treeList: {},//左侧树数据
      energyofs: 0,//切换
      listArr: [
        {
          id: "0",
          text:"全部"
        },
        {
          id: "1",
          text: "电",
        },
        {
          id: "2",
          text: "水",
        },
        {
          id: "3",
          text: "天然气",
        },
      ],
    
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
          title: "设备名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "计量类型",
          dataIndex: "deviceType_dictText",
          align: "center",
        },
        {
          title: "设备编号",
          dataIndex: "sn",
          align: "center",
        },
        {
          title: "抄表时间",
          dataIndex: "recordTime",
          align: "center",
        },

        {
          title: "表底值",
          dataIndex: "value",
          align: "center",
        },
        {
          title: "上次抄表时间",
          dataIndex: "lastTime",
          align: "center",
        },
        {
          title: "上次表底值",
          dataIndex: "lastValue",
          align: "center",
        },
        {
          title: "差值 (KWh)",
          dataIndex: "differenceValue",
          align: "center",
        },
      ],
      data: [],
    };
  },
  created() {
    this.getRecordsList();
    this.getByType();
  },
  methods: {
    onClick(value){
      this.mapId=value
      this.getRecordsList();
    },
    getByType() {
      getByType({ type: 1 }).then((res) => {
 
        if (res.code == 200) {
          // this.from.mapId = res.result[0].id;
          this.treeList = res.result;
      
        }
      });
    },
    TimeChange(data,dataStrings){
      // console.log();
     
      this.getRecordsList(this.energyofs,dataStrings[0],dataStrings[1])
    },
    ontable(index){
   
      if(index!=='0'){
        this.getRecordsList(index)
      }else{
        this.getRecordsList();
      }
      this.energyofs = index;
    
    },
    // 获取数据
    getRecordsList(index,beginTime,endTime) {
      let parameter = {
        beginTime,
        endTime,
        deviceType:index,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        location:this.mapId
      };
      queryRecordsList(parameter).then((res) => {
        if (res.code == 200) {
          this.data = res.result.records;
          this.ipagination.total = res.result.total;

          // this.data.differenceValue=this.data.value-this.data.lastValue
          this.data.forEach(e=>{
            if(e.lastValue){
              e.differenceValue=parseFloat(e.value-e.lastValue).toFixed(4)
            }else{
              e.differenceValue = "--"
            }
            e.lastValue = e.lastValue?e.lastValue:'--'
            e.lastTime = e.lastTime?e.lastTime:'--'
          })
         
        }
      });
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      
      if (Object.keys(sorter).length > 0) {
        this.sortedInfo = this.sortedInfo = sorter;
      } else {
        this.sortedInfo = {};
      }
      this.ipagination = pagination;
      this.getRecordsList();
      //   this.loadData();
    },
  },
};
</script>
<style lang="less"></style>
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
.times {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
}
.flex {
  display: flex;
  align-items: center;
}
.exportButton {
  margin-left: 315px;
}
.right-top {
  padding: 24px 0 0 0;
}

.selcrt {
  width: 88px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #1ffff2;
  background: url("../../assets/hotai/img.png");
  background-size: 100%;
  background-repeat: no-repeat;
}
.selcrt1 {
  width: 88px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  background: url("../../assets/hotai/img1.png");
  background-size: 100%;
  background-repeat: no-repeat;
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
