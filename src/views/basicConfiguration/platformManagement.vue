<template>
  <div class="bg tables map">
    <a-modal
      class="bgs tiShiColor"
      v-model="visible"
      title="编辑"
      @ok="handleOk"
      :confirmLoading="saveBtn"
    >
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item :required="true" label="电站名称:">
          <a-input :disabled="editVisible" v-model="form.stationName" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item :required="true"
         label="电站地址:">
          <a-input :disabled="editVisible" v-model="form.stationAddress" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item    :required="true" label="电站位置:">
          <a-tree-select
          class="location"
            v-model="form.selectStationLocation"
            placeholder="请选择内容"
            :tree-data="form.stationLocation"
            tree-default-expand-all
            @change="rangeChange"
          >
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div class="contant">
      <div class="headers">
        <div class="headers-top">
          <div class="title">光伏电站管理</div>
        </div>
        <div class="headers-bottom">
          <a-row>
            <a-col :xl="8" :md="8" :sm="24">
              <div
                :class="switchTop == 1 ? 'xuanzho1' : 'xuanzho'"
                @click="onTable(1)"
              >
                华为
              </div>
            </a-col>
            <a-col :xl="8" :md="8" :sm="24">
              <div
                :class="switchTop == 2 ? 'xuanzho1' : 'xuanzho'"
                @click="onTable(2)"
              >
                锦浪
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="footer">
        <div class="tess">
          <div>
            <a-row>
              <a-col :xl="4" :md="8" :sm="24">
                <div class="top-box">
                  <div class="boxcontant">
                    电站总量：{{ powerTotal }}
                  </div>
                </div>
              </a-col>
              <a-col
                :xl="4"
                :md="8"
                :sm="24"
                v-for="(item, index) in photovoltaicList"
                :key="index"
              >
                <div class="top-box">
                  <div class="boxcontant">
                    {{ item.stateName }}：{{ item.value }}
                  </div>
                </div>
              </a-col>
            </a-row>
            <div class="right-bottom">
              <a-table
                :pagination="ipagination"
                :columns="columns"
                :data-source="data"
                :scroll="{ y: 420 }"
                @change="handleTableChange"
              >
                <span slot="action" slot-scope="text, record">
                  <a @click="editButton(record)">
                    编辑
                  </a>
                </span>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryPhotovoltaicList,
  queryPhotovoltaicById,
  queryAllDeviceStatus,
  bingingMap
} from "@/api/photovoltaic";
import { getByType} from "@/api/tanpai";
export default {
  data() {
    return {
      saveBtn:false,
      powerTotal:0,
      editVisible:false,
      switchTop:1,
      photovoltaicList:[],
      // 弹出框配置
      form: {
        stationName: undefined,
        stationAddress: undefined,
        stationLocation: [],
        selectStationLocation: undefined,
        editId:undefined,
        platformId:undefined,
      },
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
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
     stateMappings:{
              '华为':{
                1:'断连',
                2:'故障',
                3:"健康"
              },
              '锦浪':{
                1:'在线',
                2:'离线',
                3:"报警"
              }
            },
      columns: [
        {
          title:"平台名称",
          dataIndex:"platformName",
          align:"center",
        },
        {
          title: "电站名称",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "电站地址",
          ellipsis: true,
          dataIndex: "address",
          align: "center",
        },
        {
          title: "电站状态",
          dataIndex: "state",
          align: "center",
        },
        {
          title: "电站位置",
          dataIndex: "mapName",
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      data: [],
    };
  },
  created() {
    this.getPhotovoltaicList();
  },
  methods: {
    onTable(value){
      this.switchTop=value
      this.getPhotovoltaicList(value);
    },
    // 编辑确定
    handleOk(){
      let parameter={
        id:this.form.editId,
        address:this.form.stationAddress,
        name:this.form.stationName,
        mapId:this.form.selectStationLocation
      }
      this.saveBtn=true
      bingingMap(parameter).then(res=>{
        if(res.code==200){
          this.$message.warning('编辑成功')
          this.visible=false
          this.editVisible=false
          this.getPhotovoltaicList(this.form.platformId);
       
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    rangeChange(value){
      this.form.selectStationLocation = value;
    },
    // 编辑
    editButton(record) {
      let parameter = {
        id: record.id,
      };
      this.saveBtn=false
      this.visible = true;
      this.editVisible=true
     this.form.platformId=record.platformId
    
      queryPhotovoltaicById(parameter).then((res) => {
        if (res.code == 200) {
        
        
          this.form.stationName = res.result.name;
          this.form.stationAddress = res.result.address;
          this.form.editId=res.result.id
          this.form.selectStationLocation=res.result.mapId
        }
      });
      let parm = {
        type: 2,
      };
      getByType(parm).then((res) => {
        if (res.code == 200) {
         
          this.form.stationLocation = this.convertData(res.result);
          console.log(this.form.stationLocation, "[]");
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

    // 获取数据
    getPhotovoltaicList(value) {
      let parameter = {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        platformId:value?value:1
      };

      queryPhotovoltaicList(parameter).then((res) => {
        if (res.code == 200) {
          this.data = res.result.records;
          this.data.forEach((item) => {

            if (!item.mapId) {
              item.mapName = "-";
            }
          
            item.platformName= String(value)==='2'?'锦浪':'华为'
            // 更改状态
            this.updateItemState(item)
          });
        } else {
          this.$message.warning(res.message);
        }
      });
      let parm={
        platformId:value?value:1,
      }
      queryAllDeviceStatus(parm).then(res=>{
        
        if(res.code==200){
          this.photovoltaicList=res.result.stateList
          this.powerTotal=res.result.total
          this.ipagination.total=res.result.total
        }
      })
    },
    updateItemState(item){
      const platformName=item.platformName
      const state= item.state
      if(this.stateMappings[platformName]&&this.stateMappings[platformName][state]){
        item.state =this.stateMappings[platformName][state];  
      }
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
      this.getPhotovoltaicList();
      //   this.loadData();
    },
  },
};
</script>

<style lang="less" >
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
<style scoped lang="less">
.tddColor {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #1ffff2;
}

.xuanzho {
  padding: 7px 97px;
  background: #045d62;
  border-radius: 2px 2px 0px 0px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
.xuanzho1 {
  padding: 7px 97px;
  background: #00ada3;
  border-radius: 2px 2px 0px 0px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
}
.top-box {
  margin-bottom: 24px;
  width: 214px;
  height: 52px;
  background: #013038;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid #00ada3;
}
.boxcontant {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 20px;
  color: #ffffff;
  line-height: 22px;
  margin: 15px 35px;
}
.bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.location{
  
  width: 280px !important;
    height: 35px !important;
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 3px 3px 3px 3px !important;
    border: 1px solid #1ffff2 !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4) !important;

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
.footer {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
}

.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
}
</style>
