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
        style="background-color: #0b4144"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          v-if="drawerTitle == '新增能源类型'"
          :required="true"
          label="能源类型:"
        >
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
        <div v-if="form.name">
          <a-form-model-item :required="true" label="折标煤系数">
            <a-col :xl="8">
              <a-input
                v-model="form.coefficient"
                @blur="valueInput"
                :default-value="form.defaultDesc"
              />
            </a-col>
            <a-col :xl="7" :offset="1">
              <div class="tiShiColor">单位：{{ form.unit }}</div>
            </a-col>
            <a-col :xl="5" :offset="3">
              <div class="choZhiColor" @click="resetDefault">重置默认值</div>
            </a-col>
          </a-form-model-item>
        </div>
        <a-form-model-item :required="true" label="单位说明:">
          <a-textarea
            placeholder="请输入"
            :auto-size="{ minRows: 2, maxRows: 8 }"
            v-model="form.configDesc"
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

    <!-- 头部区域 -->
    <div class="table-page-search-wrapper">
      <div class="headers">
        <div class="Theme">折标煤规则</div>
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

          <a-popconfirm
            title="确定删除吗?"
            @confirm="() => deleteEnergy(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </span></a-table
      >
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import {
  queryMetacarboniteList,
  queryMetacarboniteNameList,
  queryMetacarbonite,
  queryMetacarboniteDetails,
  deleteMetacarbonite,
  editMetacarbonite,
  addMetacarbonite,
} from "@/api/carbonEmission";
export default {
  components: { tree, eacharts },
  data() {
    return {
      saveBtn: false,
      editId: "",
      // 弹出框的标题
      drawerTitle: "新增能源类型",
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        energyName: [],
        name: "",
        coalIcId: "", //折碳煤id
        unit: "", //单位
        coefficient: "", //输入值
        defaultIc: "", //默认系数
        configDesc: "", //输入框中
        defaultCoefficient: "", //默认系数
        region: undefined,
        date1: undefined,
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
          title: "能源类型",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "折碳煤系数",
          dataIndex: "coefficient",
          align: "center",
        },
        {
          title: "单位说明",
          dataIndex: "configDesc",
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
    };
  },
  created() {
    this.getMetacarbonit();
  },
  methods: {
    // 对输入的进行校验
    valueInput() {
      // 确保输入的是小数
      let value = parseFloat(this.form.coefficient);
      if (!isNaN(value)) {
        this.form.coefficient = value.toFixed(4);
      } else {
        // 处理非法输入的情况，例如给出提示
        this.$message.warning("请输入正确的格式");
      }
    },
    // 保存数据
    saveEnergy() {
      
      
      // 判断类型
      let parameter = {
        coalIcId: this.form.coalIcId,
        coefficient: this.form.coefficient,
        configDesc: this.form.configDesc,
        id: this.editId,
      };
      if (this.drawerTitle === "新增能源类型") {
        // 发起添加请求
        if (!this.form.region) {
          this.$message.warning("请选择能源类型");
          return;
        }
        if (!this.form.coefficient) {
        this.$message.warning("请输入折标煤系数");
        return;
      }
      if (!this.form.configDesc) {
        this.$message.warning("请输入单位说明");
        return;
      }
      this.saveBtn = true;
        addMetacarbonite(parameter).then((res) => {
          if (res.success) {
            this.getMetacarbonit();
            this.$message.warning(res.message);
          } else {
            this.$message.warning("该能源已存在");
          }
        });
      } else {
        if (!this.form.coefficient) {
        this.$message.warning("请输入折标煤系数");
        return;
      }
      if (!this.form.configDesc) {
        this.$message.warning("请输入单位说明");
        return;
      }
      this.saveBtn = true;
        editMetacarbonite(parameter).then((res) => {
          if (res.success) {
            this.getMetacarbonit();
            this.$message.warning(res.message);
          } else {
            this.$message.warning(res.message);
          }
        });
      }
      this.form = {
        energyName: [],
        name: "",
        coalIcId: "", //折碳煤id
        unit: "", //单位
        coefficient: "", //输入值
        defaultIc: "", //默认系数
        configDesc: "", //输入框中
        defaultCoefficient: "", //默认系数
        region: undefined,
        date1: undefined,
      };
      this.Close();
    },
    // 点击编辑后获取该类型的数据
    edit(record) {
      this.saveBtn = false;
      this.drawerTitle = "编辑";
      this.visible = true;
      let parameter = {
        id: record.id,
      };
      this.editId = record.id;
      queryMetacarboniteDetails(parameter).then((res) => {
        if (res.success) {
          Object.assign(this.form, res.result);
          this.form.coefficient = res.result.coefficient;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 通过点击后通过id删除
    deleteEnergy(record) {
      let parameter = {
        id: record.id,
      };
      deleteMetacarbonite(parameter).then((res) => {
        if (res.success) {
          this.getMetacarbonit();
          this.$message.warning(res.message);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 重置默认值
    resetDefault() {
      if (this.drawerTitle == "新增能源类型") {
        this.form.coefficient = this.form.defaultIc;
      } else {
        this.form.coefficient = this.form.defaultCoefficient;
      }
    },
    // 当选择能源名称后，查询其默认值
    nameChagne(value) {
      this.form.coalIcId = value;

      let parameter = {
        id: value,
      };
      queryMetacarbonite(parameter).then((res) => {
        if (res.success) {
          Object.assign(this.form, res.result);
          this.form.coefficient = res.result.defaultIc;
          this.form.configDesc = res.result.defaultDesc;
          this.form.name = res.result.typeName;
        } else {
          this.$message.warning(res.message);
        }
      });
    },

    // 获取能源类型
    getEnergyType(parameter) {
      queryMetacarboniteNameList(parameter).then((res) => {
        if (res.success) {
          this.form.energyName = res.result;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取数据
    getMetacarbonit(index) {
      // 当分页器页数发生变化时更新
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
      };
      queryMetacarboniteList(parameter).then((res) => {
        if (res.success) {
          this.data = res.result.records;

          this.ipagination.total = res.result.total;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    addEnergyTypes() {
      this.saveBtn = false;
      // 清空表单数据
      this.form = {
        energyName: [],
        name: "",
        coalIcId: "", //折碳煤id
        unit: "", //单位
        coefficient: "", //输入值
        defaultIc: "", //默认系数
        configDesc: "", //输入框中
        defaultCoefficient: "", //默认系数
        region: undefined,
        date1: undefined,
      };
      this.drawerTitle = "新增能源类型";
      // 获取列表数据
      this.getEnergyType();
      this.visible = true;
    },
    onClose() {
      this.Close();
    },
    Close() {
      this.visible = false;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
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
      this.getMetacarbonit();
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
    margin: 12px 0 76px 12px;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 20px;
  }
}
</style>
