<template>
  <div class="secenter">
    <div class="bg tables" v-if="!switchChange">
      <a-modal
        class="bgs tiShiColor"
        v-model="remotevisible"
        title="确认抄表"
        @ok="addRemote"
      >
        <div
          style="display: flex; flex-direction: column; gap: 20px
          ; color: #fff; "
        >
          <div>上次抄表时间： {{ lastReadingTime }}</div>
          <div style="display: flex; flex-direction: row;">
            <div>备注：</div>
            <div>
              <a-textarea
                placeholder="请输入备注"
                v-model="writeRemark"
              ></a-textarea>
            </div>
          </div>
        </div>
      </a-modal>
      <!-- <div class="left">
    
      <div class="tree"><tree :treeList="treeList"  v-if="treeList.length>0"
          @onClick="onClick"/></div>
    </div> -->

      <div class="right " v-if="!switchChange">
        <div class="title">
          远程抄表
        </div>
        <div class="main-box tables bgs">
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
              <a-row :gutter="50">
                <a-col :xl="6" :md="6" :sm="24">
                  <a-form-model-item label="抄表人：">
                    <a-select
                      style="width: 100%"
                      v-model="selectMeterReader"
                      placeholder="请选择内容"
                      optionFilterProp="children"
                      showSearch
                      allowClear
                    >
                      <a-select-option
                        v-for="(category, index) in MeterReader"
                        :key="index"
                        :value="category"
                      >
                        {{ category }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="7" :md="7" :sm="24">
                  <a-form-model-item
                    label="抄表时间："
                    style="width: 100% !important"
                  >
                    <a-range-picker v-model="meterTime" @change="timeChange">
                      <img
                        src="@assets/hotai/rili.png"
                        slot="suffixIcon"
                        alt=""
                      />
                    </a-range-picker>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="10" :sm="24">
                  <a-form-model-item label="备注： ">
                    <a-input v-model="Note" placeholder="请输入备注"></a-input>
                  </a-form-model-item>
                </a-col>

                <a-col :xl="3" :md="6" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-button
                      type="primary"
                      :loading="searchBtn"
                      @click="searchQuery"
                      icon="search"
                      >查询</a-button
                    >
                    <a-button
                      class="buttton2"
                      type="primary"
                      @click="searchReset"
                      icon="reload"
                      style="margin-left: 32px"
                      >重置</a-button
                    >
                  </span>
                </a-col>
                <a-col :xl="4" :md="8" :sm="24">
                  <span class="table-page-search-submitButtons"
                    ><a-button type="primary" @click="remoteSwitch()">
                      远程抄表
                    </a-button></span
                  >
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="right-bottom">
            <a-table
              :pagination="ipagination"
              @change="handleTableChange"
              :columns="columns"
              :data-source="data"
              :scroll="{ y: 580 }"
            >
              <span slot="action" slot-scope="text, record">
                <span>
                  <a class="ant-dropdown-link" @click="manualButton(record)">
                    详情
                  </a>
                </span>
                <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
                <span>
                  <a class="ant-dropdown-link" @click="deriveButton(record)">
                    导出
                  </a>
                </span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <meter-details
        :detailsId="detailsId"
        @Toggle="handleCustomEvent"
      ></meter-details>
    </div>
  </div>
</template>

<script>
import { downFile } from "@/api/manage";
import {
  addremoteEntry,
  ReadTime,
  queryReadingRecord,
  deriveReading,
} from "@/api/meterReading";
import tree from "@/components/Tree/tree.vue";
import meterDetails from "./module/meterDetails.vue";
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
  },
  {
    title: "抄表人",
    dataIndex: "createBy",

    align: "center",
  },
  {
    title: "抄表设备数量",
    dataIndex: "deviceNumber",

    align: "center",
  },
  {
    title: "抄表时间",
    dataIndex: "reportDate",
    align: "center",
  },

  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  components: { tree, meterDetails },
  data() {
    return {
      searchBtn: false,
      MeterReader: [],
      lastReadingTime: undefined,
      detailsId: "", //详情id
      switchChange: false,
      mapId: undefined, //车间位置id
      remotevisible: false, //远程抄表提示
      treeList: {}, //左侧树数据
      selectMeterReader: undefined, //选中抄表人

      meterTime: undefined, //时间
      dateStart: undefined, //开始
      dateEnd: undefined, //结束

      Note: undefined, //备注
      deviceType: [
        {
          type: 1,
          name: "智能",
        },
        {
          type: 2,
          name: "机械",
        },
      ],
      deviceStatus: [
        {
          state: "1",
          name: "在线",
        },
        {
          state: "2",
          name: "离线",
        },
      ],

      data: [],
      writeRemark: undefined, //输入备注
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
      columns,
    };
  },
  created() {
    this.getEquipmentlist();
  },
  methods: {
    // 导出
    deriveButton(record) {
      downFile("carbon/cyBizDeviceDataRecord/exportXls", {
        remoteRecordId: record.id,
      }).then((data) => {
        console.log(data);
        let fileName = record.remark + "-远程抄表导出文件";
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], { type: "application/vnd.ms-excel" }),
            fileName + ".xls"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], { type: "application/vnd.ms-excel" })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", fileName + ".xls");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      });
    },
    // 确认抄表
    addRemote() {
      addremoteEntry({ remark: this.writeRemark }).then((res) => {
        if (res.code == 200) {
          this.$message.warning("抄表成功");
          this.getEquipmentlist();
        } else {
          this.$message.warning("抄表失败");
        }
      });
      this.remotevisible = false;
    },
    timeChange(data, dateString) {
      this.dateStart = dateString[0];
      this.dateEnd = dateString[1];
    },
    handleCustomEvent(value) {
      this.switchChange = value;
    },

    remoteSwitch() {
      this.writeRemark = undefined; //输入备注
      ReadTime().then((res) => {
        if (res.code == 200) {
          this.lastReadingTime = res.result;
        } else {
          this.lastReadingTime = "-";
        }
      });
      this.remotevisible = true;
    },

    // 获取数据
    getEquipmentlist(data) {
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      if (data) {
        parameter = Object.assign(parameter, data);
      }
      console.log(parameter, "parameter");
      queryReadingRecord(parameter).then((res) => {
        this.MeterReader = [];
        if (res.code == 200) {
          res.result.records.forEach((item, number) => {
            item.index = number + 1;
            item.deviceNumber =
              item.deviceNumber === null ? "-" : item.deviceNumber;
            item.remark = item.remark || "-";
            item.reportDate = item.reportDate || "-";
            item.createBy = item.createBy || "-";
            this.MeterReader.push(item.createBy);
          });
          this.ipagination.total = res.result.total;
          this.data = res.result.records;
          this.MeterReader = this.MeterReader.filter(
            (item, index) => this.MeterReader.indexOf(item) == index
          );
        } else {
          this.$message.warning(res.message);
        }
        this.searchBtn=false
      });
    },

    searchReset() {
      // 重置，列表数据为空
      this.selectMeterReader = undefined; //选中抄表人
      this.Note = undefined;
      this.dateEnd = undefined;
      this.dateStart = undefined;
      this.meterTime = undefined; //选择设备状态
      this.getEquipmentlist();
    },
    searchQuery() {
      let parameter = {
        createBy: this.selectMeterReader,
        remark: this.Note,
      };
      this.searchBtn = true;
      this.getEquipmentlist(parameter);
    },
    handleButtonClick(e) {
      console.log("click left button", e);
    },
    handleMenuClick(e) {
      console.log("click", e);
    },
    manualButton(record) {
      this.detailsId = record.id;
      this.switchChange = true;
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
      let parameter = {
        createBy: this.selectMeterReader,
        remark: this.Note,
      };
      this.getEquipmentlist(parameter);
      //   this.loadData();
    },
  },
};
</script>
<style lang="less">
.ant-calendar-picker-input.ant-input {
  width: 300px !important;
}
.ant-modal-content {
  background-color: #0b4144 !important;
}
.ant-modal-header {
  background-color: #0b4144 !important;
  border: 0 !important;
}
.ant-modal-footer {
  border: 0 !important;
}
</style>
<style scoped lang="less">
.secenter {
  width: 100%;
  height: 100%;
}
.bg {
  display: flex;
  width: 100%;
  height: 100%;
}

.right {
  background: #013038;
  .title {
    width: 80px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff !important;
    margin-bottom: 22px;
  }
}

.left-box {
  position: absolute;
  right: 0;
  bottom: 25px;
  display: flex;
  justify-content: space-between;
  gap: 18px;
}
.table-page-search-wrapper {
  position: relative;
}
</style>
