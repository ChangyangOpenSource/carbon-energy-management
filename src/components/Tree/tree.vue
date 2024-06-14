<template>
  <div class="tess map">
    <el-tree :data="treeList" node-key="id" :expand-on-click-node="false" >
      <span class="custom-tree-node" slot-scope="scope" @click="onClick(scope.data.id)"> 
        <span class="textsds" >
          <img class="w4" src="../../assets/hotai/wxja.png" alt="" />{{
            scope.data.name
          }}
          <span class="biaoqian">{{ scope.data.tagName }}</span>
        </span>
      </span>
    </el-tree>
  </div>
</template>
  
<script>
export default {

  props:['treeList'],

  data() {
    return {
      log: {
        title: "新联强",
        children: [
          {
            title: "A区",
            children: [
              {
                title: "车间",
              },
            ],
          },
          {
            title: "B区",
            children: [
              {
                title: "车间二",
              },
            ],
          },
        ],
      },
    };
  },
  mounted() {
    console.log(this.treeList, ".data.tagName ");
  },
  methods:{
    onClick(value){
      this.$emit('onClick',value)
      console.log(value)
    },
  }
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
  .el-tree-node__content {
    width: 100%;
  }
 
  .el-tree-node__content:hover,
  .el-upload-list__item:hover {
    background: rgba(0, 255, 247, 0.17) !important;
  }
  .el-tree-node__content:visited
  .el-upload-list__item:visited {
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
<style lang="less">
.tess {
  overflow: hidden;
}
.ant-tree-title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px !important;
  color: #1ffff2;
  margin-left: 6px;
}

.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  width: 100%;
  padding: 5px 0 5px 13px;
  background: rgba(0, 255, 247, 0.17) !important;
  border-radius: 2px 2px 2px 2px;
  height: auto !important;
  color: #ffffff !important;
  .ant-tree-title {
    color: #ffffff !important;
  }
}
.ant-tree li .ant-tree-node-content-wrapper:hover {
  width: 100%;
  padding: 5px 0 5px 13px;
  background: rgba(0, 255, 247, 0.17) !important;
  border-radius: 2px 2px 2px 2px;
  height: auto !important;
  color: #ffffff !important;
  .ant-tree-title {
    color: #ffffff !important;
  }
}
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
</style>
