<template>
  <div>
    <div class="title">
      <div @click.prevent="BackButton" style="width: 30px; margin-right:16px">
        <img src="../../../assets/Frame 265@2x.png" alt="" />
      </div>
      设备名称
    </div>
    <div class="bg tables ">
      <div class="left">
        <div class="left-top">
          <div>
            <div class="deviceLabel">设备名称： {{ details.name }}</div>
            <div class="deviceLabel">设备位置：{{ details.locationName }}</div>
            <div class="deviceLabel date">
              <span style="align-self: center; width: 50px;"> 日期：</span>

              <div class="dateChange">
                <a-radio-group
                  v-model="dateType"
                  :options="options"
                  @change="dateSwitch"
                />

                <el-date-picker
                  v-if="dateType == '4'"
                  v-model="dateValue"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日"
                  @change="getData"
                >
                </el-date-picker>
                <el-date-picker
                  v-if="dateType == '3'"
                  v-model="monthValue"
                  type="month"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                  @change="getData"
                >
                </el-date-picker>
                <el-date-picker
                  v-if="dateType == '2'"
                  v-model="yearValue"
                  type="year"
                  format="yyyy"
                  value-format="yyyy"
                  placeholder="选择年"
                  @change="getData"
                >
                </el-date-picker>
                <!-- <button @click="logData">log</button> -->

                <br />
              </div>
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <div>
            <div class="bottom-contont">
              <div class="deviceLabel">{{ currentTitle }} (KWh)</div>
              <div
                style="font-family: DIN, DIN;
                  font-weight: bold;
                  font-size: 42px;
                  color: #FFFFFF;
                  line-height: 46px;"
              >
                {{ currentCost }}
              </div>
              <div
                v-show="this.currentCost"
                style="width: 245px;
height: 0px;
border: 1px solid rgba(100,110,125,0.5);"
              ></div>
              <div v-show="this.currentCost">
                <div class="Pervious">
                  <div>{{ currentPrevious }}</div>
                  <div>{{ currentPercent }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-top">
          <span class="deviceLabel">{{ energyDissipation }}</span>
          <eacharts :type="5" :dateType="dateType" :topList="topList" />
        </div>
        <div class="right-bottom">
          <a-table
            :pagination="false"
            :columns="columns"
            :data-source="data"
            :scroll="{ y: 280 }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tree from "@/components/Tree/tree.vue";
import eacharts from "@/components/eacharts/index.vue";
import { queryKeyDetails } from "@/api/Equipment";

export default {
  name: "keyEnergyDetails",
  components: { tree, eacharts },
  props: {
    details: {
      type: Object,
    },
  },
  data() {
    return {
      energyDissipation: "当日耗能曲线",
      topList: {},
      dateType: "4", //时间类型
      selectDate: "",
      dateValue: "", //时间类型
      monthValue: "", //时间类型
      yearValue: "", //时间类型
      currentTitle: "日总能耗",
      currentCost: "",
      currentPrevious: "同一日同期",
      currentPercent: "",
      options: [
        { label: "年", value: "2" },
        { label: "月", value: "3" },
        { label: "日", value: "4" },
      ],

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
          title: "时间",
          dataIndex: "date",
          align: "center",
        },
        {
          title: "耗能",
          dataIndex: "cost",
          align: "center",
        },
        {
          title: "单位",
          dataIndex: "unit",
          align: "center",
        },
        {
          title: "昨日同期",
          dataIndex: "percent",
          align: "center",
        },
      ],
      data: [],
      topList: {},
    };
  },
  created() {
    // this.historyPhotoCostlist();
    // this.getKeyDetails();
  },
  mounted() {
    this.getNowTime();
  },
  methods: {
    // 设置当前时间
    getNowTime() {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();
      this.dateValue = `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
      this.getData();
    },
    BackButton() {
      this.$emit("Toggle", false);
    },
    getData() {
      switch (this.dateType) {
        case "2":
          this.selectDate = this.yearValue;
          break;
        case "3":
          this.selectDate = this.monthValue;
          break;
        case "4":
          this.selectDate = this.dateValue;
          break;
      }
      if (this.selectDate) this.getKeyDetails();
    },
    dateSwitch() {
      switch (this.dateType) {
        case "2":
          this.currentTitle = "年总能耗";
          this.currentPrevious = "前一年同期";
          this.energyDissipation = "当年耗能曲线";
          this.columns[3].title='去年同期'
          
          break;
        case "3":
          this.currentTitle = "月总能耗";
          this.currentPrevious = "前一月同期";
          this.energyDissipation = "当月耗能曲线";
          this.columns[3].title='上月同期'
          break;
        case "4":
          this.currentTitle = "日总能耗";
          this.currentPrevious = "前一日同期";
          this.energyDissipation = "当日耗能曲线";
          this.columns[3].title='昨日同期'
          break;
      }
      this.yearValue = undefined;
      this.monthValue = undefined;
      this.dateValue = undefined;
      this.selectDate = undefined;
    },
    // 获取数据
    getKeyDetails() {
      let parameter = {
        id: this.details.id,
        type: this.dateType,
        date: this.selectDate,

      };
     console.log(this.details,'this.details');
      queryKeyDetails(parameter).then((res) => {
        if (res.code == 200) {
          console.log(res, "返回数据");
          res.result.tableList.forEach((item) => {
            if (this.dateType == "2") {
              item.date = item.date ? `${item.date}月` : "-";
            } else if (this.dateType == "3") {
              item.date = item.date ? `${item.date}日` : "-";
            } else if (this.dateType == "4") {
              item.date = item.date ? `${item.date}时` : "-";
            }

            item.cost = item.cost == null ? "-" : item.cost;
            if(this.details.deviceType=='电表'){
              item.unit = 'KWh';
            }else if(this.details.deviceType=='水表'){
              item.unit='t'
            }else if(this.details.deviceType=='天然气'){
              item.unit='M^3'
            }
            item.percent = !item.percent ? "-" : (item.percent > 0 ? `+${item.percent}%` : `${item.percent}%`);
          });
          this.data = res.result.tableList;
          this.currentCost = res.result.currentCost || "-";
          this.currentPercent="";
          let percent=parseFloat(res.result.currentPercent)
          console.log(percent,'percent');
          if (res.result.currentPercent==null) {
            this.currentPercent = "-";
          } else if (percent >= 0) {
            this.currentPercent = `+${percent}%`;
          } else if (percent < 0) {
            this.currentPercent = `${percent}%`;
          }
          this.$forceUpdate()
          this.topList = res.result.chartList;
        } else {
          this.$message.warning(res.message);
          this.data = [];
          this.currentCost = "-";
          this.currentPercent = "-";
          this.topList = {};
        }
      });
    },

    // handleTableChange(pagination, filters, sorter) {
    //   //分页、排序、筛选变化时触发
    //   //TODO 筛选
    //   console.log(pagination);
    //   if (Object.keys(sorter).length > 0) {
    //     this.sortedInfo = this.sortedInfo = sorter;
    //   } else {
    //     this.sortedInfo = {};
    //   }
    //   this.ipagination = pagination;
    //   //   this.loadData();
    // },
  },
};
</script>
<style lang="less">
.el-input--prefix .el-input__inner {
  background: #0d7678 !important;
  color: #fff;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 160px;
}
</style>
<style scoped lang="less">
.bg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.right-top {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
  .deviceLabel {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 20px;
  }
}
.right-bottom {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
}
.left {
  margin-right: 24px;

  display: flex;
  flex-direction: column;
  gap: 40px;
}
.left-top {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
  .deviceLabel {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;

    margin-bottom: 24px;
  }
  .date {
    display: flex;
    gap: 0px 33px;
    .dateChange {
      display: flex;
      height: 32px;
      flex-direction: column;
      gap: 10px;
    }
  }
}
.left-bottom {
  padding: 24px 24px 0;
  background: #053c43;
  flex: 1;
  .bottom-contont {
    display: flex;
    flex-direction: column;
    gap: 20px;
    .deviceLabel {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 20px;
      color: #ffffff;
      line-height: 20px;
    }
    .Pervious {
      width: 140px;
      display: flex;
      justify-content: space-between;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
    }
  }
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
  display: flex;
}
</style>
