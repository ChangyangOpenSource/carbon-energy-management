<template>
  <div class="secenter">
    <div class="bg tables" v-if="!sw">
      <a-drawer
        :title="drawTitle"
        :width="900"
        :visible="visible"
        @close="deviceClose"
        :maskClosable="false"
      >
        <a-form-model
          class="tables"
          style="background-color: #0b4144"
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item :required="true" label="设备名称:">
            <a-input
              :disabled="disabled"
              v-model="form.deviceName"
              placeholder="请输入名称"
            />
          </a-form-model-item>
          <a-form-model-item :required="true" label="设备编号:">
            <a-input
              :disabled="disabled"
              v-model="form.deviceNumber"
              placeholder="请输入编号"
            />
          </a-form-model-item>
          <a-form-model-item :required="true" label="品牌型号:">
            <a-select
              :allowClear="true"
              show-search
              optionFilterProp="children"
              :disabled="disabled"
              @change="brandChange"
              v-model="form.brandModelId"
              placeholder="请选择品牌"
            >
              <a-select-option
                v-for="(item, index) in brandList"
                :key="index"
                :value="item.id"
              >
                {{ item.brand }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :required="true" label="计量类型:">
            <a-input
              v-model="form.measureType_dictText"
              disabled
              placeholder="请输入内容"
            >
            </a-input>
          </a-form-model-item>
          <a-form-model-item :required="true" label="设备位置:">
            <a-tree-select
              :allowClear="true"
              :disabled="disabled"
              v-model="form.location"
              placeholder="请选择位置"
              :tree-data="monitoringRange"
              tree-default-expand-all
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="energyTypeVisible"
            :required="true"
            label="能源类型 (折标煤):"
          >
            <a-select
              :allowClear="true"
              :disabled="disabled"
              v-model="form.selectStandardId"
              placeholder="请选择"
            >
              <a-select-option
                v-for="(item, index) in standardType"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="energyTypeVisible"
            :required="true"
            label="能源类型 (碳排放):"
          >
            <a-select
              :allowClear="true"
              :disabled="disabled"
              v-model="form.selectCarbonId"
              placeholder="请选择"
            >
              <a-select-option
                v-for="(item, index) in carbonType"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :required="true" label="是否重点耗能设备:">
            <a-radio-group :disabled="disabled" v-model="form.keyDevice">
              <a-radio :value="true"> 是 </a-radio>
              <a-radio :value="false"> 否 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item :required="true" label="是否替换设备:">
            <a-radio-group
              :disabled="Replacedisabled"
              v-model="form.replacement"
              @change="radioChangeMotor"
            >
              <a-radio :value="1" id="replace-yes"> 是 </a-radio>
              <a-radio :value="2" id="replace-no"> 否 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.replacement"
            :required="true"
            label="新设备表底值:"
          >
            <a-input
              @blur="valueInputNew"
              :disabled="Replacedisabled"
              v-model="form.newBottomValue"
              placeholder="请输入表底值"
            />
          </a-form-model-item>
          <a-form-model-item
            v-if="form.replacement == 1"
            :required="true"
            label="旧设备:"
          >
            <a-select
              :allowClear="true"
              show-search
              optionFilterProp="children"
              :disabled="Replacedisabled"
              v-model="form.selectOldEquipmentId"
              placeholder="请选择"
              @change="equipmentChange"
            >
              <a-select-option
                v-for="(item, index) in oldEquipment"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.replacement == 1"
            :required="true"
            label="旧设备表底值:"
          >
            <a-input
              @blur="valueInputOld"
              :disabled="Replacedisabled"
              v-model="form.oldBottomValue"
              placeholder="请输入表底值"
            />
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
            @click="deviceClose"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            v-if="this.drawTitle !== '详情'"
            @click="saveEquipment"
            :loading="saveBtn"
          >
            保存
          </a-button>
        </div>
      </a-drawer>
      <a-modal
        v-model="modelVisible"
        title="提示"
        @ok="modelOk"
        @cancel="modelCancel"
      >
        <p style="color: #fff !important;">旧设备将被停用,是否继续</p>
      </a-modal>

      <div class="right">
        <div class="title">设备管理</div>
        <div class="main-box tables bgs">
          <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchEquipmentQuery">
              <a-row :gutter="24">
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="设备名称：">
                    <a-select
                      :allowClear="true"
                      show-search
                      optionFilterProp="children"
                      placeholder="请输入搜索"
                      v-model="selectDeviceName"
                    >
                      <a-select-option
                        v-for="(category, index) in DeviceSelectName"
                        :value="category"
                        :key="index"
                      >
                        {{ category }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="设备位置：">
                    <a-tree-select
                      :allowClear="true"
                      multiple
                      v-model="selectMonitoringRange"
                      placeholder="请选择范围"
                      :tree-data="monitoringRange"
                      tree-default-expand-all
                    >
                    </a-tree-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="计量类型：">
                    <a-select
                      :allowClear="true"
                      placeholder="请选择"
                      style="width: 100%"
                      v-model="selectMeasureType"
                    >
                      <a-select-option
                        v-for="(item, index) in monitoringType"
                        :key="index"
                        :value="item.type"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="设备类型:">
                    <a-select
                      :allowClear="true"
                      placeholder="请选择"
                      style="width: 100%"
                      v-model="selectDeviceType"
                      @change="deviceTypeChange"
                    >
                      <a-select-option
                        v-for="(item, index) in deviceType"
                        :key="index"
                        :value="item.type"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="设备状态：">
                    <a-select
                      @change="handleGroup1Change"
                      :allowClear="true"
                      show-search
                      optionFilterProp="children"
                      placeholder="请选择"
                      style="width: 100%"
                      v-model="selectedGroup1"
                      v-if="showGroup1"
                    >
                      <a-select-opt-group label="智能" v-if="showGroup1">
                        <a-select-option
                          v-for="(item, index) in deviceStatus"
                          :key="index"
                          :value="item.state"
                        >
                          {{ item.name }}
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>

                    <a-select
                      v-model="selectedGroup2"
                      :allowClear="true"
                      show-search
                      optionFilterProp="children"
                      placeholder="请选择"
                      style="width: 100%"
                      v-if="showGroup2"
                      @change="handleGroup2Change"
                    >
                      <a-select-opt-group label="机械" v-if="showGroup2">
                        <a-select-option
                          v-for="(item, index) in machineDeviceStatus"
                          :key="index"
                          :value="item.state"
                        >
                          {{ item.name }}
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>
                    <!-- <a-select
                       :allowClear="true"
                      show-search
                      optionFilterProp="children"
                      placeholder="请选择"
                      style="width: 100%"
                      v-model="selectDeviceStatus"
                    >
                      <a-select-opt-group label="机械">
                        
                      </a-select-opt-group>
                      <a-select-opt-group label="智能">
                       
                      </a-select-opt-group>
                    </a-select> -->
                  </a-form-model-item>
                </a-col>
                <a-col :xl="6" :md="8" :sm="24">
                  <a-form-model-item label="重点耗能设备：">
                    <a-select
                      :allowClear="true"
                      show-search
                      optionFilterProp="children"
                      placeholder="请选择"
                      style="width: 100%"
                      v-model="selectKeyEquipment"
                    >
                      <a-select-option
                        v-for="(item, index) in keyEquipment"
                        :key="index"
                        :value="item.state"
                      >
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>

                <a-col :xl="4" :md="8" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-button
                      type="primary"
                      @click="searchEquipmentQuery"
                      icon="search"
                      :loading="searchBtn"
                      >查询</a-button
                    >
                    <a-button
                      class="buttton2"
                      type="primary"
                      @click="resetEquipment"
                      icon="reload"
                      style="margin-left: 8px"
                      >重置</a-button
                    >
                  </span>
                </a-col>
              </a-row>
            </a-form>
            <div class="poasr">
              <a-button type="primary" @click="devicesButto">
                新入网设备
              </a-button>
              <a-button type="primary" @click="addDevice"> 添加设备 </a-button>
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
                <span v-if="record.deviceType !== '1'">
                  <a-dropdown>
                    <a
                      class="ant-dropdown-link"
                      @click="(e) => e.preventDefault()"
                    >
                      更改状态
                    </a>
                    <a-menu slot="overlay" class="popbox">
                      <a-menu-item v-show="record.state !== '1'">
                        <a href="javascript:;" @click="changeState(record, '1')"
                          >正常</a
                        >
                      </a-menu-item>
                      <a-menu-item v-show="record.state !== '3'">
                        <a href="javascript:;" @click="changeState(record, '3')"
                          >故障</a
                        >
                      </a-menu-item>
                      <a-menu-item v-show="record.state !== '2'">
                        <a href="javascript:;" @click="changeState(record, '2')"
                          >维修</a
                        >
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </span>
                <span v-else>————</span>
                <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
                <span>
                  <a-dropdown>
                    <a
                      class="ant-dropdown-link"
                      @click="(e) => e.preventDefault()"
                    >
                      更多
                    </a>
                    <a-menu slot="overlay" class="popbox">
                      <a-menu-item>
                        <a href="javascript:;" @click="detailsButton(record)"
                          >详情</a
                        >
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="editButton(record)"
                          >编辑</a
                        >
                      </a-menu-item>
                      <a-menu-item>
                        <a-popconfirm
                          title="确定删除吗?"
                          @confirm="() => deleteDevice(record)"
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
      </div>
    </div>
    <div v-else>
      <new-network @Toggle="handleCustomEvent"></new-network>
    </div>
  </div>
</template>

<script>
import {
  queryEquipmentList,
  addEquipment,
  deleteEquipment,
  queryByEquipmentId,
  editequipment,
} from "@/api/Equipment";
import {
  queryEnergyList,
  queryEnergyType,
  queryMetacarboniteList,
} from "@/api/carbonEmission";
import { cyBizBrandModellist, getByType } from "@/api/tanpai";
import tree from "@/components/Tree/tree.vue";
import newNetwork from "../deviceManagement/module/newNetwork.vue";
const columns = [
  {
    title: "设备名称",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "设备编号",
    dataIndex: "sn",
    align: "center",
  },
  {
    title: "计量类型",
    dataIndex: "measureType_dictText",
    align: "center",
  },
  {
    title: "设备类型",
    dataIndex: "deviceType_dictText",
    align: "center",
  },
  {
    title: "车间",
    dataIndex: "locationName",
    align: "center",
  },
  {
    title: "设备状态",
    dataIndex: "state_dictText",
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  components: { tree, newNetwork },
  data() {
    return {
      searchBtn:false,
      DeviceSelectName:[],
      saveBtn: false,
      stateDict: {
        "1": "正常",
        "2": "维修",
        "3": "故障",
      },
      monitoringType: [
        {
          type: 1,
          name: "电表",
        },
        {
          type: 2,
          name: "水表",
        },
        {
          type: 3,
          name: "天然气",
        },
      ], //计量类型
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
      keyEquipment: [
        {
          state: true,
          name: "是",
        },
        {
          state: false,
          name: "否",
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
      machineDeviceStatus: [
        {
          state: "1",
          name: "正常",
        },
        {
          state: "2",
          name: "维修",
        },
        {
          state: "3",
          name: "故障",
        },
        {
          state: "4",
          name: "离线",
        },
      ],
      selectKeyEquipment: undefined,
      energyTypeVisible: true, //能源显示
      modelVisible: false,
      disabled: false,
      Replacedisabled: false,
      carbonType: [], //能源类型 (碳排放)
      standardType: [], // 能源类型 (折标煤)
      monitoringRange: [], //设备位置
      selectMonitoringRange: [], //选中车位置
      oldEquipment: [], //旧设备
      brandList: [], // 品牌型号
      drawTitle: "添加设备",
      id: "", //主键id
      // 弹出框的内容
      treeList: {}, //左侧树数据
      mapId: undefined, //地图位置
      form: {
        keyDevice: undefined, //是否是重点耗能设备
        deviceName: undefined, //监控名称
        deviceNumber: undefined, //监控编号
        brandModelId: undefined, //选取品牌id
        measureType: undefined, //计量类型
        measureType_dictText: undefined, //计量类型名字
        location: undefined, //选中设备位置
        selectStandardId: undefined, //折标煤
        selectCarbonId: undefined, //碳排放
        replacement: 0, //替换设备
        newBottomValue: undefined, //新设备表底值
        oldBottomValue: undefined, //旧设备表底值
        selectOldEquipmentId: undefined, //旧设备
      },
      // 页面数据
      data: [],
      selectDeviceName: undefined, //选中设备名称
      selectMeasureType: undefined, //选择计量类型
      selectDeviceType: undefined, //选中设备类型
      selectDeviceStatus: undefined, //选择设备状态
      sw: false,
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
      columns,
      selectedGroup1: undefined,
      selectedGroup2: undefined,
      showGroup2: false,
      showGroup1: true,
    };
  },
  created() {
    this.getInitialData();
  },
  methods: {
    // 选择设备类型，固定设备状态

    deviceTypeChange() {
      if (this.selectDeviceType == 1) {
        this.showGroup1 = true;
        this.showGroup2 = false;
      } else if (this.selectDeviceType == 2) {
        this.showGroup2 = true;
        this.showGroup1 = false;
      }
    },
    handleGroup1Change() {
      if (!this.selectedGroup1) {
        this.showGroup2 = true;
        this.showGroup1 = false;
      } else {
        this.showGroup1 = true;
        this.showGroup2 = false;
        this.selectedGroup2 = undefined;
      }
    },
    handleGroup2Change() {
      if (!this.selectedGroup2) {
        this.showGroup2 = false;
        this.showGroup1 = true;
      } else {
        this.showGroup2 = true;
        this.showGroup1 = false;
        this.selectedGroup1 = undefined;
      }
    },
    valueInputNew() {
      // 确保输入的是小数
      let value = parseFloat(this.form.newBottomValue);
      if (!isNaN(value)) {
        this.form.newBottomValue = value.toFixed(4);
      } else {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
        this.form.newBottomValue = "";
      }
    },
    valueInputOld() {
      // 确保输入的是小数
      let value = parseFloat(this.form.oldBottomValue);
      if (!isNaN(value)) {
        this.form.oldBottomValue = value.toFixed(4);
      } else {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
        this.form.oldBottomValue = "";
      }
    },

    handleCustomEvent(value) {
      this.sw = value;
    },
    modelOk() {
      this.modelVisible = false;
    },

    modelCancel() {
      this.modelVisible = false;
      this.form.replacement = 2;
    },
    radioChangeMotor() {
      if (this.form.replacement == 1) this.modelVisible = true;
      else {
        this.modelVisible = false;
      }
    },
    // 更改状态
    changeState(record, value) {
      console.log(record, value, "record");
      let parameter = {
        id: record.id,
        state: value,
      };
      editequipment(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning(res.message);
          let parameter = {
            name: this.selectDeviceName,
            measureType: this.selectMeasureType,
            deviceType: this.selectDeviceType,
            state: this.selectDeviceStatus,
            location: this.selectMonitoringRange.toString(),
            keyDevice: this.selectKeyEquipment,
          };
          this.getEquipmentList(parameter);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 详情
    detailsButton(item) {
      this.disabled = true;
      this.Replacedisabled = true;
      this.visible = true;
      let parameter = {
        id: item.id,
      };
      queryByEquipmentId(parameter).then((res) => {
        if (res.code == 200) {
          // 获取其他数据
          this.drawTitle = "详情";
          const {
            name,
            sn,
            measureType,
            brandModelId,
            icTypeId,
            carbonEnergyNameId,
            location,
            value,
            oldDeviceId,
            bottomValue,
            keyDevice,
          } = res.result;
          this.form = {
            keyDevice: keyDevice,
            deviceName: name,
            deviceNumber: sn,
            measureType: measureType,
            brandModelId: brandModelId,
            selectStandardId: icTypeId,
            selectCarbonId: carbonEnergyNameId,
            location: location,
            oldBottomValue: value,
            selectOldEquipmentId: oldDeviceId,
            newBottomValue: bottomValue,
          };
          // 有旧设备就替换设备
          if (this.form.selectOldEquipmentId) {
            this.form.replacement = 1;
          } else {
            this.form.replacement = 2;
          }

          this.brandChange(brandModelId);
        }
      });
    },
    // 编辑
    editButton(item) {
      this.saveBtn = false;
      this.disabled = false;
      this.Replacedisabled = true;
      this.visible = true;
      let parameter = {
        id: item.id,
      };

      this.id = item.id;

      queryByEquipmentId(parameter).then((res) => {
        if (res.code == 200) {
          // 获取其他数据

          this.drawTitle = "编辑";
          const {
            keyDevice,
            name,
            sn,
            measureType,
            brandModelId,
            icTypeId,
            carbonEnergyNameId,
            location,
            value,
            oldDeviceId,
            bottomValue,
          } = res.result;
         
          // if (this.id=== sessionStorage.getItem("id")) {
          //   this.form.deviceName = sessionStorage.getItem("deviceName") || name;
          //   this.form.keyDevice =
          //     sessionStorage.getItem("keyDevice") || keyDevice;
          //   this.form.deviceNumber =
          //     sessionStorage.getItem("deviceNumber") || sn;
          //   this.form.measureType =
          //     sessionStorage.getItem("measureType") || measureType;
          //   this.form.brandModelId =
          //     sessionStorage.getItem("brandModelId") || brandModelId;
          //   this.form.selectStandardId =
          //     sessionStorage.getItem("selectStandardId") || icTypeId;
          //   this.form.location = sessionStorage.getItem("location") || location;
          //   this.form.oldBottomValue =
          //     sessionStorage.getItem("oldBottomValue") || value;
          //   this.form.selectOldEquipmentId =
          //     sessionStorage.getItem("selectOldEquipmentId") || oldDeviceId;
          //   this.form.newBottomValue =
          //     sessionStorage.getItem("newBottomValue") || bottomValue;
          // } else {
            this.form = {
              keyDevice: keyDevice,
              deviceName:name,
              deviceNumber: sn,
              measureType: measureType,
              brandModelId: brandModelId,
              selectStandardId: icTypeId,
              selectCarbonId: carbonEnergyNameId,
              location: location,
              oldBottomValue: value,
              selectOldEquipmentId: oldDeviceId,
              newBottomValue: bottomValue,
            };
          // }

          // 有旧设备就替换设备
          if (this.form.selectOldEquipmentId) {
            this.form.replacement = 1;
          } else {
            this.form.replacement = 2;
          }
          // this.radioChangeMotor();
          this.brandChange(brandModelId);
        }
      });
    },
    // 删除
    deleteDevice(item) {
      let parameter = {
        id: item.id,
      };
      let parm = {
        name: this.selectDeviceName,
        measureType: this.selectMeasureType,
        deviceType: this.selectDeviceType,
        state: this.selectDeviceStatus,
        location: this.selectMonitoringRange.toString(),
        keyDevice: this.selectKeyEquipment,
      };
      deleteEquipment(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning(res.message);
          this.getEquipmentList(parm);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 重置
    resetEquipment() {
      this.selectMonitoringRange = [];
      this.selectedGroup1 = undefined;
      this.selectedGroup2 = undefined;
      this.selectDeviceName = undefined;
      this.selectMeasureType = undefined;
      this.selectDeviceType = undefined;
      this.selectDeviceStatus = undefined;
      this.selectKeyEquipment = undefined;
      this.getEquipmentList();
    },
    // 查询
    searchEquipmentQuery() {
      if (this.selectedGroup1) {
        this.selectDeviceType = 1;
        this.selectDeviceStatus = this.selectedGroup1;
      } else if (this.selectedGroup2) {
        this.selectDeviceType = 2;
        this.selectDeviceStatus = this.selectedGroup2;
      }
      let parameter = {
        name: this.selectDeviceName,
        measureType: this.selectMeasureType,
        deviceType: this.selectDeviceType,
        state: this.selectDeviceStatus,
        location: this.selectMonitoringRange.toString(),
        keyDevice: this.selectKeyEquipment,
      };
      this.searchBtn=true
      this.getEquipmentList(parameter)
      
    },
    // 保存
    saveEquipment() {
      if (!this.checkFormField.call(this, "deviceName", "请输入设备名称"))
        return;
      if (!this.checkFormField.call(this, "deviceNumber", "请输入设备编号"))
        return;
      if (!this.checkFormField.call(this, "brandModelId", "请选择品牌")) return;
      if (!this.checkFormField.call(this, "location", "请选择设备位置")) return;
      if (this.form.measureType_dictText !== "水表") {
        if (
          !this.checkFormField.call(
            this,
            "selectStandardId",
            "请输入设请选择能源类型(折标煤)"
          )
        )
          return;
        if (
          !this.checkFormField.call(
            this,
            "selectCarbonId",
            "请选择能源类型(碳排放)"
          )
        )
          return;
      }
      if (typeof this.form.keyDevice == "undefined") {
        this.$message.warning("请选择是否是重点耗能设备");
        return;
      }
      if (
        !this.checkFormField.call(this, "replacement", "请选择是否是替换设备")
      ) {
        return;
      }

      if (this.form.replacement == 1) {
        if (!this.checkFormField.call(this, "newBottomValue", "请输入新表底值"))
          return;
        if (
          !this.checkFormField.call(
            this,
            "selectOldEquipmentId",
            "请选择旧设备"
          )
        )
          return;
        if (!this.checkFormField.call(this, "oldBottomValue", "请输入旧表底值"))
          return;
      } else if (this.form.replacement == 2) {
        if (!this.checkFormField.call(this, "newBottomValue", "请输入新表底值"))
          return;
      }
      this.saveBtn = true;
      let parameter = {
        keyDevice: this.form.keyDevice,
        brandModelId: this.form.brandModelId,
        carbonEnergyNameId: this.form.selectCarbonId,
        icTypeId: this.form.selectStandardId,
        measureType: this.form.measureType,
        name: this.form.deviceName,
        oldDeviceId: this.form.selectOldEquipmentId,
        sn: this.form.deviceNumber,
        value: this.form.oldBottomValue,
        location: this.form.location,
        bottomValue: this.form.newBottomValue,
        id: this.id,
      };

      if (this.drawTitle == "添加设备") {
        addEquipment(parameter).then((res) => {
          if (res.code == 200) {
            this.$message.warning(res.message);
            this.saveBtn = false;
            this.getEquipmentList();
            this.onClose();
          } else {
            this.saveBtn = false;
            this.$message.warning(res.message);
          }
        });
      } else {
        editequipment(parameter).then((res) => {
          if (res.code == 200) {
            this.$message.warning(res.message);
            this.saveBtn = false;
            this.getEquipmentList();
            this.onClose();
          } else {
            this.saveBtn = false;
            this.$message.warning(res.message);
          }
        });
      }
    },
    checkFormField(fieldName, message) {
      if (!this.form[fieldName]) {
        this.$message.warning(message);
        return false;
      }
      return true;
    },
    equipmentChange() {
      const selectEquipment = this.oldEquipment.find(
        (item) => item.id == this.form.selectOldEquipmentId
      );
      if (selectEquipment) {
        this.form.oldBottomValue = selectEquipment.value;
      }
      console.log(selectEquipment, "sel");
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
          this.treeList = res.result;
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
    // 选取品牌型号的事件
    brandChange(value) {
      const selectBrand = this.brandList.find((item) => item.id == value);
      if (selectBrand) {
        this.form.measureType_dictText = selectBrand.measureType_dictText;
        this.form.measureType = selectBrand.measureType;
      }
      if (this.form.measureType_dictText == "水表") {
        this.energyTypeVisible = false;
      } else {
        this.energyTypeVisible = true;
      }
    },
    devicesButto() {
      this.sw = true;
    },

    addDevice() {
      // 开始之前设置form为空
      this.saveBtn = false;
      this.id = "";
      this.form = {
        keyDevice: undefined,
        deviceName: undefined, //监控名称
        deviceNumber: undefined, //监控编号
        brandModelId: undefined, //选取品牌id
        measureType: undefined, //计量类型
        measureType_dictText: undefined, //计量类型名字
        location: undefined, //选中设备位置
        selectStandardId: undefined, //折标煤
        selectCarbonId: undefined, //碳排放
        replacement: 0, //替换设备
        newBottomValue: undefined, //新设备表底值
        oldBottomValue: undefined, //旧设备表底值
        selectOldEquipmentId: undefined, //旧设备
      };
      this.disabled = false;
      this.Replacedisabled = false;
      this.drawTitle = "添加设备";
      this.visible = true;
    },
    // 获取设备
    getEquipmentList(params) {
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        location: this.mapId,
      };

      if (parameter) {
        parameter = Object.assign(parameter, params);
      }
      // console.log(params, "参数");
      queryEquipmentList(parameter).then((res) => {
        if (res.code == 200) {
          this.DeviceSelectName=[]
          res.result.records.forEach((item) => {
            this.DeviceSelectName.push(item.name)
            if (item.deviceType == "2" && this.stateDict[item.state]) {
              item.state_dictText = this.stateDict[item.state];
            }
            this.DeviceSelectName=this.DeviceSelectName.filter((item,index)=> this.DeviceSelectName.indexOf(item)==index);
          });
          // 旧设备
          this.oldEquipment = res.result.records;
          // 设备
          this.data = res.result.records;

          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message);
        }
        this.searchBtn=false
      });
    },
    // 获取初始数据
    getInitialData() {
      // 获取监控范围数据
      this.getMonitoringScope();
      // 获取品牌型号
      cyBizBrandModellist({ pageNo: 1, pageSize: 100, deviceType: "2" }).then(
        (res) => {
          if (res.code === 200) {
            this.brandList = res.result.records;
            // console.log(this.brandList);
          } else {
            this.$message.warning(res.message);
          }
        }
      );
      // 获取折标煤，碳排放
      queryEnergyList({ pageNo: 1, pageSize: 100 }).then((res) => {
        if (res.code === 200) {
          this.carbonType = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });

      queryMetacarboniteList({ pageNo: 1, pageSize: 100 }).then((res) => {
        if (res.code === 200) {
          this.standardType = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
      // 获取设备
      this.getEquipmentList();
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
      if (this.selectedGroup1) {
        this.selectDeviceType = 1;
        this.selectDeviceStatus = this.selectedGroup1;
      } else if (this.selectedGroup2) {
        this.selectDeviceType = 2;
        this.selectDeviceStatus = this.selectedGroup2;
      }
      let parameter = {
        name: this.selectDeviceName,
        measureType: this.selectMeasureType,
        deviceType: this.selectDeviceType,
        state: this.selectDeviceStatus,
        location: this.selectMonitoringRange.toString(),
        keyDevice: this.selectKeyEquipment,
      };
      this.getEquipmentList(parameter);
      //   this.loadData();
    },
    // 取消按钮
    deviceClose() {
      console.log(this.form, "this.form");
      this.visible = false;
      // this.setSessionStorageItems(this.form, {
      //   id: this.id, // 如果 id 不是表单字段的一部分，你可以在这里添加它
      //   // 其他额外的项...
      // });
    },
    onClose() {
      this.visible = false;
    },
    // setSessionStorageItems(form, additionalItems = {}) {
    //   // 合并表单数据和额外的项（如果有的话）
    //   const items = {
    //     ...form,
    //     ...additionalItems,
    //     // 如果需要，你可以在这里添加默认值或进行其他转换
    //   };

    //   // 遍历项并设置 sessionStorage
    //   for (const key in items) {
    //     if (
    //       items.hasOwnProperty(key) &&
    //       items[key] !== null &&
    //       items[key] !== undefined
    //     ) {
    //       sessionStorage.setItem(key, items[key].toString()); // 转换为字符串以存储在 sessionStorage 中
    //     }
    //   }
    // },
  },
};
</script>
<style lang="less">
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
.ant-modal-title {
  color: #ffffff !important;
}
.ant-modal-footer {
  .ant-btn:nth-child(1) {
    color: #fff;

    border-radius: 3px 3px 3px 3px;
    background: #006a77 !important;
    border: 0;
  }
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
.bg2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff !important;
  margin-bottom: 22px;
}

.tiBt {
  width: 288px;
  height: 37px;
  background: #00ada3;
  border-radius: 3px 3px 3px 3px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
  padding: 7px 104px;
}
.right {
  background: #013038;
}

.poasr {
  width: 250px;
  display: flex;
  position: absolute;

  justify-content: space-between;
  right: 0;
  bottom: 25px;
}
.table-page-search-wrapper {
  position: relative;
}
</style>
