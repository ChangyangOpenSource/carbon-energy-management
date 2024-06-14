<template>
  <div class="bg tables">
    <!-- 侧边抽屉框 -->
    <a-drawer
      :title="drawerTitle"
      :width="900"
      :visible="visible"
      @close="onClose"
      :maskClosable="false"
    >
      <a-form-model
        class="tables"
        style="background-color: #0B4144;"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :required="true" label="能源类型:">
          <a-select
            allowClear
            show-search
            optionFilterProp="children"
            v-model="form.Fossil"
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in form.Type"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item :required="true" label="能源名称:">
          <a-select
            allowClear
            show-search
            optionFilterProp="children"
            v-model="form.region"
            @change="nameChagne"
            placeholder="请选择"
          >
            <a-select-option v-for="item in form.energyName" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <div v-if="form.calcType == 'CALC'">
          <a-form-model-item
            :required="true"
            v-for="item in form.paramList"
            :key="item.id"
            :label="item.name"
          >
            <a-col :xl="8">
              <a-input @blur="coefficientChange(item)" v-model="item.value" />
            </a-col>
            <a-col :xl="7" :offset="1">
              <div class="tiShiColor">单位：{{ item.unit }}</div>
            </a-col>
            <a-col :xl="5" :offset="3">
              <div class="choZhiColor" @click="calcResetDefault(item)">
                重置默认值
              </div>
            </a-col>
          </a-form-model-item>
          <a-form-model-item :required="true" label="排放因子:">
            <p class="tiShiColor">{{ form.coefficient }}</p>
          </a-form-model-item>
        </div>
        <div v-if="form.calcType == 'INPUT'">
          <a-form-model-item
            :required="true"
            v-for="item in form.paramList"
            :key="item.id"
            :label="item.name"
          >
            <a-row>
              <a-col :xl="6">
                <a-input
                  @blur="valueInput(item)"
                  placeholder="请输入1"
                  v-model="item.value"
                />
              </a-col>
              <a-col :xl="8" :offset="1">
                <div class="tiShiColor">单位：{{ item.unit }}</div>
              </a-col>
              <a-col :xl="5" :offset="3">
                <div class="choZhiColor" @click="inputResetDefault(item)">
                  重置默认值
                </div>
              </a-col>
            </a-row>
          </a-form-model-item>
        </div>
        <a-form-model-item :required="true" label="排放因子说明:">
          <a-textarea
            placeholder="请输入"
            :auto-size="{ minRows: 2, maxRows: 8 }"
            v-model="form.desc"
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
          @click="onClose"
        >
          取消
        </a-button>
        <a-button type="primary" @click="saveEnergy" :loading="saveBtn">
          保存
        </a-button>
      </div>
    </a-drawer>

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <div class="headers">
        <div class="Theme">碳排模型</div>
        <div class="Instructions">
          该模型核算方法依据《机械设备制造企业温室气体排放核算方法与报告指南(试行)》文件计算
        </div>
      </div>
      <div class="poasr bgs">
        <a-button type="primary" @click="addEnergyTypes"> 新增 </a-button>
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
          <a-dropdown>
            <a class="ant-dropdown-link" @click="edit(record)">
              编辑
            </a>
          </a-dropdown>
          <span>&nbsp; &nbsp; &nbsp; &nbsp;</span>
          <a-dropdown>
            <a-popconfirm
              title="确定删除吗?"
              @confirm="() => deleteEnergy(record)"
            >
              <a>删除</a>
            </a-popconfirm>
          </a-dropdown>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  queryEnergyList,
  queryIdEnergy,
  deleteIdEnergy,
  queryEnergyType,
  queryEnergyNameList,
  queryEnergyDetails,
  addEnergy,
  editEnergy,
} from "@/api/carbonEmission";
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
export default {
  components: { tree, eacharts },
  data() {
    return {
      saveBtn:false,
      deleteVisible: false, //删除状态
      deleteEnergyId: undefined, //删除能源id
      editState: false, //edit状态，可编辑，不可编辑
      isAdd: false,
      drawerTitle: "新增能源类型",

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      // 侧边框form
      form: {
        calculationMode:
          "low_calorific * unit_carbon_content * fuel_carbon_ratio / 100", //计算方式
        calculationRestult: undefined, //计算结果
        Type: [],
        energyName: [],
        Fossil: undefined,
        region: undefined,
        coefficient: "", //排放因子
        paramList: [],
        calcType: "",
        desc: "",
        calc: "",
        nameId: "", //能源名称ID
        typeId: "", //碳排id
        id: "", //当选择编辑时候的主键id
      },
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
          title: "能源名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "能源类型",
          dataIndex: "type",
          align: "center",
        },
        {
          title: "排放因子",
          dataIndex: "coefficient",
          align: "center",
        },
        {
          title: "排放因子说明",
          dataIndex: "desc",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      khfzrChange: undefined,
      data: [],
      queryParam: {
        companyName: "",
        abbreviation: "",
        contactsName: "",
        contactsPhone: "",
      },
    };
  },
  created() {
    this.getEnergyList();
  },

  methods: {
    // 保证输入的是汉字
    // checkChineseInput() {},
    // 对输入的进行校验
    coefficientChange(item) {
      let value = item.value;
      let mode = this.form.calculationMode;
      // console.log(this.form.calculationMode,'this.form.calculationMode');
      // console.log(item,'数据');
      if (item.paramDefinition == "unit_carbon_content") {
        item.value = item.value.replace(/[\u4e00-\u9fa5a-zA-Z]/g, "");
        value = eval(item.value);
      }
      if (isNaN(value)) {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
        item.value = undefined;
        // console.log();
      } else {
        this.calculated(this.form.paramList, mode);
      }
    },
    calculated(formList, calc) {
      formList.forEach((parm) => {
        calc = calc.replace(parm.paramDefinition, parm.value);
      });
      console.log(calc,'calc');
      this.form.coefficient = eval(calc).toFixed(4);
    },
    valueInput(item) {
      // 确保输入的是小数
      let value = parseFloat(item.value);
      if (!isNaN(value)) {
        this.form.coefficient = value.toFixed(4);
        item.value = value.toFixed(4);
      } else {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
      }
    },

    // 重置默认值
    inputResetDefault(item) {
      item.value = item.defaultValue;
      this.form.coefficient=item.value;
      // console.log(item.defaultValue);
    },
    calcResetDefault(item) {
      item.value = item.defaultValue;
      this.coefficientChange(item);
    },
    // 当选择能源名称后，查询其默认值
    nameChagne(value) {
      let parameter = {
        id: value,
      };
      this.form.nameId = value;
      queryEnergyDetails(parameter).then((res) => {
        if (res.success) {
          res.result.paramList.forEach((item) => {
            item.value = item.defaultValue;
            if (item.paramDefinition == "emission_factor") {
              this.form.coefficient = item.defaultValue;
            }
          });

          Object.assign(this.form, res.result);
          this.form.desc = res.result.defaultDesc;

          if (this.form.calcType == "CALC") {
            this.form.calculationMode = res.result.calc;
            this.calculatedEmission(this.form.paramList, res.result.calc);
          }
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    calculatedEmission(formList, calc) {
      formList.forEach((parm) => {
        calc = calc.replace(parm.paramDefinition, parm.defaultValue);
      });

      this.form.coefficient = eval(calc).toFixed(4);
    },
    // 当选择能源类型后，请求能源名称
    handleChange(value) {
      let parameter = {
        typeId: value,
      };
      this.form.typeId = value;
      this.getEnergyName(parameter);
    },
    // 获取能源名称
    getEnergyName(parameter) {
      queryEnergyNameList(parameter).then((res) => {
        if (res.success) {
          this.form.energyName = res.result;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取能源类型
    getEnergyType(parameter) {
      queryEnergyType(parameter).then((res) => {
        if (res.success) {
          this.form.Type = res.result;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取数据
    getEnergyList() {
      // 当分页器页数发生变化时更新
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      queryEnergyList(parameter).then((res) => {
        if (res.success) {
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    deleteEnergy(record) {
      let parameter = {
        id: record.id,
      };
      deleteIdEnergy(parameter).then((res) => {
        if (res.success) {
          // 删除成功后，重新获取数据
          this.getEnergyList();
          this.$message.success(res.message);
        } else {
          this.$message.warning(res.message);
        }
      });
      this.deleteVisible = true;
    },
    // 编辑时候，将对应id的数据通过接口获取
    edit(record) {
      this.saveBtn=false
      this.drawerTitle = "编辑";
      this.visible = true;
      this.form.Fossil = record.type;
      this.form.region = record.name;

      let parameter = {
        id: record.id,
      };
      queryIdEnergy(parameter).then((res) => {
        if (res.success) {
          this.form = Object.assign(this.form, res.result);
          this.form.paramList = res.result.config;
          this.form.id = record.id;
        }
      });

      // 查询能源类型列表
      this.getEnergyType();
    },
    addEnergyTypes() {
      // 先清空表单数据
      this.saveBtn=false
      this.form = {
        Type: [],
        energyName: [],
        Fossil: undefined,
        region: undefined,
        coefficient: "", //排放因子
        paramList: [],
        calcType: "",
        desc: "",
        calc: "",
        nameId: "", //能源名称ID
        typeId: "", //碳排id
        id: "",
      };
      this.drawerTitle = "新增能源类型";
      this.visible = true;
      // 查询能源类型列表
      this.getEnergyType();
    },
    // 保存数据
    saveEnergy() {
      if (!this.form.Fossil) {
        this.$message.warning("请选择能源类型");
        return;
      }
      if (!this.form.region) {
        this.$message.warning("请选择能源名称");
        return;
      }
      if (!this.form.desc) {
        this.$message.warning("请输入排放因子说明");
        return;
      }
      this.saveBtn=true
      let parameter = {
        coefficient: this.form.coefficient,
        config: this.form.paramList,
        desc: this.form.desc,
        nameId: this.form.nameId,
        typeId: this.form.typeId,
      };
      // 发起请求
      if (this.drawerTitle === "新增能源类型") {
        addEnergy(parameter).then((res) => {
          if (res.success) {
            this.getEnergyList();
            this.$message.warning(res.message);
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        parameter.id = this.form.id;
        // console.log(this.form.id);
        editEnergy(parameter).then((res) => {
          if (res.success) {
            this.getEnergyList();
            this.$message.warning(res.message);
          } else {
            this.$message.warning(res.message);
          }
        });
      }
      // 清空数据
      this.form = {
        calculationMode:
          "low_calorific * unit_carbon_content * fuel_carbon_ratio / 100", //计算方式
        calculationRestult: undefined, //计算结果
        Type: [],
        energyName: [],
        Fossil: undefined,
        region: undefined,
        coefficient: "", //排放因子
        paramList: [],
        calcType: "",
        desc: "",
        calc: "",
        nameId: "", //能源名称ID
        typeId: "", //碳排id
        id: "",
      };
      this.saveBtn=false
      this.Close();
    },
    onClose() {
      this.Close();
    },
    // 关闭弹出框
    Close() {
      this.visible = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发数据刷新

      //TODO 筛选

      if (Object.keys(sorter).length > 0) {
        this.sortedInfo = this.sortedInfo = sorter;
      } else {
        this.sortedInfo = {};
      }
      this.ipagination = pagination;
      this.getEnergyList();
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
.ant-select-selection-selected-value {
  color: #fff;
}
.ant-form-item-control .ant-form-item-children {
  display: flex;
  flex-direction: row;
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
  bottom: 24px;
}

.table-page-search-wrapper {
  position: relative;
}
.headers {
  display: flex;

  .Theme {
    margin: 12px 12px 76px 12px;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 20px;
  }
  .Instructions {
    font-weight: 400;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    line-height: 20px;
    margin-top: 15px;
  }
}
</style>
