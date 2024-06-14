<template>
  <div class="IndexBdcbg">
    <div class="IndexBdc-title">能源分布</div>
    <div class="ilistw">
      <div
        class="lie"
        v-for="(vlaue, inds) in energyDistributionList"
        :key="inds"
      >
        <div class="list23">总值:{{ vlaue.total }}{{vlaue.name=='电'?'KWh':vlaue.name=='水'?'t':'m³'}}</div>

        <div class="post">
          <div :id="'electricityChart' + inds" class="eachres"></div>
          <div
            :class="{
              div1: vlaue.name.length == 1,
              div3: vlaue.name.length > 1,
            }"
          >
            {{ vlaue.name }}
          </div>
        </div>
        <div>
          <div v-for="(item, index) in vlaue.list" :key="index" class="list">
            <div class="border" :style="{ background: color[index] }"></div>
            {{ item.name }}&nbsp;&nbsp;&nbsp;{{ item.value }}%
          </div>
        </div>
      </div>
      <!-- <div class="lie" >
        <div class="post">
          <div id="naturalGasChart"></div>

          <div class="div2">{{energyDistributionList[1].name}}</div>
        </div>
        <div v-if="energyDistributionList.length > 0&&energyDistributionList.length >= 2">
          <div
            v-for="(item, index) in energyDistributionList[1].list"
            :key="index"
            class="list"
          >
            <div class="border" :style="{ background: color[index] }"></div>
            {{ item.name }}&nbsp;&nbsp;&nbsp;{{ item.value }}%
          </div>
        </div>
      </div>
      <div class="lie">
        <div class="post">
          <div id="waterChart"></div>

          <div class="div1">{{energyDistributionList[2].name}}</div>
        </div>
        <div
          v-if="
            energyDistributionList.length > 0 &&
            energyDistributionList.length >= 3
          "
        >
          <div
            v-for="(item, index) in energyDistributionList[2].list"
            :key="index"
            class="list"
          >
            <div class="border" :style="{ background: color[index] }"></div>
            {{ item.name }}&nbsp;&nbsp;&nbsp;{{ item.value }}%
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { nengYuanFenBu } from "@/api/tanpai.js";
export default {
  props: ["energyDistributionList"],
  data() {
    return {
      color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
      message: [],
      electricityList: [],
      naturalGasList: [],
      waterList: [],
      onsw: "",
      twosw: "",
      sesw: "",
    };
  },
  watch: {
    energyDistributionList: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(newVal, "energyDistributionList");
        newVal.forEach((res, index) => {
          setTimeout(() => {
            let electricityChart = echarts.init(
              document.getElementById("electricityChart" + index)
            );
            console.log(electricityChart);
            let optionPie1 = {
              color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
              tooltip: {
                trigger: "item",
              },
              series: [
                {
                  name: "",
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
                  // newVal[this.options1.findIndex(item => item.value === this.componentData[0].propValue.timeConm)].text
                  data: res.list,
                },
              ],
            };
            electricityChart.setOption(optionPie1);
            // let naturalGasChart = echarts.init(
            //   document.getElementById("naturalGasChart")
            // );
            // let optionPie2 = {
            //   color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
            //   tooltip: {
            //     trigger: "item",
            //   },
            //   series: [
            //     {
            //       name: "销售占比",
            //       type: "pie",
            //       radius: ["40%", "70%"],
            //       avoidLabelOverlap: false,
            //       label: {
            //         show: false,
            //         position: "center",
            //       },
            //       labelLine: {
            //         show: false,
            //       },
            //       data: this.twosw,
            //     },
            //   ],
            // };

            // let waterChart = echarts.init(
            //   document.getElementById("waterChart")
            // );
            // let optionPie3 = {
            //   color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
            //   tooltip: {
            //     trigger: "item",
            //   },
            //   series: [
            //     {
            //       name: "销售占比",
            //       type: "pie",
            //       radius: ["40%", "70%"],
            //       avoidLabelOverlap: false,
            //       label: {
            //         show: false,
            //         position: "center",
            //       },
            //       labelLine: {
            //         show: false,
            //       },
            //       data: this.sesw,
            //     },
            //   ],
            // };
            // console.log(electricityChart)
            // console.log(naturalGasChart)
            // console.log(waterChart)
            // if (newVal.length >= 1) {
            //   electricityChart.setOption(optionPie1);
            // }
            // if (newVal.length >= 2) {
            //   naturalGasChart.setOption(optionPie2);
            // }
            // if (newVal.length >= 3) {
            //   waterChart.setOption(optionPie3);
            // }
            this.$forceUpdate();
          }, 1000);
        });
      },
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
@font-face {
  font-family: DINBold;
  src: url("../../assets/优设标题黑.TTF") format("truetype");
}
.ilistw {
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;
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

.list23 {
  font-family: Source Han Sans CN, Source Han Sans CN;
  font-weight: bold;
  font-size: 16px;
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
  height: 361px;
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
    .div2 {
      font-family: DINBold;
      font-weight: 400;
      font-size: 20px;
      color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -9px;
      margin-top: -16px;
    }
    .div3 {
      font-family: DINBold;
      font-weight: 400;
      font-size: 20px;
      color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -16px;
      margin-top: -15px;
    }
  }
  .eachres {
    z-index: 10;
    width: 140px;
    height: 140px;
  }
  #electricityChart {
    z-index: 10;
    width: 140px;
    height: 140px;
  }
  #naturalGasChart {
    z-index: 10;
    width: 140px;
    height: 140px;
  }
  #waterChart {
    z-index: 10;
    width: 140px;
    height: 140px;
  }
}
</style>
