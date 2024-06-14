<template>
  <div class="bg tables">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper bgs">
      <a-form
        layout="inline"
        labelAlign="right"
        @keyup.enter.native="searchQuery"
      >
        <a-row :gutter="24">
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控名称:">
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
               allowClear
                placeholder="请选择范围"
                v-model="selectMonitoringRange"
                :tree-data="form.monitoringRange"
                tree-default-expand-all
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <a-form-model-item label="监控日期：" style="width: 100% !important">
              <a-range-picker v-model="monitorTime" @change="timeChange">
                <img src="@assets/hotai/rili.png" slot="suffixIcon" alt="" />
              </a-range-picker>
            </a-form-model-item>
          </a-col>
          <a-col :xl="8" :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" :loading="searchBtn" icon="search"
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
        :columns="columns"
        :data-source="data"
        :scroll="{ y: 540 }"
        @change="handleTableChange"
      />
    </div>
  </div>
</template>

<script>
import { getByType } from "@/api/tanpai";
import { queryMonitoringRecordList } from "@/api/monitoring";
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
export default {
  components: { tree, eacharts },
  data() {
    return {
      searchBtn:false,
      monitorSelectName:[],//选择监控名称
      MonitoringStatus: [
        {
          status: 1,
          name: "警告",
        },
        {
          status: 2,
          name: "严重",
        },
      ], //监控状态
      selectMonitoringName: undefined, //选中监控名称
      selectMonitoringType: undefined, //选中监控类型
      selectMonitoringRange: undefined,
      selectMonitoringStatus: undefined, //选中监控状态
      form: {
        monitoringRange: [], //监控范围
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
      },
      monitorTime:undefined,//时间
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
      queryList: {
        dateEnd: "",
        dateStart: "",
        monitorMapScope: "",
        monitorName: "",
        monitorState: "",
        monitorType: "",
        pageNo: "",
        pageSize: "",
      },
      columns: [
        {
          title: "监控名称:",
          dataIndex: "monitorName",
          align: "center",
        },
        {
          title: "监控范围",
          dataIndex: "monitorScope",
          align: "center",
        },
        {
          title: "监控类型",
          dataIndex: "monitorType",
          align: "center",
        },

        {
          title: "预警状态",
          dataIndex: "warningState",
          align: "center",
        },
        {
          title: "监控值",
          dataIndex: "carbonValue",
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          title: "监控时间",
          dataIndex: "createTime",
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
    this.getMonitoringRecordList();
    this.getMonitoringScope();
  },
  methods: {
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
    convertData(data) {
      return data.map((item) => ({
        title: item.name,
        value: item.id,
        key: item.id,
        children:
          item.children.length > 0 ? this.convertData(item.children) : [],
      }));
    },
    // 日期选择框
    timeChange(data, dateString) {
      this.queryList.dateStart=dateString[0] ;
      this.queryList.dateEnd= dateString[1]; 
    },
    getMonitoringRecordList(param) {
      let params ={
        pageNo:this.ipagination.current,
        pageSize:this.ipagination.pageSize,
      }
      const Type = {
        1: "碳排放",
        2: "标准煤",
        3: "电",
        4: "水",
        5: "天然气",
      };
      if(param)
     params = Object.assign(params, param);
      queryMonitoringRecordList(params).then((res) => {
        if (res.code == 200) {
          this.monitorSelectName=[]
          res.result.records.forEach((item) => {
            item.monitorType = Type[item.monitorType];
            item.carbonValue = item.monitorValue || "-";
            item.createTime = item.createTime || "-";
            item.monitorName=item.monitorName||'-'
            this.monitorSelectName.push(item.monitorName)
            item.unit =item.unit||'-';
            this.MonitoringStatus.forEach(param=>{
              if(param['status']==item.warningState){
                item.warningState=param['name']
              }
            })
          });
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
          this.monitorSelectName=this.monitorSelectName.filter((item,index)=> this.monitorSelectName.indexOf(item)==index);

        }
        this.searchBtn=false
      });
    },
    searchQuery() {
      let parameter = {
        monitorMapScope: this.selectMonitoringRange,
        monitorName: this.selectMonitoringName,
        monitorState: this.selectMonitoringStatus,
        monitorType: this.selectMonitoringType,
        dateStart:this.queryList.dateStart,
        dateEnd:this.queryList.dateEnd

      };
      this.searchBtn=true
      this.getMonitoringRecordList(parameter);
    },
    searchReset() {
      this.selectMonitoringName = undefined; //选中监控名称
      this.selectMonitoringType = undefined; //选中监控类型
      this.selectMonitoringStatus = undefined; //选中监控状态
      this.selectMonitoringRange = undefined; //选中监控范围
      this.monitorTime=undefined
      this.queryList= {
        dateEnd: "",
        dateStart: "",
        monitorMapScope: "",
        monitorName: "",
        monitorState: "",
        monitorType: "",
        pageNo: "",
        pageSize: "",
      },
      this.getMonitoringRecordList();
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
      let parameter = {
        monitorMapScope: this.selectMonitoringRange,
        monitorName: this.selectMonitoringName,
        monitorState: this.selectMonitoringStatus,
        monitorType: this.selectMonitoringType,
        dateStart:this.queryList.dateStart,
        dateEnd:this.queryList.dateEnd

      };
      this.getMonitoringRecordList(parameter);

      //   this.loadData();
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .ant-calendar-picker-input.ant-input{
  width: 446px !important;
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
</style>
