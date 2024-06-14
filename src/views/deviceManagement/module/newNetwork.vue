<template>
  <div class=" bgs tables ">
    <a-drawer     :maskClosable="false" title="编辑" :width="900" :visible="visible" @close="onClose">
      <a-form-model
        class="tables"
        style="background-color: #0b4144"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :required="true" label="设备名称:">
          <a-input v-model="form.deviceName" placeholder="请输入名称" />
        </a-form-model-item>
        <a-form-model-item :required="true" label="设备编号:">
          <a-input v-model="form.deviceNumber" placeholder="请输入编号" />
        </a-form-model-item>
        <a-form-model-item :required="true" label="协议类型:">
          <j-dict-select-tag
            v-model="form.protocol"
            placeholder="请选择协议类型"
            dictCode="device_protocol"
          />
        </a-form-model-item>
        <a-form-model-item :required="true" label="品牌型号:">
          <a-select
            allowClear
            show-search
            optionFilterProp="children"
            @change="brandChange"
            v-model="form.brandModelId"
            placeholder="品牌"
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
            v-model="form.location"
            placeholder="请选择位置"
            :tree-data="monitoringRange"
            tree-default-expand-all
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          v-show="energyTypeVisible"
          :required="true"
          label="能源类型 (折标煤):"
        >
          <a-select v-model="form.selectStandardId" placeholder="折标煤">
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
          v-show="energyTypeVisible"
          :required="true"
          label="能源类型 (碳排放):"
        >
          <a-select v-model="form.selectCarbonId" placeholder="碳排放">
            <a-select-option
              v-for="(item, index) in carbonType"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="是否替换设备:">
          <a-radio-group v-model="form.replacement" @change="radioChange">
            <a-radio :value="1"> 是 </a-radio>
            <a-radio :value="2"> 否 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="form.replacement"
          :required="true"
          label="新设备表底值:"
        >
          <a-input v-model="form.newBottomValue" placeholder="请输入表底值" />
        </a-form-model-item>
        <a-form-model-item
          v-if="form.replacement == 1"
          :required="true"
          label="旧设备:"
        >
          <a-select
            v-model="form.selectOldEquipmentId"
            placeholder="碳排放"
            @change="equipmentChange"
          >
            <a-select-option
              v-for="(item, index) in oldEquipment"
              :key="index"
              :value="item.oldDeviceId"
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
          <a-input v-model="form.oldBottomValue" placeholder="请输入表底值" />
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
          @click="onClose"
        >
          取消
        </a-button>
        <a-button type="primary" @click="saveEquipment">
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

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="4" :md="8" :sm="20">
            <div style="display: flex; ">
              <div @click.prevent="BackButton" style="width: 30px;">
              <img src="../../../assets/Frame 265@2x.png" alt="" />
            </div>
            <div class="title"> 新入网设备</div>
            </div>
           
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="设备编号:">
              <a-select
                style="width: 100%"
                placeholder="请选择内容"
                v-model="selectDeviceNumber"
                optionFilterProp="children"
                showSearch
                allowClear
              >
                <a-select-option
                  v-for="category in deviceNumber"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="入网时间">
              <div class="times">
                <a-range-picker v-model="accessTime" @change="TimeChange">
                  <img src="@assets/hotai/rili.png" slot="suffixIcon" alt="" />
                </a-range-picker>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col :xl="4" :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" :loading="searchBtn" @click="searchQuery" icon="search"
                >查询</a-button
              >
              <a-button
                class="buttton2"
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
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
        :columns="Newcolumns"
        :data-source="data"
        :scroll="{ y: 580 }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a-dropdown>
            <a class="ant-dropdown-link" @click="editEquipment(record)">
              编辑
            </a>
          </a-dropdown>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  queryNewEquipment,
  queryEnergyList,
  queryMetacarboniteList,
} from "@/api/carbonEmission";
import { cyBizBrandModellist, getByType } from "@/api/tanpai";
import { addEquipment, queryEquipmentList } from "@/api/Equipment";
const Newcolumns = [
  {
    title: "设备编号",
    dataIndex: "deviceId",
    align: "center",
  },

  {
    title: "设备状态",
    dataIndex: "stateName",
    align: "center",
  },
  {
    title: "入网时间",
    dataIndex: "createTime",
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "connectDate",
    align: "center",
  },

  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  data() {
    return {
      searchBtn:false,
      endTime: undefined,
      startTime: undefined,
      accessTime: undefined, //入网时间
      id: undefined, //主键id
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      modelVisible: false,
      visible: false,
      energyTypeVisible: true, //能源显示
      carbonType: [], //能源类型 (碳排放)
      standardType: [], // 能源类型 (折标煤)
      monitoringRange: [], //设备位置
      oldEquipment: [], //旧设备
      brandList: [], // 品牌型号
      form: {
        protocol: undefined, //协议
        deviceName: undefined, //监控名称
        deviceNumber: undefined, //监控编号
        brandModelId: undefined, //选取品牌id
        measureType: undefined, //计量类型
        measureType_dictText: undefined, //计量类型名字
        location: undefined, //选中设备位置
        selectStandardId: undefined, //折标煤
        selectCarbonId: undefined, //碳排放
        replacement: undefined, //替换设备
        newBottomValue: undefined, //新设备表底值
        oldBottomValue: undefined, //旧设备表底值
        selectOldEquipmentId: undefined, //旧设备
      },
      stateList: {
        "1": "正常",
        "2": "维修",
        "3": "故障",
        "4": "离线",
        "-1": "停用",
      },
      Newcolumns,
      deviceNumber: [],
      selectDeviceNumber: undefined,

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
    this.getNewEquipment();
  },
  methods: {
    searchReset() {
      this.startTime = undefined;
      this.endTime = undefined;
      this.accessTime = undefined;
      this.selectDeviceNumber = undefined;
      this.getNewEquipment();
    },
    searchQuery() {
      let parameter = {
        start: this.startTime,
        end: this.endTime,
        deviceId: this.selectDeviceNumber,
      };
      this.searchBtn=true
      this.getNewEquipment(parameter);
    },
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
      let parameter = {
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
        fromRemoteDevice:true
      };
      addEquipment(parameter).then((res) => {
        if (res.code == 200) {
          this.$message.warning(res.message);
          this.onClose();
          this.getNewEquipment();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    checkFormField(fieldName, message) {
      if (!this.form[fieldName]) {
        this.$message.warning(message);
        return false;
      }
      return true;
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
    editEquipment(record) {
      this.visible = true;
      this.id = record.id;
      this.form.deviceNumber = record.deviceId;
      let params = {
        protocol: record.protocolType,
      };
      // 获取品牌型号
      cyBizBrandModellist(params).then((res) => {
        if (res.code == 200) {
          this.brandList = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
      // 获取折标煤，碳排放
      queryEnergyList().then((res) => {
        if (res.code === 200) {
          this.carbonType = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });

      queryMetacarboniteList().then((res) => {
        if (res.code === 200) {
          this.standardType = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
      queryEquipmentList(params).then((res) => {
        if (res.code == 200) {
          // 旧设备
          this.oldEquipment = res.result.records;
          // 设备
        } else {
          this.$message.warning(res.message);
        }
      });
      this.getMonitoringScope();
      this.visible = true;
    },
    getNewEquipment(params) {
      this.deviceNumber = [];
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      if (params) parameter = Object.assign(parameter, params);
      queryNewEquipment(parameter).then((res) => {
        if (res.code == 200) {
          this.data = res.result.records;
          this.ipagination.total=res.result.total
          res.result.records.forEach((item) => {
            this.deviceNumber.push(item.deviceId);
            if (this.stateList[item.state]) {
              item.stateName = this.stateList[item.state];
            }
          });
        }
        this.searchBtn=false
      });
    },
    BackButton() {
      this.$emit("Toggle", false);
    },
    TimeChange(data, dataStrings) {
      this.startTime = dataStrings[0];
      this.endTime = dataStrings[1];
      // console.log();
      //   this.getRecordsList(this.energyofs,dataStrings[0],dataStrings[1])
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
        start: this.startTime,
        end: this.endTime,
        deviceId: this.selectDeviceNumber,
      };
      this.getNewEquipment(parameter);
      //   this.loadData();
    },
    onClose() {
      this.visible = false;
    },
    radioChange() {
      if (this.form.replacement == 1) this.modelVisible = true;
    },

    modelCancel() {
      this.modelVisible = false;
      this.form.replacement = 2;
    },
    modelOk() {
      this.modelVisible = false;
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
.bg2 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.title{
  width: 100px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff !important;
    margin-bottom: 22px;
    margin-left: 22px;
}
</style>
