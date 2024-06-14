<template>
  <div class="IndexBdcbgdw">
    <div class="IndexBdc-title">{{ title }}</div>
    <div class="censter">
      <div class="salesProport">
        <div id="salesProport"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: ["carboist", "type", "title","dateType"],
  data() {
    return {
      message: [],
      indexof: 1,
      color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
    };
  },
  mounted() {
    if (this.type === 1) {
      console.log(this.carboist, this.dateType,"carboist");

      setTimeout(() => {
        let arr = []
        let arr1 = []
        let arr2 = []
        this.carboist[0].data.forEach((res) => {
          if(this.dateType===4){
            arr.push(
            (res.reportDate.split(" ")[res.reportDate.split(" ").length - 1]).toString()
          )
          }else {
            arr.push(
            (res.reportDate.split("-")[res.reportDate.split("-").length - 1]).toString()
          )
          }
        
          arr1.push(res.carbonValue);
        });
        console.log(arr,'时间');
        this.carboist[1].data.forEach((res) => {
          arr2.push(res.carbonValue);
        });
        let salesTrendChart = echarts.init(
          document.getElementById("salesProport")
        );
        let optionLine = {
          color: ["#00FFE0", "#0AA7FF"],
          title: [
            {
              text: "单位：tCO2",
              left: 0,
              top: "0%",
              textStyle: {
                fontSize: 14,
                color: "#A2B0B8",
              },
            },
          ],
          grid: {
            top: "15%", //
            left: "0%", //默认10%
            right: "4%", //默认10%
            bottom: "10%", //默认60
            containLabel: true,
            //grid区域是否包含坐标轴的刻度标签
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            splitLine: {
              show: false, // 不显示网格线
            },
            axisLabel: {
              interval: 0, // 显示所有刻度
            },
            data: arr.reverse(),
          },
          yAxis: {
            type: "value",
            splitLine: {
              //网格线
              show: true, //是否显示
              lineStyle: {
                //网格线样式
                color: "#2C3441", //网格线颜色
                width: 1, //网格线的加粗程度
                type: "dashed", //网格线类型
              },
            },
          },
          series: [
            {
              name: "电",
              data: arr1.reverse(),
              type: "line",
              symbol: "none",
              areaStyle: {
                color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(0,255,224,0.5)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0,255,224,0.5)",
                  },
                ]),
              },
            },
            {
              name: "天燃气",
              data: arr2.reverse(),
              type: "line",
              symbol: "none",
              areaStyle: {
                color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(10,167,255,0.5)",
                  },
                  {
                    offset: 1,
                    color: "rgba(10,167,255,0.5)",
                  },
                ]),
              },
            },
          ],
        };
        salesTrendChart.setOption(optionLine);
        this.$forceUpdate();
      }, 1000);
    }
  },

  watch: {
    carboist: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (this.type == 1) {
          console.log(newVal, "message");
        }

        //使用制定的配置项和数据显示图表
      },
    },
  },
  methods: {},
};
</script>

<style scoped lang="less">
@font-face {
  font-family: DINBold;
  src: url("../../assets/优设标题黑.TTF") format("truetype");
}
.flex {
  display: flex;
  align-items: center;
}
.censter {
  padding: 28px 24px 0;
  display: flex;
  flex-direction: column;
}

.jusc {
  justify-content: space-between;
}
.IndexBdcbgdw {
  flex: 1;

  height: 360px;
  background-image: url("../../assets/dataBigScreen/img10.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .danwei {
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: 400;
    font-size: 14px;
    color: #a2b0b8;
  }
  .moren {
    width: 40px;
    height: 25px;
    background: rgba(31, 255, 242, 0.3);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid rgba(31, 255, 242, 0.5);
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: bold;
    font-size: 14px;
    color: rgba(250, 250, 250, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .xuanz {
    background: rgba(31, 255, 242, 0.3) !important;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #1ffff2 !important;
    color: #ffffff !important;
  }
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

.salesProport {
  width: 100%;
  height: 250px;

  #salesProport {
    width: 100%;
    height: 300px;
  }
}
</style>
