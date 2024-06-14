<template>
  <div class="main">
    <div class="headers">
      <div class="time statists" v-if="isAss">
        <!-- <span class="title">日期：</span> -->

        <a-select
          v-model="indextag"
          placeholder="请选择"
          style="width: 60px"
          @change="onChangeselect"
        >
          <a-select-option
            v-for="city in listBy"
            :key="city.format"
            :value="city.mode"
          >
            {{ city.format }}
          </a-select-option>
        </a-select>

        <div v-show="indextag == 0">
          <a-range-picker
            class="right-bottom"
            :placeholder="['开始时间', '截止时间']"
            format="YYYY"
            :value="value"
            :mode="mode2"
            @panelChange="handlePanelChange2"
          />
        </div>

        <div v-show="indextag == 1">
          <a-range-picker
            class="right-bottom"
            :placeholder="['开始时间', '截止时间']"
            format="YYYY-MM"
            :value="value"
            :mode="mode1"
            @panelChange="handlePanelChange1"
          />
        </div>

        <div v-show="indextag == 2">
          <a-range-picker
            :placeholder="['开始时间', '截止时间']"
            format="YYYY-MM-DD"
            :value="value"
            @change="onChange"
          />
        </div>
      </div>

      <div class="export">
        <div class="title">导出数据</div>
      </div>
    </div>
    <div class="contants statists">
      <div class="Hed right-bottom">
        <a-table
          :pagination="false"
          :columns="water"
          :data-source="topList"
          :scroll="{ y: 700 }"
          @change="handleTableChange"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      listBy: [
        {
          mode: 0,
          format: "年",
        },
        {
          mode: 1,
          format: "月",
        },
        {
          mode: 2,
          format: "日",
        },
      ],
      indextag: 2,
      // ipagination: {
      //   current: 1,
      //   pageSize: 10,
      //   pageSizeOptions: ["10", "20", "30"],
      //   showTotal: (total, range) => {
      //     return range[0] + "-" + range[1] + " 共" + total + "条";
      //   },
      //   showQuickJumper: true,
      //   showSizeChanger: true,
      //   total: 0,
      // },
      value: [],
      isAss: true,
      mode: ["day", "day"],

      mode1: ["month", "month"],
      mode2: ["year", "year"],
    };
  },

  props: ["water", "topList"],
  mounted() {
    this.value[0] = moment()
      .subtract(30, "days")
      .format("YYYY-MM-DD");
    this.value[1] = moment().format("YYYY-MM-DD");
    this.$emit("onTime", this.value, this.indextag + 1);
    this.$forceUpdate();
    console.log(this.topList, "this.topList");
  },
  methods: {
    // handleTableChange(pagination, filters, sorter) {
    //   //分页、排序、筛选变化时触发
    //   //TODO 筛选

    //   if (Object.keys(sorter).length > 0) {
    //     this.sortedInfo = this.sortedInfo = sorter;
    //   } else {
    //     this.sortedInfo = {};
    //   }
    //   this.ipagination = pagination;
    //   this.$emit('tableChange', this.ipagination);
    //   //   this.loadData();
    // },

    handlePanelChange1(value, mode) {
      console.log(value, mode, "这里是回调");
      this.value[0] = moment(value[0]).format("yyyy-MM");
      this.value[1] = moment(value[1]).format("yyyy-MM");
      console.log(this.value);
      this.$emit("onTime", this.value, this.indextag + 1);
      this.$forceUpdate();
    },
    handlePanelChange2(value, mode) {
      console.log(value, mode, "这里是回调");
      this.value[0] = moment(value[0]).format("yyyy");
      this.value[1] = moment(value[1]).format("yyyy");
      console.log(this.value);
      this.$emit("onTime", this.value, this.indextag + 1);

      this.$forceUpdate();
    },
    onChange(date, dateString) {
      // console.log(date, dateString, "这里是回调onChange");
      this.value = dateString;
      this.$emit("onTime", dateString, this.indextag + 1);
      // console.log(date, dateString, "123123");
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
    },
    onChangeselect(value) {
      // console.log(value, this.indextag);
      this.isAss = false;
      console.log(this.value, "123123");
      this.value = [];
      this.indextag = value;
      setTimeout(() => {
        this.isAss = true;
      }, 100);
      this.$forceUpdate();

      // this.$emit("onTime", this.value, this.indextag + 1);
    },
  },

  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
};
</script>

<style lang="less">
.statists {
  display: flex;
  align-items: center;
  align-items: flex-start;
  .ant-input {
    width: 280px !important;
    height: 41px !important;
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 0px 3px 3px 0px !important;
    border: 1px solid #1ffff2 !important;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4) !important;
    border-left: none !important;
  }
  .ant-form-item-children {
    .ant-cascader-picker {
      background: transparent !important;
      line-height: 40px;
    }
    .ant-cascader-picker-label {
      color: rgba(255, 255, 255, 1);
    }
    .ant-input {
      background: rgba(31, 255, 242, 0.3) !important;
      border-radius: 3px 3px 3px 3px !important;
      border: 1px solid #1ffff2 !important;
      height: 35px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 1) !important;
    }
  }

  .ant-pagination-options-quick-jumper {
    color: rgba(31, 255, 242, 0.9) !important;
    line-height: 40px !important;
    input {
      margin: 0 10px !important;
      width: 38px !important;
      height: 25px !important;
      background: rgba(31, 255, 242, 0.12) !important;
      border-radius: 4px 4px 4px 4px !important;
      border: 1px solid rgba(31, 255, 242, 0.2) !important;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px !important;
      color: rgba(31, 255, 242, 0.9) !important;
    }
  }
  .ant-pagination-item-ellipsis {
    color: rgba(31, 255, 242, 0.9) !important;
  }

  .ant-form-item-control {
    line-height: 40px !important;
  }
  .ant-select-selection__rendered {
    line-height: 40px !important;
  }
  .ant-form-item-label {
    line-height: 40px !important;
  }
  .ant-select-selection {
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 3px 0px 0px 3px !important;
    border: 1px solid #1ffff2 !important;
    border-right: none !important;
    font-weight: 400;
    font-size: 16px;
    font-weight: 400;
    font-size: 14px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    margin: 0 !important;
    min-height: 41px !important;
  }
  .ant-pagination-total-text {
    position: absolute;
    left: 0;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px !important;
    color: #dbdbdb !important;
  }
  .ant-pagination-item-link {
    background: transparent !important;
    border: none !important;
    .anticon {
      color: #fff !important;
    }
  }
  .ant-pagination-item {
    background: rgba(31, 255, 242, 0.12) !important;
    border-radius: 4px 4px 4px 4px !important;
    border: 1px solid rgba(31, 255, 242, 0.2) !important;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px !important;
    color: rgba(31, 255, 242, 0.9) !important;
    a {
      color: rgba(31, 255, 242, 0.9) !important;
    }
  }
  .ant-pagination-item-active {
    a {
      color: #fff !important;
    }
  }
}
</style>

<style scoped lang="less">
.headers {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background-color: #013038;
  .time {
    .title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      line-height: 12px;
    }
  }
  .export {
    width: 146px;
    height: 37px;
    background: #00ada3;
    border-radius: 3px 3px 3px 3px;
    .title {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 16px;
      color: #ffffff;
      line-height: 17px;
      margin: 10px 41px;
    }
  }
}
.contants {
  width: 1307px;
  height: 740px;
  border-radius: 0px 0px 0px 0px;
  margin-top: 24px;
  .footer {
    display: flex;
    justify-content: space-between;
    .footer-left {
      height: 22px;
      margin: 102px 0 0 0;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #777777;
      line-height: 22px;
    }
    .footer-right {
      padding: 0 0 0 150px;
      width: 656px;
      height: 42px;
      border-radius: 0px 0px 0px 0px;
      margin: 92px 0 0 0;
    }
  }
}
</style>
