<template>
  <div class="bg tables">
    <!-- 抽屉框 -->
    <a-drawer
      :title="drawTitle"
      :width="900"
      :visible="visible"
      @close="EbmClose"
      :maskClosable="false"
    >
      <a-form-model
        class="tables"
        style="background-color: #0b4144"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :required="true" label="设备品牌型号:">
          <a-input v-model="form.brand" placeholder="请输入设备品牌型号" />
        </a-form-model-item>
        <a-form-model-item :required="true" label="设备简称:">
          <a-input v-model="form.abbreviation" placeholder="请输入设备简称" />
        </a-form-model-item>
        <a-form-model-item :required="true" label="计量类型:">
          <!-- <j-dict-select-tag
            allowClear
              v-model="form.measureType"
              placeholder="请选择计量类型"
              dictCode="brand_model_measure_code"
            /> -->
          <a-select
            :allowClear="true"
            placeholder="请选择"
            style="width: 100%"
            v-model="form.measureType"
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
        <a-form-model-item :required="true" label="设备类型:">
          <j-dict-select-tag
            allowClear
            v-model="form.deviceType"
            placeholder="请选择设备类型"
            dictCode="brand_model_device_type"
          />
        </a-form-model-item>

        <a-form-model-item
          v-show="this.form.deviceType == '1'"
          :required="true"
          label="协议类型:"
        >
          <j-dict-select-tag
            :allowClear="true"
            v-model="form.protocol"
            placeholder="请选择协议类型"
            dictCode="device_protocol"
          />
        </a-form-model-item>
        <a-form-model-item :required="true" label="统计系数:">
          <a-input
            @blur="coefficientChange(form.coefficient)"
            v-model="form.coefficient"
            placeholder="请输入统计系数"
          />
        </a-form-model-item>
      </a-form-model>
      <div class="instructions">
        说明：单位换算，例如：电表，统计值为KWh，系统计算使用MWh，则统计系数为0.001
      </div>
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
          @click="EbmClose"
        >
          取消
        </a-button>
        <a-button type="primary" @click="onAdd" :loading="saveBtn">
          保存
        </a-button>
      </div>
    </a-drawer>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper bgs">
      <div class="title">设备品牌管理</div>
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="60">
          <a-col :xl="6" :md="8" :sm="24">
            <a-form-model-item label="计量类型：">
              <!-- <j-dict-select-tag
                  :allowClear="true"
                  v-model="inquire.measureType"
                  placeholder="请选择计量类型"
                  dictCode="brand_model_measure_code"
                /> -->
              <a-select
                :allowClear="true"
                placeholder="请选择"
                style="width: 100%"
                v-model="inquire.measureType"
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
                style="margin-left: 24px"
                >重置</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
      <div class="poasr">
        <a-button type="primary" @click="addDevice"> 添加设备型号 </a-button>
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
        <span slot="support" slot-scope="record">
          <span>{{ record == false ? "否" : "是" }}</span>
        </span>
        <span slot="action" slot-scope="record">
          <a-dropdown>
            <a class="ant-dropdown-link" @click="onEdit(record)"> 编辑 </a>
          </a-dropdown>
          <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
          <a-popconfirm title="确定删除吗?" @confirm="() => onDelte(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import {
  cyBizBrandModelAdd,
  cyBizBrandModelEdit,
  cyBizBrandModeldelete,
  cyBizBrandModellist,
  cyBizBrandModelqueryById,
} from "@/api/tanpai.js";
export default {
  components: { tree, eacharts },
  data() {
    return {
      searchBtn:false,
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
      drawTitle: "添加设备型号",
      saveBtn: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      inquire: {
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
      },
      form: {
        id: "",
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
        deviceType: undefined,
        coefficient: undefined,
        protocol: undefined,
      },
      isAss: false,
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
      columns: [
        {
          title: "设备简称",
          dataIndex: "abbreviation",
          align: "center",
        },
        {
          title: "设备型号",
          dataIndex: "brand",
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
          title: "是否适配系统",
          dataIndex: "support",
          scopedSlots: { customRender: "support" },
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      data: [],
    };
  },
  created() {
    this.cyBizBrandModellist();
  },
  methods: {
    coefficientChange(item) {
      // 确保输入的是小数
      let value = parseFloat(item);
      if (!isNaN(value)) {
        this.form.coefficient = value.toFixed(4);
      } else {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
        this.form.coefficient = undefined;
      }
    },
    //删除
    onDelte(value) {
      cyBizBrandModeldelete(value.id).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.message);

          this.cyBizBrandModellist();
        }
      });
    },
    //查询
    onEdit(value) {
      this.saveBtn = false;
      console.log(value, "213");
      this.form.id = value.id;
      cyBizBrandModelqueryById({ id: value.id }).then((res) => {
        if (res.code == 200) {
          this.drawTitle = "编辑";
          this.visible = true;
          this.isAss = true;
          // if(this.form.id==sessionStorage.getItem('id')){
          //   this.form.brand = sessionStorage.getItem('brand')||res.result.brand;
          //   this.form.abbreviation =sessionStorage.getItem('abbreviation')|| res.result.abbreviation;
          //   this.form.measureType = sessionStorage.getItem('measureType')||res.result.measureType;
          //   this.form.deviceType = sessionStorage.getItem('deviceType')||res.result.deviceType;
          //   this.form.coefficient =sessionStorage.getItem('coefficient')|| res.result.coefficient;
          //   this.form.protocol= sessionStorage.getItem('protocol')||res.result.protocol
          // }else{
          this.form.brand = res.result.brand;
          this.form.abbreviation = res.result.abbreviation;
          this.form.measureType = res.result.measureType;
          this.form.deviceType = res.result.deviceType;
          this.form.coefficient = res.result.coefficient;
          this.form.protocol = res.result.protocol;
        }
      });
    },
    //添加
    onAdd() {
      if (!this.form.brand) {
        this.$message.warning("请输入设备品牌型号");
        return;
      }
      if (!this.form.abbreviation) {
        this.$message.warning("请输入设备简称");
        return;
      }
      if (!this.form.measureType) {
        this.$message.warning("请选择计算类型");
        return;
      }
      if (!this.form.deviceType) {
        this.$message.warning("请输入设备类型");
        return;
      }
      if (!this.form.coefficient) {
        this.$message.warning("请输入统计系数");
        return;
      }
      if (this.form.deviceType == "1") {
        if (!this.form.protocol) {
          this.$message.warning("请选择协议类型");
          return;
        }
      }
      this.saveBtn = true;
      this.form.deviceType = parseInt(this.form.deviceType);
      this.form.measureType = parseInt(this.form.measureType);

      if (this.isAss) {
        cyBizBrandModelEdit(this.form).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.cyBizBrandModellist();
            this.visible = false;

            this.isAss = false;
            this.saveBtn = false;

            this.form = {
              brand: undefined,
              abbreviation: undefined,
              measureType: undefined,
              deviceType: undefined,
              coefficient: undefined,
              protocol: undefined,
            };
          } else {
            this.saveBtn = false;
            this.$message.warning(res.message);
          }
        });
      } else {
        cyBizBrandModelAdd(this.form).then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.cyBizBrandModellist();
            this.visible = false;
            this.saveBtn = false;

            this.form = {
              brand: undefined,
              abbreviation: undefined,
              measureType: undefined,
              deviceType: undefined,
              coefficient: undefined,
              protocol: undefined,
            };
          } else {
            this.saveBtn = false;
            this.$message.warning(res.message);
          }
        });
      }
    },
    /**
     * 分页查询
     */
    cyBizBrandModellist() {
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      if (this.inquire) parameter = Object.assign(parameter, this.inquire);
      cyBizBrandModellist(parameter).then((res) => {
        if (res.code == 200) {
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
        }
        this.searchBtn=false
      });
    },
    addDevice() {
      this.form = {
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
        deviceType: undefined,
        coefficient: undefined,
      };
      this.saveBtn = false;
      this.drawTitle = "添加设备型号";
      this.isAss = false;
      this.visible = true;
    },
    EbmClose() {
      this.visible = false;
      // this.setSessionStorageItems(this.form)
    },
    // setSessionStorageItems(form){
    //   const items={...form}
    //   for(const key in items){
    //     if (
    //     items.hasOwnProperty(key) &&
    //     items[key] !== null &&
    //     items[key] !== undefined
    //   ) {
    //     sessionStorage.setItem(key, items[key].toString()); // 转换为字符串以存储在 sessionStorage 中
    //   }
    //   }
    // },
    searchQuery() {
      this.searchBtn=true
      this.cyBizBrandModellist();
    },
    searchReset() {
      this.inquire = {
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
      };
      this.cyBizBrandModellist();
    },
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
      this.cyBizBrandModellist();
      //   this.loadData();
    },
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
</style>
<style scoped lang="less">
.bg {
  width: 100%;
  height: 100%;
}
.poasr {
  margin-bottom: 26px;
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
</style>
