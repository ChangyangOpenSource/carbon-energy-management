<template>
  <div class="bg tables map">
    <a-drawer
      title="标签管理"
      :width="900"
      :visible="drawerOpen"
      @close="onClose"
      :maskClosable="false"
    >
      <a-table
        class="right-bottom onsw"
        :columns="column"
        :data-source="listBy"
        bordered
        :pagination="false"
      >
        <template
          v-for="col in ['name', 'level']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleChange(e.target.value, record.id, col)"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a class="margin" @click="() => save(record.id)">保存</a>

              <a @click="() => cancel(record.id)">取消</a>
            </span>
            <span v-else>
              <a class="margin" @click="() => edit(record.id)">
                <span class="tddColor margin"> 编辑</span>
              </a>
              <a-popconfirm
                title="确定删除吗?"
                @confirm="() => handleDelete(record.id)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
      <div class="addRow" @click="onAdd">
        <a-icon type="plus" />
        添加行
      </div>
    </a-drawer>
    <a-drawer
      :maskClosable="false"
      class="bgs tables"
      :title="title"
      :width="drawerWidth"
      @close="onColhandleCancel"
      :visible="visible"
      :confirmLoading="confirmLoading"
    >
      <div :style="{ width: '100%', padding: '10px 16px' }">
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="form" :model="model">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="名称"
              :required="true"
              hasFeedback
            >
              <a-input
                placeholder="请输入名称"
                v-model="model.name"
                :readOnly="disableSubmit"
              />
            </a-form-model-item>

            <a-form-model-item
              style="margin-bottom: 24px"
              label="上级分组"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :validate-status="validateStatus"
              :hasFeedback="true"
            >
              <span slot="help">{{
                validateStatus == "error" ? "请选择上级菜单" : "&nbsp;&nbsp;"
              }}</span>
              <a-tree-select
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                :treeData="treeData"
                :replaceFields="replaceTypeTreeFields"
                v-model="model.parentId"
                placeholder="请选择"
                allowClear
                :disabled="disableSubmit"
              >
              </a-tree-select>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
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
            @click="handleOk"
          >
            取消
          </a-button>
          <a-button type="primary" @click="saveWorkshop"> 保存 </a-button>
        </div>
      </div>
    </a-drawer>

    <div class="contant">
      <div class="headers">
        <div class="headers-top">
          <div class="title">地图管理</div>
          <div class="left-box bgs">
            <a-button type="primary" @click="addGroup">新增分组</a-button>
            <a-button
              type="primary"
              @click="labelManagement"
              class="buttton2"
              style="margin-left: 20px"
              >标签管理</a-button
            >
          </div>
        </div>
        <div class="headers-bottom">
          <a-row>
            <a-col :xl="8" :md="8" :sm="24">
              <div
                :class="{ xuanzho: switchMap != 1, xuanzho1: switchMap == 1 }"
                @click="onTable(1)"
              >
                工厂地图
              </div>
            </a-col>
            <a-col :xl="8" :md="8" :sm="24">
              <div
                :class="{ xuanzho: switchMap != 2, xuanzho1: switchMap == 2 }"
                @click="onTable(2)"
              >
                光伏地图
              </div></a-col
            >
            <a-col :xl="8" :md="8" :sm="24">
              <div
                :class="{ xuanzho: switchMap != 3, xuanzho1: switchMap == 3 }"
                @click="onTable(3)"
              >
                阶段地图
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="footer">
        <div class="tess">
          <el-tree :data="data" node-key="id" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="scope">
              <span class="textsds">
                <img class="w4" src="../../assets/hotai/wxja.png" alt="" />{{
                  scope.data.name
                }}
                <span class="biaoqian">{{ scope.data.tagName }}</span>
              </span>

              <span>
                <el-button
                  class="margin"
                  type="text"
                  size="mini"
                  @click="carbonedit(scope.data)"
                >
                  <img class="w1" src="../../assets/编辑 (3) 1@2x.png" alt="" />
                </el-button>

                <a-popconfirm
                  title="确定删除吗?"
                  @confirm="() => carbondelete(scope.data)"
                >
                  <img class="w1" src="../../assets/删除 (4) 1@2x.png" alt="" />
                </a-popconfirm>
              </span>
            </span>
          </el-tree>
        </div>
        <!-- <div class="tess" v-else-if="switchMap == 2">
          <el-tree :data="data" node-key="id" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="scope">
              <span class="textsds" v-if="!scope.data.isAss">
                <img class="w4" src="" alt="" />{{ scope.data.name }}</span
              >
              <span class="textsds" v-else
                ><img class="w4" src="" alt="" />
                <input
                  type="text"
                  class="inpus"
                  :focus="true"
                  v-model="scope.data.name"
                  @blur="onblur"
                />
              </span>
              <span>
                <el-button type="text" v-if="scope.node.level < 3" size="mini">
                  <img class="w1" src="../../assets/添加 (3) 1@2x.png" alt="" />
                </el-button>
                <el-button type="text" size="mini">
                  <img class="w1" src="../../assets/编辑 (3) 1@2x.png" alt="" />
                </el-button>
                <el-button type="text" size="mini">
                  <img class="w1" src="../../assets/删除 (4) 1@2x.png" alt="" />
                </el-button>
              </span>
            </span>
          </el-tree>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import {
  getByType,
  carbonAdd,
  listByType,
  cyMapTagEdit,
  cyMapTagDelete,
  cyMapTagadd,
  carbondelete,
  carbonedit,
  cyMapTagqueryById,
} from "@/api/tanpai.js";
const column = [
  {
    title: "标签名称 ",
    dataIndex: "name",
    align: "center",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "标签等级",
    dataIndex: "level",
    key: "level",
    align: "center",
    scopedSlots: { customRender: "level" },
  },

  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];

export default {
  components: { tree, eacharts },
  data() {
    return {
      drawerWidth: 700,
      treeData: [],
      listBy: [],
      editingKey: "",
      replaceTypeTreeFields: {
        //替换 treenode字段为treedata
        children: "children",
        title: "name",
        value: "id",
        key: "id",
      },
      title: "新增分组",
      visible: false,
      disableSubmit: false,
      model: {
        name: undefined,
        tagId: undefined,
        parentId: undefined,
      },
      show: true, //根据菜单类型，动态显示隐藏表单元素
      menuLabel: "菜单名称",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      iconChooseVisible: false,
      validateStatus: "",
      column,
      drawerOpen: false,
      visible: false,
      switchMap: 1,
      data: [],
      isAss: false,
      defaultProps: {
        children: "children",
        label: "label",
      },

      columns: [
        {
          title: "Name",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "Age",
          dataIndex: "age",
          align: "center",
        },
        {
          title: "Address",
          dataIndex: "address",
          align: "center",
        },
      ],
      cacheData: [],
    };
  },
  created() {
    this.getByType();
    this.listByType();
  },
  methods: {
    // 编辑按钮
    carbonedit(value) {
      this.confirmLoading=false;
      let parm = {
        id: value.id,
      };
      cyMapTagqueryById(parm).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.title = "编辑";
          this.visible = true;
          this.model = res.result;
        }
      });
    },
    carbondelete(value) {
      carbondelete(value.id).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.message);
          this.getByType();
        } else {
          this.$message.success(res.message);
        }
      });
    },
    //添加
    onAdd() {
      if (this.isAss) {
        return;
      } else {
        this.isAss = true;
      }
      this.listBy.push({
        level: "",
        name: "",
        editable: true,
        type: this.switchMap,
      });
      this.$forceUpdate();
    },
    //編輯
    save(key) {
      if (!key) {
        if (!this.listBy[this.listBy.length - 1].name) {
          this.$message.warning("请输入名称");
          return;
        }
        if (!this.listBy[this.listBy.length - 1].level) {
          this.$message.warning("请输入标签类型");
          return;
        }
        cyMapTagadd(this.listBy[this.listBy.length - 1]).then((res) => {
          if (res.code == 200) {
            this.isAss = false;
            this.$message.success(res.message);
            delete this.listBy[this.listBy.length - 1].editable;
            this.getByType();
            this.listByType();
            return;
          } else {
            this.$message.warning(res.message);
            return;
          }
        });
        return;
      }
      const newData = [...this.listBy];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item) => key === item.id);
      const targetCache = newCacheData.find((item) => key === item.id);
      if (!target.name) {
        this.$message.warning("请输入名称");
        return;
      }
      if (!target.level) {
        this.$message.warning("请输入标签类型");
        return;
      }

      cyMapTagEdit(target).then((res) => {
        if (res.code == 200) {
          this.isAss = false;
          this.$message.success(res.message);
          if (target && targetCache) {
            delete target.editable;
            Object.assign(targetCache, target);
            this.cacheData = newCacheData;
          }
          this.listByType();
          this.getByType();
        } else {
          this.$message.warning(res.message);
        }
      });

      this.editingKey = "";
    },
    //取消
    cancel(key) {
      if (!key) {
        console.log(key);
        this.listBy.pop();
        this.isAss = false;
        return;
      }
      this.isAss = false;
      const newData = [...this.listBy];
      const target = newData.find((item) => key === item.id);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.id)
        );
        delete target.editable;
        this.listBy = newData;
      }
    },
    //编辑
    edit(key) {
      if (this.isAss) {
        return;
      } else {
        this.isAss = true;
      }
      const newData = [...this.listBy];
      const target = newData.find((item) => key === item.id);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.listBy = newData;
      }
    },
    //删除
    handleDelete(key) {
      cyMapTagDelete(key).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.message);
          this.listByType();
        }
      });
    },
    //获取
    getByType() {
      getByType({
        type: this.switchMap,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.data = res.result;
          this.treeData = res.result;
        }
      });
    },
    listByType() {
      listByType({
        type: this.switchMap,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.listBy = res.result;
          this.cacheData = this.listBy.map((item) => ({ ...item }));
        }
      });
    },
    handleParentIdChange() {},
    //切换
    onTable(value) {
      this.switchMap = value;
      this.getByType();
      this.listByType();
    },
    onColhandleCancel() {
      this.visible = false;
      this.model = {
        name: "",
        // tagId: "",
        parentId: "",
      };
    },
    onClose() {
      this.drawerOpen = false;
      this.listBy.forEach((res) => {
        delete res.editable;
      });
    },
    saveWorkshop() {
      if (!this.model.name) {
        this.$message.warning("请输入名称");

        return;
      }
      this.confirmLoading=true
      this.model.type = this.switchMap;
      if (this.title == "新增") {
        carbonAdd(this.model).then((res) => {
          if (res.code == 200) {
            this.visible = false;
            this.model = {
              name: "",
              // tagId: "",
              parentId: undefined,
            };
            this.$message.success("添加成功");
            this.getByType();
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        carbonedit(this.model).then((res) => {
          if (res.code == 200) {
            this.visible = false;
            this.model = {
              name: "",
              tagId: "",
              parentId: undefined,
            };
            this.$message.success("编辑成功");
            this.getByType();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    onCalance() {
      this.drawerOpen = false;
    },
    // 标签管理按钮
    labelManagement() {
      this.drawerOpen = true;
    },
    handleOk() {
      this.visible = false;
    },
    addGroup() {
      
      // 先清空
      (this.model = {
        name: undefined,
        tagId: undefined,
        parentId: undefined,
      }),
        (this.title = "新增");
      this.visible = true;
      this.confirmLoading=false
    },
    handleChange(value, key, column) {
      console.log(value, key, column);
      const newData = [...this.listBy];

      const target = newData.find((item) => key === item.id);
      if (target) {
        target[column] = value;
        this.listBy = newData;
      }
    },
  },
};
</script>
<style lang="less">
.onsw {
  .ant-input {
    width: 70% !important;
  }
}
.map {
  .ant-form-item {
    margin-bottom: 24px !important;
  }
  .el-tree {
    background: transparent !important;
  }
  .textsds {
    width: 100%;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #1ffff2;
    display: flex;
    align-items: center;
    img {
      margin-right: 12px;
    }
  }
  .el-tree-node {
    margin-bottom: 12px;
  }
  .el-tree-node__content {
    width: 100%;
    margin-bottom: 12px;
  }
  .is-current {
    background: rgba(0, 255, 247, 0.17);
  }
  .el-tree-node__content:hover,
  .el-upload-list__item:hover {
    background: rgba(0, 255, 247, 0.17) !important;
  }
  .el-tree-node__content:visited .el-upload-list__item:visited {
    background: rgba(0, 255, 247, 0.17) !important;
  }
}
.el-icon-caret-right:before {
  font-size: 16px;
}

.el-tree-node:focus > .el-tree-node__content {
  background: transparent !important;
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
.biaoqian {
  background: rgba(31, 255, 242, 0.12);
  border-radius: 3px 3px 3px 3px;
  border: 1px solid rgba(31, 255, 242, 0.5);
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
  padding: 1px 6px;
  margin-left: 12px;
}
.tddColor {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #1ffff2;
}

.margin {
  margin-right: 12px;
}
.custom-tree-node {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.xuanzho {
  padding: 7px 87px;
  background: #045d62;
  border-radius: 2px 2px 0px 0px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
.xuanzho1 {
  padding: 7px 87px;
  background: #00ada3;
  border-radius: 2px 2px 0px 0px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
}
.bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.contant {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.addRow {
  width: 186px;
  height: 36px;
  background: #00ada3;
  border-radius: 3px 3px 3px 3px;
  margin: 24px auto;
  padding: 9px 55px;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
  line-height: 17px;
}
.headers {
  background: #053c43;
}
.headers-top {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
}
.headers-bottom {
  width: 690px;
  height: 36px;
}
.left-box {
  display: flex;
  justify-content: space-between;
}
.footer {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
}
.left {
  min-width: 331px;
  height: 100%;
  background: #053c43;
  border-radius: 0px 0px 0px 0px;
  padding: 24px;
  margin-headers: 24px;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
}
</style>
