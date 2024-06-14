<template>
  <div class=" bgs tables ">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <div class="box-top">
        <div class="left-top">
          <div
            @click.prevent="BackButton"
            style="width: 30px; cursor: pointer; margin-right: 16px;"
          >
            <img src="../../../assets/Frame 265@2x.png" alt="" />
          </div>
          <div class="title">
            远程抄表
          </div>
        </div>
        <div class="right-top">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" icon="reload" style="margin-left: 8px"
              @click="deriveButton" :loading="leadBtn">导出数据</a-button
            >
          </span>
        </div>
      </div>
    </div>

    <div class="right-bottom">
      <a-table
        :pagination="ipagination"
        :columns="Newcolumns"
        :data-source="data"
        :scroll="{ y: 580 }"
        @change="handleTableChange"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import { downFile} from '@/api/manage'
import { queryReadingById } from "@/api/meterReading";
const Newcolumns = [
  {
    title: "设备名称",
    dataIndex: "name",
    align: "center",
  },

  {
    title: "计量类型",
    dataIndex: "measureType_dictText",
    align: "center",
  },
  {
    title: "设备位置",
    dataIndex: "locationName",
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
    title: "能耗",
    dataIndex: "Energy",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
  },
];
export default {
  props: {
    detailsId: String,
  },
  data() {
    return {
      leadBtn:false,
      Newcolumns,
      data: [],
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
    };
  },
  created() {
    this.getReadingDetails();
  },
  methods: {
   // 导出
   deriveButton(){
      // this.leadBtn=true
      downFile('carbon/cyBizDeviceDataRecord/exportXls',{remoteRecordId:this.detailsId}).then((data)=>{
        let fileName = "远程抄表详情文件";
        if (!data) {
        this.$message.warning("文件下载失败")
      
        return
      }
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
      }else{
        let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName+'.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link); //下载完成移除元素
        window.URL.revokeObjectURL(url); //释放掉blob对象
      }
      this.leadBtn=false
    })
    
  },
    getReadingDetails() {
      let parameter={
        pageNo:this.ipagination.current,
        pageSize:this.ipagination.pageSize,
        remoteRecordId: this.detailsId
      }
      queryReadingById(parameter).then((res) => {
        if (res.code == 200) {
          res.result.records.forEach((item) => {
            item.name = item.name || "-";
            item.deviceType_dictText = item.deviceType_dictText || "-";
            item.locationName = item.locationName || "-";
            item.recordTime = item.recordTime || "-";
            item.lastTime = item.lastTime || "-";
            item.value = item.value || "-";
            item.lastValue = item.lastValue || "-";
            if (item.value) {
              item.Energy = (item.value - item.lastValue).toFixed(2);
            }
            item.Energy = item.Energy || "-";
            if (item.deviceType == "1") {
              item.unit = "KWh";
            } else if (item.deviceType == "2") {
              item.unit = "t";
            } else if (item.deviceType == "3") {
              item.unit = "M^3";
            }
          });
          this.ipagination.total = res.result.total;
          this.data = res.result.records;
        }
      });
    },
    BackButton() {
      console.log(this.detailsId);
      this.$emit("Toggle", false);
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
      this.getReadingDetails();
      //   this.loadData();
    },
  },
};
</script>

<style scoped lang="less">
.box-top {
  display: flex;
  justify-content: space-between;
}
.left-top {
  display: flex;
  .title {
    width: 80px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff !important;
    margin-bottom: 22px;
  }
}
</style>
