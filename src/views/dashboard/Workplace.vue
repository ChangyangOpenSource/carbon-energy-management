<template>
  <div class="IndexBdcbg">
    <div class="IndexBdc-title">碳排放量分布</div>
    <div class="ilistw">
      <div class="danwei">单位：tCO2</div>
      <div class="salesProsbox">
        <div id="salesPros"></div>
        <img
          src="@assets/dataBigScreen/img12.png"
          class="salesProportionChartBg"
          alt=""
        />
        <div class="salesProportionChartListBox">
          <div
            class="salesProportionChartListItem"
            v-for="(item, index) in carbondistributionList.list"
            :key="index"
          >
            {{ item.percent + "%" }}
            <span class="sapn"> {{ item.value.toFixed(2) }}</span>
          </div>
        </div>
        <!-- <div class="pose">
          <div class="tit1">总量</div>
          <div class="texts">{{carbondistributionList.totalCost.toFixed(2)}}</div>
          <div class="texts">tCO2</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: ["carbondistributionList"],
  data() {
    return {
      list: ["20%", "20.61%", "23.12%", "20.61%", "15.67%"],
      color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
    };
  },
  mounted() {
    console.log(this.carbondistributionList, "carbondistributionList");
    this.onSalesProportionChart();
  },
  methods: {
    onSalesProportionChart(theData) {
      // 销售占比图表
      let theNav = ["镁锭", "兰炭", "煤焦油", "沫煤", "其他"];
      setTimeout(() => {
        let salesProportionChart = echarts.init(
          document.getElementById("salesPros")
        );
        let optionPie = {
          color: ["#1FC6FF", "#59FFFF", "#F5E74F", "#FF386B", "#FFFFFF"],
          tooltip: {
            trigger: "item",
          },

          legend: {
            show: true,
            icon: "circle",
            type: "plain",
            left: "60%",
            top: "middle",
            width: 50,
            textStyle: {
              color: "#fff",
            },
          },
          series: [
            {
              type: "pie",
              center: ["30%", "50%"], //饼图位置
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center", //文字显示在中间
                  align: "center",
                  verticalAlign: "middle",
                  textStyle: {
                    //设置文字样式
                    fontSize: "0",
                  },
                },
                emphasis: {
                  show: true, //文字至于中间时，这里需为true
                  textStyle: {
                    //设置文字样式
                    fontSize: "14",
                    color: "rgba(145,213,255,0.85)",
                  },
                  formatter: function ({ data }) {
                    console.log(data);
                    //此处重点，其中定义的 b,c,d 是用于下面的 rich来单独设置样式，因为这里不支持 HTML标签
                    return `{c|${data.name}}\n {d|}{b| ${
                      data.value ? data.value.toFixed(2) : "0"
                    }} \n {c|tCO2}`;
                  },
                  //样式设置
                  rich: {
                    b: {
                      //value 文字样式
                      fontSize: 21,
                      fontWeight: "bold",
                      color: "rgba(255,255,255,1)",
                      textAlign: "center",
                    },
                    c: {
                      //name 文字样式
                      lineHeight: 22,
                      fontSize: 18,
                      fontWeight: 400,
                      color: "#B4C0CC",
                      textAlign: "center",
                    },
                    d: {
                      //price 文字样式
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#fff",
                      verticalAlign: "bottom",
                    },
                  },
                },
              },
              itemStyle: {
                borderRadius: 3,
                borderColor: "#031731",
                borderWidth: 1,
              },
              labelLine: {
                show: false,
              },
              data: this.carbondistributionList.list,
            },
          ],
        };
        salesProportionChart.setOption(optionPie);
      }, 300);
    },
  },
};
</script>

<style scoped lang='less'>
@font-face {
  font-family: DINBold;
  src: url("../../assets/优设标题黑.TTF") format("truetype");
}
.salesProportionChartListBox {
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translateY(-50%);
  width: 50px;
}

.salesProportionChartListItem {
  height: 26px;
  font-weight: 400;
  font-size: 16px;
  color: #9bb7d4;
  display: flex;
}

.sapn {
  font-weight: 600;
  font-size: 16px;
  color: #ffffff !important;
  margin-left: 15px;
}

.tit1 {
  font-weight: 400;
  font-size: 16px;
  color: #9bb7d4;
}
.texts {
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
}
.pose {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 32%;
  left: 24%;
}
.salesProsbox {
  position: relative;
  margin: 0 auto;
  #salesPros {
    width: 400px;
    height: 230px;
  }
  .salesProportionChartBg {
    position: absolute;
    top: 50%;
    left: 5.7%;
    transform: translateY(-50%);
    width: 190px;
    height: 190px;
    animation: rotateAnimation 5s linear infinite; /* 指定动画名称、持续时间、速度曲线和重复次数 */
  }
}

@keyframes rotateAnimation {
  0% {
    /* from关键帧，初始状态 */
    transform: translateY(-50%) rotate(0deg);
  }

  100% {
    /* to关键帧，结束状态 */
    transform: translateY(-50%) rotate(360deg);
  }
}

.ilistw {
  margin-top: 27px;

  padding: 0 18px;
  .danwei {
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: 400;
    font-size: 14px;
    color: #a2b0b8;
  }
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
}
</style>
