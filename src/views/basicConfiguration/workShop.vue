<template>
  <div class="bg bgs tables">
    <a-drawer
      :title="drawerTitle"
      :width="900"
      :visible="visible"
      @close="WorkClose"
      :maskClosable="false"
    >
      <a-form-model
        class="tables"
        style="background-color: #0b4144"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :required="true" label="排放阶段:">
          <div style="color: #fff">{{ processName }}</div>
        </a-form-model-item>
        <a-form-model-item :required="true" label="排放范围:">
          <a-tree-select
            :disabled="detailVisible"
            v-model="selectMonitoringRange"
            placeholder="请选择排放范围"
            :tree-data="formObj.dischargeRange"
            multiple
            allowClear
            
            tree-default-expand-all
            @change="rangeChange"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item :required="true" label="设备:">
          <!-- <a-checkbox-group
                v-model="checkedList"
                :options="workshopProcesses"
                @change="onChange"
              /> -->
          <div
            v-if="deviceProcess.dataA.options.length > 0"
            style="flex-grow: 1;"
          >
            <div>电表</div>
            <a-checkbox
              v-show="!detailVisible"
              :indeterminate="deviceProcess.dataA.indeterminate"
              :checked="deviceProcess.dataA.checkAll"
              @change="onCheckAllChangeA"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              :disabled="detailVisible"
              v-model="deviceProcess.dataA.checked"
              :options="deviceProcess.dataA.options"
              @change="onChangeA"
            />
          </div>

          <div
            v-if="deviceProcess.dataB.options.length > 0"
            style="flex-grow: 1;"
          >
            <div>水表</div>
            <a-checkbox
              v-show="!detailVisible"
              :indeterminate="deviceProcess.dataB.indeterminate"
              :checked="deviceProcess.dataB.checkAll"
              @change="onCheckAllChangeB"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              :disabled="detailVisible"
              v-model="deviceProcess.dataB.checked"
              :options="deviceProcess.dataB.options"
              @change="onChangeB"
            />
          </div>

          <div v-if="deviceProcess.dataC.options.length > 0">
            <div>天然气表</div>
            <a-checkbox
              v-show="!detailVisible"
              :indeterminate="deviceProcess.dataC.indeterminate"
              :checked="deviceProcess.dataC.checkAll"
              @change="onCheckAllChangeC"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              :disabled="detailVisible"
              v-model="deviceProcess.dataC.checked"
              :options="deviceProcess.dataC.options"
              @change="onChangeC"
            />
          </div>
        </a-form-model-item>
      </a-form-model>
      <div
        class="bgs"
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',

          padding: '10px 16px',
          background: '#0B4144',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button
          class="buttton2"
          :style="{ marginRight: '8px' }"
          @click="WorkClose"
        >
          取消
        </a-button>
        <a-button type="primary" @click="saveWorkshop" :loading="saveBtn"> 保存 </a-button>
      </div>
    </a-drawer>

    <div class="left">
      <div class="title">产品阶段管理</div>
      <div class="tree">
        <tree
          :treeList="treeList"
          v-if="treeList.length > 0"
          @onClick="onClick"
        />
      </div>
    </div>

    <div class="right">
      <div class="main-box tables">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="60">
              <a-col :xl="8" :md="8" :sm="24">
                <a-form-model-item label="排放阶段：">
                  <a-select
                    style="width: 100%"
                    v-model="selectDischargeSatage"
                    placeholder="请输入搜索"
                    optionFilterProp="children"
                    showSearch
                    allowClear
                  >
                    <a-select-option
                      v-for="category in data"
                      :key="category.name"
                      :value="category.name"
                    >
                      {{ category.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :xl="8" :md="8" :sm="24">
                <a-form-model-item label="排放范围:">
                  <a-tree-select
                    v-model="selectWorkshopRange"
                    placeholder="请选择排放范围"
                    multiple
                    :tree-data="formObj.dischargeRange"
                    tree-default-expand-all
                  >
                  </a-tree-select>
                </a-form-model-item>
              </a-col> -->

              <a-col :xl="4" :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" :loading="searchBtn" icon="search" @click="searchButton"
                    >查询</a-button
                  >
                  <a-button
                    class="buttton2"
                    type="primary"
                    icon="reload"
                    style="margin-left: 24px"
                    @click="resetButton"
                    >重置</a-button
                  >
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="right-bottom">
          <a-table
            :pagination="ipagination"
            :columns="columns"
            :data-source="data"
            :scroll="{ y: 580 }"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a class="ant-dropdown-link" @click="detailsButton(record)">
                查看
              </a>
              <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
              <a class="ant-dropdown-link" @click="editButton(record)">
                编辑
              </a>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  cyEnergyQuantity,
  cyworkshopById,
  cyworkshopManagementEdit,
  getByType,
} from "@/api/tanpai";
import { queyrMapDeviceList } from "@/api/monitoring";
import tree from "@/components/Tree/tree.vue";

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    align: "center",
  },
  {
    title: "排放阶段",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "排放范围 ",
    dataIndex: "rangeName",

    ellipsis: true,
    align: "center",
  },
  {
    title: "电表数量",
    dataIndex: "ammeterNum",
    align: "center",
  },
  {
    title: "水表数量",
    dataIndex: "waterMeterNum",
    align: "center",
  },
  {
    title: "气表数量",
    dataIndex: "naturalGasMetersNum",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  components: { tree },
  data() {
    return {
      searchBtn:false,
      saveBtn:false,
      detailVisible: false,
      drawerTitle: "编辑",
      mapId: '', //阶段位置默认值
      treeList: {}, //左侧树数据
      processId: undefined, //工序id
      processName: undefined, //工序名
      selectMonitoringRange: [], //选中排放范围
      parentId: undefined, //平台id
      selectDischargeSatage: undefined, //选中位置
      selectWorkshopRange: undefined, //选中阶段
      checkedList: [],

      deviceProcess: {
        dataA: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataB: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataC: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
      }, //设备
      formObj: {
        dischargeRange: [], //排放范围
      },

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      visible: false,
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
      data: [],
      columns,
    };
  },
  created() {
    this.getInit();

   
  },
  methods: {
    onClick(value) {
      this.mapId = value;
      this.getWorkShopList();
    },
    saveWorkshop() {

      let parameter = {
        mapDeviceProcess: {
          processId: this.processId,
          deviceList: [],
        },
        processId: this.processId,
        workshopProcess: {
          processId: this.processId,
          workShopList: [],
        },
      };
      this.saveBtn=true
      this.selectMonitoringRange.forEach((item) => {
        parameter.workshopProcess.workShopList.push({
          id: item,
        });
      });

      ["dataC", "dataA", "dataB"].forEach((key) => {
        this.deviceProcess[key].checked.forEach((param) => {
          parameter.mapDeviceProcess.deviceList.push({
            id: param,
          });
        });
      });
      cyworkshopManagementEdit(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning("编辑成功");
          this.visible = false;
          this.deviceProcess = {
            dataA: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
            dataB: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
            dataC: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
          };
          this.getWorkShopList();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    rangeChange() {
      // this.deviceProcess.dataA.options = [];
      // this.deviceProcess.dataB.options = [];
      // this.deviceProcess.dataC.options = [];
      // let param = {
      //   ids: this.selectMonitoringRange,
      // };
      // console.log(this.selectMonitoringRange,'range');
      queyrMapDeviceList(this.selectMonitoringRange).then((res) => {
        if (res.code == 200) {
          this.deviceProcess = {
            dataA: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
            dataB: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
            dataC: {
              indeterminate: false,
              checkAll: false,
              checked: [],
              options: [],
            },
          };

          const dataMap = {
            1: "dataA",
            2: "dataB",
            3: "dataC",
          };

          res.result.forEach((item) => {
            const dataKey = dataMap[item.measureType];
            if (dataKey) {
              const options = this.deviceProcess[dataKey].options;

              if (!options.includes(item.name)) {
                options.push({
                  label: item.name,
                  value: item.id,
                });
              }
            }
          });
          console.log(this.deviceProcess.dataC.checked, "rangechange");
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    locationChange(value) {
      if (value == "-") {
        this.selectWorkshopRange = undefined;
      }
    },
    resetButton() {
      this.selectDischargeSatage = undefined;
      this.selectWorkshopRange = undefined;
      this.getWorkShopList();
    },
    // 查询
    searchButton() {
      let paramter = {
        processName: this.selectDischargeSatage,
        workshopName: this.selectWorkshopRange,
      };
      this.searchBtn=true
      this.getWorkShopList(paramter);
    },
    // 获取数据
    getWorkShopList(parm) {
      let paramter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        parentId: this.mapId,
      };

      if (parm) paramter = Object.assign(paramter, parm);
      cyEnergyQuantity(paramter).then((res) => {
        if (res.code == 200) {
          res.result.forEach((item, index) => {
            item.index = index + 1;
            if (
              !(
                item.rangeName ||
                item.ammeterNum ||
                item.naturalGasMetersNum ||
                item.rangeIdsText ||
                item.waterMeterNum
              )
            ) {
              item.rangeName = "-";
              item.ammeterNum = "-";
              item.naturalGasMetersNum = "-";
              item.rangeIdsText = "-";
              item.waterMeterNum = "-";
            }
            item.rangeName = item.rangeName.toString();
          });
          this.data = res.result;
          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message);
        }
        this.searchBtn=false
      });
    },
   /**
    * 获取初始数据
    */
    getInit() {
      getByType({
        type: 1,
      }).then((res) => {
        if (res.code == 200) {
          if (res.code == 200) {
            this.formObj.dischargeRange = this.convertData(res.result);
            console.log(this.formObj.dischargeRange,'dischangRamge');
          } else {
            this.$message.warning(res.message);
          }
        }
      });
      
      getByType({
        type: 3,
      }).then((res) => {
        if (res.code == 200) {
          if (res.code == 200) {
            this.treeList = res.result;
            this.mapId=res.result[0].id;
            
            this.getWorkShopList();
          } else {
            this.$message.warning(res.message);
          }
        }
      });
    
    },
    onCheckAllChange(e, data) {
      let keyData = [];
      data.options.forEach((item) => {
        keyData.push(item.value);
      });
      data.checked = e.target.checked ? keyData : [];
      data.indeterminate = false;
      data.checkAll = e.target.checked;
    },
    onCheckAllChangeC(e) {
      this.onCheckAllChange(e, this.deviceProcess.dataC);
    },
    onCheckAllChangeB(e) {
      this.onCheckAllChange(e, this.deviceProcess.dataB);
    },
    onCheckAllChangeA(e) {
      this.onCheckAllChange(e, this.deviceProcess.dataA);
    },

    optimizeOnChange(data, checkedList) {
      data.indeterminate =
        !!checkedList.length && checkedList.length < data.options.length;
      data.checkAll = checkedList.length === data.options.length;
    },

    onChangeC(checkedList) {
      this.optimizeOnChange(this.deviceProcess.dataC, checkedList);
    },
    onChangeB(checkedList) {
      this.optimizeOnChange(this.deviceProcess.dataB, checkedList);
    },
    onChangeA(checkedList) {
      this.optimizeOnChange(this.deviceProcess.dataA, checkedList);
    },
    WorkClose() {
      // console.log("保存", this.formObj);
      this.visible = false;
     
    },
    // setSessionStorageItems(form){
    //   const item={...form}
    //   for(const key in items){
    //       if (
    //       items.hasOwnProperty(key) &&
    //       items[key] !== null &&
    //       items[key] !== undefined
    //     ) {
    //       sessionStorage.setItem(key, items[key].toString()); // 转换为字符串以存储在 sessionStorage 中
    //     }
    //     }
    // },
    // 详情按钮
    detailsButton(record) {
      this.detailVisible = true;
      this.drawerTitle = "详情";
      this.selectMonitoringRange = [];
      let paramter = {
        id: record.id,
      };
      this.deviceProcess = {
        dataA: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataB: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataC: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
      };
      cyworkshopById(paramter).then((res) => {
        if (res.code == 200) {
          this.processName = res.result.processName;
          this.processId = res.result.processId;
          res.result.workshopProcesses.forEach((item) => {
            this.selectMonitoringRange.push(item.workshopId);
          });

          queyrMapDeviceList(this.selectMonitoringRange).then((resB) => {
            if (resB.code == 200) {
              const dataMap = {
                1: "dataA",
                2: "dataB",
                3: "dataC",
              };

              resB.result.forEach((item) => {
                const dataKey = dataMap[item.measureType];
                if (dataKey) {
                  const options = this.deviceProcess[dataKey].options;

                  if (!options.includes(item.name)) {
                    options.push({
                      label: item.name,
                      value: item.id,
                    });
                  }
                }
              });
              res.result.deviceProcess.forEach((item, index) => {
                const deviceId = item.deviceId;
                const dataOptions = [
                  this.deviceProcess.dataA,
                  this.deviceProcess.dataB,
                  this.deviceProcess.dataC,
                ];

                dataOptions.forEach((data) => {
                  data.options.forEach((param) => {
                    if (deviceId === param.value) {
                      data.checked.push(deviceId);
                    }
                  });
                  if (data.options.length == data.checked.length) {
                    data.checkAll = true;
                  }
                });
              });
            } else {
              this.$message.warning(resB.message);
            }
          });
        }
      });
      this.visible = true;
    },
    // 编辑按钮
    editButton(record) {
      this.saveBtn=false
      this.detailVisible = false;
      this.drawerTitle = "编辑";
      this.selectMonitoringRange = [];
      let paramter = {
        id: record.id,
      };
      this.deviceProcess = {
        dataA: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataB: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
        dataC: {
          indeterminate: false,
          checkAll: false,
          checked: [],
          options: [],
        },
      };
      cyworkshopById(paramter).then((res) => {
        if (res.code == 200) {
          this.processName = res.result.processName;
          this.processId = res.result.processId;
          res.result.workshopProcesses.forEach((item) => {
            this.selectMonitoringRange.push(item.workshopId);
          });

          queyrMapDeviceList(this.selectMonitoringRange).then((resB) => {
            if (resB.code == 200) {
              const dataMap = {
                1: "dataA",
                2: "dataB",
                3: "dataC",
              };

              resB.result.forEach((item) => {
                const dataKey = dataMap[item.measureType];
                if (dataKey) {
                  const options = this.deviceProcess[dataKey].options;

                  if (!options.includes(item.name)) {
                    options.push({
                      label: item.name,
                      value: item.id,
                    });
                  }
                }
              });
              res.result.deviceProcess.forEach((item, index) => {
                const deviceId = item.deviceId;
                const dataOptions = [
                  this.deviceProcess.dataA,
                  this.deviceProcess.dataB,
                  this.deviceProcess.dataC,
                ];

                dataOptions.forEach((data) => {
                  data.options.forEach((param) => {
                    if (deviceId === param.value) {
                      data.checked.push(deviceId);
                    }
                  });
                  if (data.options.length == data.checked.length) {
                    data.checkAll = true;
                  }
                });
              });
            } else {
              this.$message.warning(resB.message);
            }
          });
        }
      });
      this.visible = true;
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
    handleButtonClick(e) {
      console.log("click left button", e);
    },
    handleMenuClick(e) {
      console.log("click", e);
    },
    manualButton() {
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
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
      let paramter = {
        processName: this.selectDischargeSatage,
        workshopName: this.selectWorkshopRange,
      };
      this.getWorkShopList(paramter);
      //   this.loadData();
    },
  },
};
</script>
<style lang="less">
.ant-select-selection__choice {
  background: none !important;
  border: none !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px !important;
  color: #ffffff !important;
  line-height: 40px !important;
  height: 40px !important;
  margin: 0 !important;
}
// .ant-select-selection__choice__remove {
//   display: none !important;
// }
.ant-checkbox-wrapper {
  color: #ffffff !important;
}

.ant-checkbox-checked .ant-checkbox-inner:after {
  border: 2px solid rgba(31, 255, 242, 1) !important;
  border-top: 0 !important;
  border-left: 0 !important;
}

.ant-checkbox-inner {
  background: #0a6e70 !important;
  border-radius: 3px 3px 3px 3px !important;
  border: 1px solid #1ffff2 !important;
}

.ant-form-item-control {
  display: flex;
  flex-direction: column;
  .ant-form-item-children {
    display: flex;
    flex-direction: row;
    color: #ffffff !important;
    .ant-checkbox-group {
      display: flex;
      flex-direction: column;
    }
  }
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
.ant-drawer-content {
  background-color: #0b4144 !important;
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
  display: flex;
  width: 100%;
  height: 100%;
}

.left {
  min-width: 331px;
  flex: 1;
  background: #053c43;
  border-radius: 0px 0px 0px 0px;
  padding: 24px;
  margin-right: 24px;
  .title {
    width: 120px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    margin-bottom: 22px;
  }
}

.right {
  background: #013038;
}

.table-page-search-wrapper {
  position: relative;
}
</style>
