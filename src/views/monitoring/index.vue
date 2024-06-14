<template>
  <div class="bg tables">
    <!-- 弹出框 -->
    <a-drawer
      :maskClosable="false"
      :title="drawTitle"
      :bodyStyle="{ height: '1200px' }"
      :width="900"
      :visible="visible"
      @close="onClose"
    >
      <a-form-model
        class="tables"
        style="background-color: #0b4144"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :required="true" label="监控名称:">
          <a-input
          style="height: 41px;"
            :disabled="detailsDisabled"
            v-model="form.monitorName"
            placeholder="请输入内容"
          />
        </a-form-model-item>
        <a-form-model-item :required="true" label="执行时间:">
          <div class="sectionBoxA">
            <div class="sectionBoxA-itemBox">
              <a-select
              :allowClear="true"
                :disabled="detailsDisabled"
                placeholder="请选择类型"
                style="width: 100px;"
                v-model="form.monitorTime.type"
                @change="timeTypeChange"
              >
                <a-select-option :value="1"> 每年 </a-select-option>
                <a-select-option :value="2">每月 </a-select-option>
                <a-select-option :value="3">每日</a-select-option>
              </a-select>
            </div>
            <div class="sectionBoxA-itemBox">
              <a-select
              :allowClear="true"
                :disabled="detailsDisabled"
                v-if="form.monitorTime.type == 1"
                placeholder="请选择"
                style="width: 100px;"
                v-model="form.monitorTime.month"
                @change="selectTime"
              >
                <a-select-option
                  v-for="(month, index) in [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                  ]"
                  :key="index"
                  :value="month"
                >
                  {{ month }}月
                </a-select-option>
              </a-select>
            </div>
            <div class="sectionBoxA-itemBox">
              <a-select
              :allowClear="true"
                :disabled="detailsDisabled"
                placeholder="请选择"
                style="width: 100px;"
                v-model="form.monitorTime.day"
                v-if="form.monitorTime.type !== 3"
              >
                <a-select-option
                  v-for="(day, index) in dayList"
                  :key="index"
                  :value="day"
                  >{{ day }}日</a-select-option
                >
              </a-select>
            </div>
            <div class="sectionBoxA-itemBox">
              <a-time-picker
              :allowClear="true"
                :disabled="detailsDisabled"
                valueFormat="HH:mm"
                format="HH:mm"
                v-model="form.monitorTime.time"
              />
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item :required="true" label="监控范围:">
          <a-tree-select
            :disabled="detailsDisabled"
            placeholder="请选择监控范围"
            v-model="form.selectMonitoring"
            :tree-data="form.monitoringRange"
            tree-default-expand-all
            multiple
            @change="rangeChange"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item :required="true" label="监控类型:">
          <a-form-model-item :required="true">
            <div class="sectionBoxC">
              <div class="sectionBoxC-itemBox">
                <a-select
                :allowClear="true"
                  :disabled="detailsDisabled"
                  v-model="form.selectMonitoringType"
                  placeholder="请选择监控类型"
                  style="width: 150px;"
                  @change="typeChange"
                >
                  <a-select-option
                    v-for="item in form.monitoringType"
                    :key="item.type"
                    :value="item.type"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="sectionBoxC-itemBox">
                <div class="tiShiColor">单位：{{ form.unit }}</div>
              </div>
            </div>
          </a-form-model-item>
        </a-form-model-item>
        <a-form-model-item :required="true" label="能源类型:">
          <!-- <a-checkbox-group
            :disabled="detailsDisabled"
            v-model="form.energyType"
            :options="energyOptions"
            @change="energyChange"
          /> -->
          <el-checkbox-group    :disabled="detailsDisabled" v-model="form.energyType" @change="energyChange">
            <el-checkbox
              v-for="energy in energyOptions"
              :label="energy"
              :key="energy"
              >{{ energy }}</el-checkbox
            >
          </el-checkbox-group>
        </a-form-model-item>
        <a-form-model-item :required="true" label="监控设备:">
          <a-checkbox
            v-show="!detailsDisabled"
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-checkbox-group
            :disabled="detailsDisabled"
            v-model="checkedMonitoringList"
            :options="monitoringEquipment"
            @change="onChange"
          />
        </a-form-model-item>

        <a-form-model-item :required="true" label="监控时间期:">
          <a-select
          :allowClear="true"
            :disabled="detailsDisabled"
            v-model="form.monitoringPeriod"
            placeholder="请选择时间期"
            style="width: 150px;"
          >
            <a-select-option :value="1">当年 </a-select-option>
            <a-select-option :value="2">当月 </a-select-option>
            <a-select-option :value="3">当日</a-select-option>
            <a-select-option :value="4">当时</a-select-option>
          </a-select>
        </a-form-model-item>
        <div>
          <div
            class="sectionBoxD"
            v-for="(item, index) in form.warningList"
            :key="index"
          >
            <div class="sectionBoxD-itemBox">
              <div style="font-size: 14px; color: #fff;">
                <span style="color: #1ffff2 !important;">* </span>监控阈值：
              </div>
              <a-input
                :disabled="detailsDisabled"
                placeholder="请输入数值"
                v-model.number="item.monitorThreshold"
                style="width: 150px; height: 41px;"
                type="number"
              ></a-input>
            </div>
            <div class="sectionBoxE-itemBox">
              <div style="font-size: 14px; color: #fff;">
                <span style="color: #1ffff2 !important;">* </span>监控等级：
              </div>
              <a-select
              :allowClear="true"
                :disabled="detailsDisabled"
                v-model="item.warningLevel"
                placeholder="请输入数值"
                style="width: 150px;"
              >
                <a-select-option
                  v-for="(item, index) in form.monitoringLevel"
                  :key="index"
                  :value="item.type"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <a-button
              type="primary"
              :disabled="detailsDisabled"
              @click="addThresholdlevel"
              icon="plus"
            />
            <span>&nbsp;</span>
            <a-button
              type="primary"
              :disabled="detailsDisabled"
              @click="deleteThresholdlevel"
              icon="minus"
            />
          </div>
        </div>
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
          @click="onClose"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          v-show="!detailsDisabled"
          :loading="loginBtn"
          @click="saveMonitor"
        >
          保存
        </a-button>
      </div>
    </a-drawer>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper bgs">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控名称：">
              <a-select
                allowClear
                placeholder="请选择内容"
                style="width: 100%"
                v-model="selectMonitoringName"
              >
                <a-select-option
                  v-for="(item, index) in monitorSelectName"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控类型：">
              <a-select
                allowClear
                placeholder="请选择内容"
                style="width: 100%"
                v-model="selectMonitoringType"
              >
                <a-select-option
                  v-for="(item, index) in form.monitoringType"
                  :key="index"
                  :value="item.type"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控状态：">
              <a-select
                allowClear
                placeholder="请选择内容"
                style="width: 100%"
                v-model="selectMonitoringStatus"
              >
                <a-select-option
                  v-for="(item, index) in MonitoringStatus"
                  :key="index"
                  :value="item.status"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控范围：">
              <a-tree-select
                v-model="selectMonitoringRange"
                placeholder="请选择范围"
                multiple
                :tree-data="form.monitoringRange"
                tree-default-expand-all
           
              >
             
              </a-tree-select>
            </a-form-model-item>
          </a-col>

          <a-col :xl="4" :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                type="primary"
                @click="searchButton"
                icon="search"
                :loading="queryBtn"
                >查询</a-button
              >
              <a-button
                class="buttton2"
                type="primary"
                @click="Resetbutton"
                icon="reload"
                style="margin-left: 8px"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
      <div class="poasr">
        <a-button type="primary" @click="addDevice"> 新建监控 </a-button>
      </div>
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
          <span v-if="record.startStateName == '停用'">
            <a class="ant-dropdown-link" @click="changeStatus(record)">
              启动
            </a>
          </span>
          <span v-else>
            <a class="ant-dropdown-link" @click="changeStatus(record)">
              停用
            </a>
          </span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>
            <a-dropdown>
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                更多
              </a>
              <a-menu slot="overlay" class="popbox">
                <a-menu-item>
                  <a href="javascript:;" @click="detailsMonitor(record)"
                    >详情</a
                  >
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="editMonitor(record)">编辑</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="确定删除吗?"
                    @confirm="() => deleteMonitor(record)"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  queryMonitoringList,
  queyrMapDeviceList,
  addMonitoring,
  deleteMonitoring,
  queryMonitoringById,
  updateStatus,
  editMonitoring,
} from "@/api/monitoring";
import { queryEquipmentList } from "@/api/Equipment";
import { getByType, cyMapTagqueryById } from "@/api/tanpai";
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";

export default {
  components: { tree, eacharts },
  data() {
    return {
      queryBtn: false,
      loginBtn: false,
      stateName: undefined,
      detailsDisabled: false, //详请
      dayList: [],
      MonitoringStatus: [
        {
          status: 1,
          name: "启动",
        },
        {
          status: 0,
          name: "停用",
        },
      ], //监控状态
      monitorSelectName:[],
      selectMonitoringName: undefined, //选中监控名称
      selectMonitoringType: undefined, //选中监控类型
      selectMonitoringStatus: undefined, //选中监控状态
      selectMonitoringRange: [], //选中监控范围
      monitorMapScope: undefined,
      // 弹出框配置
      drawTitle: "新建监控",
      indeterminate: true,
      checkAll: false,
      MonitoringOptions: ["电", "水", "天然气"],
      energyOptions: [],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      monitoringEquipment: [], //监控设备
      monitoringEquipmentName: [],

      checkedMonitoringList: [],

      form: {
        editId: undefined, //主键id
        monitorName: undefined, //监控名称
        monitorTime: {
          cycle: undefined,
          day: undefined,
          month: undefined,
          time: undefined,
          type: undefined,
        },
        monitoringRange: [], //监控范围
        selectMonitoring: undefined, //选中车间
        monitoringType: [
          {
            type: 1,
            name: "碳排放",
            unit: "tCO₂",
          },
          {
            type: 2,
            name: "标准煤",
            unit: "t",
          },
          {
            type: 3,
            name: "电",
            unit: "KWh",
          },
          {
            type: 4,
            name: "水",
            unit: "t",
          },
          {
            type: 5,
            name: "天然气",
            unit: "M³",
          },
        ], //监控类型
        selectMonitoringType: undefined, //选中类型
        energyType: [], //能源类型
        selectEnergyType: [], //选中能源类型
        monitoringPeriod: undefined, //监控时间期
        monitoringLevel: [
          {
            type: 1,
            name: "警告",
          },
          {
            type: 2,
            name: "严重",
          },
        ], //监控等级
        unit: "", //单位
        warningList: [],
      },
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
      timeCycleMap: {
        "1": "当年",
        "2": "当月",
        "3": "当日",
        "4": "当时",
      },
      columns: [
        {
          title: "监控名称",
          dataIndex: "monitorName",
          align: "center",
        },
        {
          title: "监控范围",
          dataIndex: "monitorScopeDesc",
          align: "center",
        },
        {
          title: "监控类型",
          dataIndex: "monitorType",
          align: "center",
        },
        {
          title: "监控状态",
          dataIndex: "startStateName",
          align: "center",
        },
        {
          title: "监控时间期",
          dataIndex: "timeCycle",
          align: "center",
        },
        {
          title: "监控阈值",
          dataIndex: "warningList",
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          title: "操作",

          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      khfzrChange: undefined,
      data: [],
    };
  },
  created() {
    this.getMonitoringList();
    this.getMonitoringScope();
  },
  methods: {
    treechange(selectedKeys, info){
      console.log(this.form.monitoringRange,'ski1');
      console.log(selectedKeys, info,'2000');
      console.log(info.selectedNodes[0].parentNode.title,'2000');
    },
    timeTypeChange() {
      // 执行时间改变
      console.log(this.form.monitorTime.type, "type");
      if (this.form.monitorTime.type == 2) {
        this.dayList = Array.from({ length: 31 }, (_, index) =>
          String(index + 1)
        );
      }
    },
    // 更改状态
    changeStatus(record) {
      let parameter = {
        id: record.id,
        status: true,
      };
      if (record.startStateName == "启动") {
        parameter.status = false;
      } else {
        parameter.status = true;
      }
      updateStatus(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning(res.message);
          this.getMonitoringList();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    selectTime(value) {
      console.log(value, "month");
      // 选择月份对应的日期,value月份
      if (value == 2) {
        this.dayList = Array.from({ length: 28 }, (_, index) =>
          String(index + 1)
        );
      } else {
        this.dayList = Array.from({ length: 31 }, (_, index) =>
          String(index + 1)
        );
      }
    },
    // 查询
    searchButton() {
      let parameter = {
        monitorMapScope: this.selectMonitoringRange.toString(),
        monitorName: this.selectMonitoringName,
        monitorState: this.selectMonitoringStatus,
        monitorType: this.selectMonitoringType,
      };
      this.queryBtn=true
      this.getMonitoringList(parameter);
    },
    // 重置
    Resetbutton() {
      this.selectMonitoringName = undefined; //选中监控名称
      this.selectMonitoringType = undefined; //选中监控类型
      this.selectMonitoringStatus = undefined; //选中监控状态
      this.selectMonitoringRange = []; //选中监控范围
      this.getMonitoringList();
    },
    // 详情
    detailsMonitor(record) {
      let parameter = {
        id: record.id,
      };
      queryMonitoringById(parameter).then((res) => {
        if (res.code == 200) {
          this.getMonitoringScope();
          this.drawTitle = "详情";
          this.visible = true;
          this.detailsDisabled = true;
          // this.form.unit=this.form.monitoringType
          this.form.monitorName = res.result.monitorName;
          this.form.selectMonitoring = res.result.monitorMapScope.split(",");
          this.form.selectMonitoringType = res.result.monitorType;
          this.form.energyType = [];
          res.result.energyType.split(",").forEach((item) => {
            if (item === "1") {
              this.form.energyType.push("电");
            } else if (item === "2") {
              this.form.energyType.push("水");
            } else if (item === "2") {
              this.form.energyType.push("天然气");
            }
          });

          this.form.selectEnergyType = res.result.energyType.split(",");
         
          this.checkedMonitoringList = res.result.monitorDevice.split(",");
          this.typeChange(this.form.selectMonitoringType);
          this.rangeChange(this.form.selectMonitoring);
          this.form.monitorTime = res.result.monitorTime;
          this.form.warningList = res.result.warningList;
          this.form.monitoringPeriod = res.result.timeCycle;
        }
      });
    },
    /**
     * 编辑按钮触发事件
     * @param {} record
     */
    editMonitor(record) {
      let parameter = {
        id: record.id,
      };

      queryMonitoringById(parameter).then((res) => {
        if (res.code == 200) {
          this.getMonitoringScope();
          console.log(this.form.monitoringRange, "this.form.mon");
          this.drawTitle = "编辑";
          this.visible = true;
          this.detailsDisabled = false;
          this.form.editId = res.result.id;
          this.form.monitorName = res.result.monitorName;
          this.form.selectMonitoring = res.result.monitorMapScope.split(",");
          this.form.selectMonitoringType = res.result.monitorType;
      
          this.form.energyType = [];
          res.result.energyType.split(",").forEach((item) => {
            if (item === "1") {
              this.form.energyType.push("电");
            } else if (item === "2") {
              this.form.energyType.push("水");
            } else if (item === "2") {
              this.form.energyType.push("天然气");
            }
          });

          this.form.selectEnergyType = res.result.energyType.split(",");
          // console.log(res.result.energyType.split(","), "200");
          // console.log(this.form.energyType, " this.form.energyType ");
          this.typeChange(this.form.selectMonitoringType);
          this.checkedMonitoringList = res.result.monitorDevice.split(",");
          this.rangeChange(this.form.selectMonitoring);

          this.form.monitorTime = res.result.monitorTime;
          this.form.warningList = res.result.warningList;
          this.form.monitoringPeriod = res.result.timeCycle;
          console.log(this.form, "数据");
        }
      });
    },
    // 删除
    deleteMonitor(record) {
      let parameter = {
        id: record.id,
      };
      let parm = {
        monitorMapScope: this.selectMonitoringRange.toString(),
        monitorName: this.selectMonitoringName,
        monitorState: this.selectMonitoringStatus,
        monitorType: this.selectMonitoringType,
      };
      deleteMonitoring(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning(res.message);
          this.getMonitoringList(parm);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    addThresholdlevel() {
      if (this.form.warningList.length < 2) {
        this.form.warningList.push({
          monitorThreshold: undefined,
          warningLevel: undefined,
        });
      }
    },
    deleteThresholdlevel() {
      if (this.form.warningList.length !== 1) this.form.warningList.pop();
    },

    /**
     * 检查表单数据
     */
    checkFormData() {
      console.log(this.form.selectEnergyType, "能源类型");
      if (!this.form.monitorName) {
        this.$message.warning("请输入监控名称");
        return false;
      }
      if (!this.form.monitorTime.type || !this.form.monitorTime.time) {
        this.$message.warning("请选择执行时间");
        return false;
      }
      if (!this.form.selectMonitoring) {
        this.$message.warning("请选择监控范围");
        return false;
      }
      if (!this.form.selectMonitoringType) {
        this.$message.warning("请选择监控类型");
        return false;
      }
      if (this.form.selectEnergyType.length == 0) {
        this.$message.warning("请选择能源类型");
        return false;
      }
      if (this.checkedMonitoringList.length == 0) {
        this.$message.warning("请选择监控设备");
        return false;
      }
      if (!this.form.monitoringPeriod) {
        this.$message.warning("请选择时间期");
        return false;
      }
      if (!this.form.warningList[0].monitorThreshold) {
        this.$message.warning("请输入监控阈值");
        return false;
      }
      if (!this.form.warningList[0].warningLevel) {
        this.$message.warning("请选择监控等级");
        return false;
      }
      return true;
    },
    // 新建监控
    saveMonitor() {
      if (this.checkFormData()) {
        let parameter = {
          energyType: this.form.selectEnergyType.toString(),
          monitorDevice: this.checkedMonitoringList.toString(),
          monitorMapScope: this.form.selectMonitoring.toString(),
          monitorName: this.form.monitorName,
          monitorTime: this.form.monitorTime,
          monitorType: this.form.selectMonitoringType,
          timeCycle: this.form.monitoringPeriod,
          warningList: this.form.warningList,
          id: this.form.editId,
        };
        this.loginBtn = true;
        if (this.drawTitle == "新建监控") {
          addMonitoring(parameter).then((res) => {
            if (res.code == 200) {
              this.$message.warning(res.message);
              this.onClose();
              this.loginBtn = false;
              // 重新获取数据
              this.getMonitoringList();
            } else {
              this.loginBtn = false;
              this.$message.warning(res.message);
            }
          });
        } else if (this.drawTitle == "编辑") {
          editMonitoring(parameter).then((res) => {
            if (res.code == 200) {
              this.$message.warning(res.message);
              this.onClose();
              this.loginBtn = false;
              // 重新获取数据
              this.getMonitoringList();
            } else {
              this.loginBtn = false;
              this.$message.warning(res.message);
            }
          });
        }
      }
    },

    rangeChange(value) {
      this.form.selectMonitoring = value;
      this.monitoringEquipment = [];
      this.monitoringEquipmentName = [];
      // 通过车间id获取设备信息
      queyrMapDeviceList(value).then((res) => {
        if (res.code == 200) {
          console.log(res, "设备");

          res.result.forEach((item) => {
            if (!this.monitoringEquipmentName.includes(item.name)) {
              this.monitoringEquipmentName.push({
                label: item.name,
                value: item.id,
                energyType: item.measureType,
              });
            }
            if (this.form.selectEnergyType.length > 0) {
              this.monitoringEquipment = this.monitoringEquipmentName.filter(
                (item) =>
                  this.form.selectEnergyType.includes(String(item.energyType))
              );
            } else {
              this.monitoringEquipment = this.monitoringEquipmentName;
            }
          });
          
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 能源类变化
    energyChange(value) {
      this.form.selectEnergyType = [];
      this.monitoringEquipment = this.monitoringEquipmentName;
      this.form.energyType.forEach((item) => {
        if (item === "电") {
          this.form.selectEnergyType.push("1");
        } else if (item === "水") {
          this.form.selectEnergyType.push("2");
        } else if (item === "天然气") {
          this.form.selectEnergyType.push("3");
        }

        this.monitoringEquipment = this.monitoringEquipmentName.filter((item) =>
          this.form.selectEnergyType.includes(String(item.energyType))
        );
      });
      // 获取设备信息
    },

    /**
     * 类型变化函数
     * @param {String} value xxxx
     */
    typeChange(value) {
      this.form.selectEnergyType = [];
      this.form.energyType=[];
      this.rangeChange(this.form.selectMonitoring);
      // 能源类型变化
      const energyMap = {
        1: ["电",  "天然气"],
        2: ["电", "天然气"],
        3: ["电"],
        4: ["水"],
        5: ["天然气"],
      };
      this.energyOptions = energyMap[value];

      const selectedType = this.form.monitoringType.find(
        (item) => item.type === value
      );
      if (selectedType) {
        this.form.unit = selectedType.unit;
      }
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.monitoringEquipment.length;
      this.checkAll = checkedList.length === this.monitoringEquipment.length;
    },
    onCheckAllChange(e) {
      let keyData = [];
      this.monitoringEquipment.forEach((item) => {
        keyData.push(item.value);
      });
      Object.assign(this, {
        checkedMonitoringList: e.target.checked ? keyData : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
    // 获取监控范围数据
    getMonitoringScope() {
      let parameter = {
        type: 1,
      };
      getByType(parameter).then((res) => {
        if (res.code == 200) {
          this.form.monitoringRange = this.convertData(res.result);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 新建监控
    addDevice() {
      // 先清空数据
      this.monitoringEquipmentName = [];
      this.monitoringEquipment = [];
      this.energyOptions = [];
      this.form = {
        editId: undefined, //主键id
        monitorName: undefined, //监控名称
        monitorTime: {
          cycle: undefined,
          day: undefined,
          month: undefined,
          time: undefined,
          type: 1,
        },
        monitoringRange: [], //监控范围
        selectMonitoring: undefined, //选中车间
        monitoringType: [
          {
            type: 1,
            name: "碳排放",
            unit: "tCO₂",
          },
          {
            type: 2,
            name: "标准煤",
            unit: "t",
          },
          {
            type: 3,
            name: "电",
            unit: "KWh",
          },
          {
            type: 4,
            name: "水",
            unit: "t",
          },
          {
            type: 5,
            name: "天然气",
            unit: "M³",
          },
        ], //监控类型
        selectMonitoringType: undefined, //选中类型
        energyType: [], //能源类型
        selectEnergyType: [], //选中能源类型
        monitoringPeriod: undefined, //监控时间期
        monitoringLevel: [
          {
            type: 1,
            name: "警告",
          },
          {
            type: 2,
            name: "严重",
          },
        ], //监控等级
        unit: "", //单位
        warningList: [
          {
            monitorThreshold: undefined,
            warningLevel: undefined,
          },
        ],
      };
      this.drawTitle = "新建监控";
      this.detailsDisabled = false;
      this.getMonitoringScope();
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
    onClose() {
      this.visible = false;
    },
    // 获取数据
    getMonitoringList(params) {
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      if (params) {
        parameter = Object.assign(parameter, params);
      }

      const warningLevel = {
        1: "警告",
        2: "严重",
        3: "正常",
      };
      const Type = {
        1: "碳排放",
        2: "标准煤",
        3: "电",
        4: "水",
        5: "天然气",
      };
      const Unit = {
        1: "tCO₂",
        2: "t",
        3: "KWh",
        4: "t",
        5: "M³",
      };
      queryMonitoringList(parameter).then((res) => {
        if (res.code == 200) {
          this.monitorSelectName=[]
          this.ipagination.total = res.result.total;
          this.data = res.result.records;
          
          this.data.forEach((item) => {
            item.monitorScopeDesc = item.monitorScopeDesc || "-";
            item.monitorName = item.monitorName || "-";
            this.monitorSelectName.push(item.monitorName)
            if (this.timeCycleMap[item.timeCycle]) {
              item.timeCycle = this.timeCycleMap[item.timeCycle];
            }
            item.timeCycle = item.timeCycle || "-";

            if (!item.startState) {
              item.startStateName = "停用";
            } else {
              item.startStateName = "启动";
            }
            this.ipagination.total = res.result.total;
            item.unit = Unit[item.monitorType];
            item.monitorType = Type[item.monitorType];
            let warningList = item.warningList.map((item) => {
              return `${warningLevel[item.warningLevel]}: ${
                item.monitorThreshold
              }`;
            });
            if (Array.isArray(warningList)) {
              item.warningList = warningList.join(",");
            } else {
              item.warningList = warningList;
            }
          });
          this.monitorSelectName=this.monitorSelectName.filter((item,index)=> this.monitorSelectName.indexOf(item)==index);
          // // 通过车间id查详情
          // let parameter = {
          //   ids: item.monitorMapScope,
          // };
          // console.log(item,'ids');
          // queyrMapDeviceList(parameter).then((res) => {
          //   if (res.code == 200) {
          //     item.range = res.result.sysOrgCode;
          //   } else {
          //     this.$message.warning(res.message);
          //   }
          // });
       
        
        } else {
          this.$message.warning(res.message);
        }
        this.queryBtn=false
      });
    
    },
    searchQuery() {},
    searchReset() {},
    handleChange(value) {
      console.log(`selected ${value}`);
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
      let parameter = {
        monitorMapScope: this.selectMonitoringRange.toString(),
        monitorName: this.selectMonitoringName,
        monitorState: this.selectMonitoringStatus,
        monitorType: this.selectMonitoringType,
      };
      this.getMonitoringList(parameter);
    },
  },
};
</script>
<style lang="less">
.el-checkbox__input.is-checked .el-checkbox__inner {
  background: rgba(31, 255, 242, 0.3);
}
.el-checkbox__inner {
  background: #0a6e70 !important;
    border-radius: 3px 3px 3px 3px !important;
    border: 1px solid #1ffff2 !important;
}
.el-checkbox__label {
  color: #fff !important;
}
.ant-checkbox-inner {
  background: #0a6e70 !important;
  border-radius: 3px 3px 3px 3px !important;
  border: 1px solid #1ffff2 !important;
}
.ant-input {
  background: rgba(31, 255, 242, 0.3) !important;
  border-radius: 3px 3px 3px 3px !important;
  border: 1px solid #1ffff2 !important;
  height: 35px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff !important;
}
.ant-time-picker-input {
  background: rgba(31, 255, 242, 0.3) !important;
  border-radius: 3px 3px 3px 3px !important;
  border: 1px solid #1ffff2 !important;
  font-size: 16px !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400 !important;
  font-size: 14px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  margin: 0 !important;
  height: 40px !important;
  width: 136px !important;
}
.ant-time-picker-panel-narrow .ant-time-picker-panel-input-wrap {
  min-width: 140px !important;
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
  width: 100%;
  height: 100%;
}
.poasr {
  position: absolute;
  right: 0;
  bottom: 25px;
}

.table-page-search-wrapper {
  position: relative;
}
.sectionBoxA {
  display: flex;
  align-items: center;
}
.sectionBoxA-itemBox {
  // background: red;
  // padding: 5px;
  width: 120px;
  min-height: 10px;
  // margin-right: 10rpx;
  // flex: 1;
}
.sectionBoxC {
  display: flex;
  align-items: center;
}
.sectionBoxC-itemBox {
  width: 170px;
  min-height: 10px;
}
.sectionBoxD {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
.sectionBoxD-itemBox {
  line-height: 35px;
  margin-left: 63px;
  display: flex;
  width: 240px;
  min-height: 10px;
}
.sectionBoxE-itemBox {
  margin-left: 25px;
  line-height: 35px;
  display: flex;
  width: 240px;
  min-height: 10px;
}
</style>
