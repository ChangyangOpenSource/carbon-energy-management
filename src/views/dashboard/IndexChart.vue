<template>
  <div class="IndexBdcbg">
    <div class="IndexBdc-title">碳排放量分布</div>
    <div class="ilistw">
        <div class="post">
          <div id="salesProportionChart"></div>
          <div class="div1">电</div>
        </div>
        <div>
          <div v-for="(item, index) in list" :key="index" class="list">
            <div class="border" :style="{ background: color[index] }"></div>
            {{ index }}区&nbsp;&nbsp;&nbsp;{{ item }}
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props:{
    message:Object,
  },
  data() {
    return {
      list: ["20%", "20.61%", "23.12%", "20.61%", "15.67%"],
      color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
    };
  },
  mounted() {
    this.onsalepa();
  },
  methods: {
    onsalepa() {
      let salesProportionChart = echarts.init(
        document.getElementById("salesProportionChart")
      );
      let optionPie = {
        color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "销售占比",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "A" },
              { value: 735, name: "B" },
              { value: 580, name: "C" },
              { value: 484, name: "D" },
              { value: 300, name: "E" },
            ],
          },
        ],
      };
      salesProportionChart.setOption(optionPie);
    },
  },
};
</script>

<style scoped lang='less'>
@font-face {
  font-family: DINBold;
  src: url("../../assets/优设标题黑.TTF") format("truetype");
}
.ilistw {
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .lie {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.list {
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  align-items: center;
}
.border {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}
.IndexBdcbg {
  width: 469px;
  height: 278px;
  background-image: url("../../assets/dataBigScreen/img8.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .IndexBdc-title {
    font-family: DINBold;
    font-weight: 400;
    font-size: 20px;
    color: #ffffff;
    line-height: 1;
    margin-left: 31px;
    padding-top: 6px;
  }
  .post {
    position: relative;
    width: max-content;
    .div1 {
      font-family: DINBold;
      font-weight: 400;
      font-size: 20px;
      color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -10px;
      margin-top: -15px;
    }
  }
  #salesProportionChart {
    z-index: 10;
    width: 140px;
    height: 140px;
  }
}
</style>
