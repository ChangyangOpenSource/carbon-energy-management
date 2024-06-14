<template>
  <div class="bg tables">
    <a-modal
      class="bgs tiShiColor"
      v-model="remotevisible"
      title="导入"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="okLoding"
    >
      <a-upload
        name="file"
        accept=".xlsx,.xls"
        :headers="headers"
        :file-list="keyList"
        :customRequest="fileUpload"
      >
        <a-button>
          上传
        </a-button>
      </a-upload>
      <div>
        <div style="color: #fff; margin-top: 10px;">
          导入文件：
          {{ documentName }}
        </div>
      </div>
    </a-modal>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper bgs">
      <div class="title">水表录入</div>
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="设备编号：">
              <a-select
                allowClear
                show-search
                optionFilterProp="children"
                placeholder="请输入搜索"
                v-model="selectDeviceId"
              >
                <a-select-option
                  v-for="(category, index) in deviceList"
                  :value="category.sn"
                  :key="index"
                >
                  {{ category.sn }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="设备名称：">
              <a-select
                allowClear
                show-search
                optionFilterProp="children"
                placeholder="请输入搜索"
                v-model="selectDeviceName"
              >
                <a-select-option
                  v-for="(category, index) in deviceList"
                  :value="category.name"
                  :key="index"
                >
                  {{ category.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="设备位置：">
              <a-tree-select
                v-model="selectMonitoringRange"
                placeholder="请选择范围"
                multiple
                :tree-data="monitoringRange"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="本次抄表时间：">
              <div class="times">
                <a-range-picker v-model="selectMotiorTime" @change="TimeChange">
                  <img src="@assets/hotai/rili.png" slot="suffixIcon" alt="" />
                </a-range-picker>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col :xl="4" :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search"
                >查询</a-button
              >
              <a-button
                class="buttton2"
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 24px"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
      <div class="poasr">
        <a-button type="primary" @click="leadInto" > 导入 </a-button>
        <a-button type="primary" @click="download"> 下载模板 </a-button>
      </div>
    </div>

    <div class="right-bottom">
      <a-table
        :pagination="ipagination"
        :columns="columns"
        :data-source="data"
        :scroll="{ y: 520 }"
        @change="handleTableChange"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import { getByType } from "@/api/tanpai.js";
import { queryEquipmentList } from "@/api/Equipment";
import { queryReadingList, excelCheck, importExcel } from "@/api/meterReading";
let formData = new FormData();
export default {

  data() {
    return {
      deviceList: [], //设备数据
      okLoding:false,
      headers: {
        ContentType: "application/json",
      },
      keyList: null, //导入文件
      documentName: undefined,
      remotevisible: false,
      selectDeviceId:undefined,//选中设备编号
      selectDeviceName:undefined,//选中设备名称
      selectMonitoringRange:[],//选中设备位置
      startTime:undefined,//开始时间
      endTime:undefined,//结束时间
      monitoringRange: [], //设备位置
      selectMotiorTime:undefined,//时间
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      inquire: {
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
        pageNo: 1,
        pageSize: 10,
      },

      isAss: false,
      // visible: false,
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
          title: "序号",
          dataIndex: "index",
          align: "center",
        },
        {
          title: "设备编号",
          dataIndex: "sn",
          align: "center",
        },
        {
          title: "设备名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "设备位置",
          dataIndex: "locationName",
          align: "center",
        },
        {
          title: "本次抄表值",
          dataIndex: "value",
          align: "center",
        },
        {
          title: "本次抄表时间",
          dataIndex: "recordTime",

          align: "center",
        },
        {
          title: "上次抄表值",
          dataIndex: "lastValue",

          align: "center",
        },
        {
          title: "上次抄表时间",
          dataIndex: "lastTime",

          align: "center",
        },
        {
          title: "能耗值",
          dataIndex: "support",
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",

          align: "center",
        },
      ],

      data: [],
    };
  },
  created() {
    this.getMonitoringScope();
    this.getWaterMeter();
    this.getEquipmentList();
  },
  methods: {
    getEquipmentList() {
      let parameter = {
        pageNo: 1,
        pageSize: 100,
        deviceType:2,
        measureType: 2,
      };
      queryEquipmentList(parameter).then((res) => {
        if (res.code == 200) {
          this.deviceList = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    download(){
      window.open(location.protocol + '//' +  location.host + "/download/抄表记录.xlsx")
    },
    handleCancel() {},
    handleOk() {
      this.okLoding=true
      excelCheck(formData).then((res) => {
        if (res.code==200) {
          importExcel(formData).then((res) => {
            if (res.code == 200) {
              this.$message.warning(res.message);
              this.getWaterMeter();
              this.okLoding=false
              this.remotevisible = false;
            } else {
              this.okLoding=false
              this.$message.warning(res.message);
            }
          });
        } else {
          this.okLoding=false
          this.$message.warning(res.message);
        }
      });
    },
    fileUpload(info) {
      formData = new FormData();
      this.documentName = info.file.name;
      formData.append("file", info.file);
      formData.append("type", 2);
      formData.append("token", this.headers);
    },
    // 导入
    leadInto() {
      this.documentName = undefined;
      this.remotevisible = true;
    },
    TimeChange(time,timeString){

      this.startTime=timeString[0]
      this.endTime=timeString[1]
    },
    // 获取监控范围数据
    getMonitoringScope() {
      let parameter = {
        type: 1,
      };
      getByType(parameter).then((res) => {
        if (res.code == 200) {
          // this.from.mapId = res.result[0].id;
          // console.log(res.result,'监控1范围');

          this.monitoringRange = this.convertData(res.result);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    convertData(data) {
      return data.map((item) => ({
        title: item.name,
        value: item.id,
        key: item.id,
        children:
          item.children.length > 0 ? this.convertData(item.children) : [],
      }));
    },

    getWaterMeter(params) {
      let parameter = {

        measureType: 2,
        deviceType:2,
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      if(params)
      {
        parameter=Object.assign(parameter,params)
      }

      queryReadingList(parameter).then((res) => {
        if (res.code == 200) {
          console.log(res, "result");
          res.result.records.forEach((item, index) => {
            item.index = index + 1;
            item.unit = "t";
            item.location = item.location || "-";
            item.lastTime = item.lastTime || "-";
            item.recordTime = item.recordTime || "-";
            item.deviceSn=item.deviceSn || '-'
            item.deviceName=item.deviceName||'-'
            item.value=item.value||'-'
            if (item.lastValue===null) {
              item.support = "-";
              item.lastValue = "-";

            } else {
              item.support = item.value - item.lastValue;
            }
          });
          this.ipagination.total = res.result.total;
          this.data = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
    },


    searchQuery() {
      let parameter={
        location: this.selectMonitoringRange.toString(),
        beginTime: this.startTime,
        endTime: this.endTime,
        sn:this.selectDeviceId,
        name:this.selectDeviceName
      }

      this.getWaterMeter(parameter)

    },
    searchReset() {

       this.selectDeviceId=undefined
       this.selectDeviceName=undefined
       this.startTime=undefined
       this.endTime=undefined
       this.selectMonitoringRange=[]
       this.selectMotiorTime=undefined,
      this.getWaterMeter();
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
      let parameter={
        location: this.selectMonitoringRange.toString(),
        beginTime: this.startTime,
        endTime: this.endTime,
        sn:this.selectDeviceId,
        name:this.selectDeviceName
      }
      this.getWaterMeter(parameter);

    },
  },
};
</script>
<style lang="less" scoped>
 ::v-deep .ant-calendar-picker-input.ant-input{
  width: 415px !important;
}
.ant-drawer-content {
  background-color: #0b4144 !important;
}
.ant-modal-header {
  background-color: #0b4144 !important;
  border: 0 !important;
}
.ant-modal-footer {
  border: 0 !important;
}
.ant-drawer-header {
  background-color: #0b4144 !important;
  border: 0 !important;

  .ant-drawer-title {
    font-weight: 500 !important;
    font-size: 16px !important;
    color: #ffffff !important;
  }
}
</style>
<style scoped lang="less">
.bg {
  width: 100%;
  height: 100%;
}

.instructions {
  margin-left: 142px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 20px;
  text-align: left;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
}
.poasr {
  width: 250px;
  display: flex;
  position: absolute;
  flex-direction: row-reverse;
  justify-content: space-between;
  right: 0;
  bottom: 25px;
}
.table-page-search-wrapper {
  position: relative;
}
</style>
