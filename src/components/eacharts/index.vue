<template>
  <div class="bgs">
    <div class="flex" style="gap: 50px" v-if="type != 5 && type != 6">
      <div class="times">
        <!-- <a-select
          v-model="indextag"
          placeholder="请选择"
          style="width: 60px"
        >
          <a-select-option
            v-for="city in listBy"
            :key="city.format"
            :value="city.mode"
          >
            {{ city.format }}
          </a-select-option>
        </a-select> -->
        日期：
        <a-range-picker
          @change="onChange"
          @panelChange="handlePanelChange2"
          :value="value"
        >
          <img src="@assets/hotai/rili.png" slot="suffixIcon" alt="" />
        </a-range-picker>
      </div>
      <div class="flex" style="gap: 24px" v-if="type == 1 && !lisws">
        <div
          v-for="(item, index) in listArr"
          :key="index"
          :class="{ selcrt: indexofs != item.id, selcrt1: indexofs == item.id }"
          @click="ontable(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="flex" style="gap: 24px" v-if="lisws == 1">
        <div
          v-for="(item, index) in lissetArr"
          :key="index"
          :class="{
            selcrt: energyofs != item.id,
            selcrt1: energyofs == item.id,
          }"
          @click="onenergy(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
      <div class="flex" style="gap: 24px" v-if="lisws == 2">
        <div
          v-for="(item, index) in tanzuji"
          :key="index"
          :class="{
            selcrt: indexofs != item.id,
            selcrt1: indexofs == item.id,
          }"
          @click="ontable(item.id)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>

    <div class="flex" v-if="type == 1">
      <div id="leftChart" class="leftChart" v-if="isaSS"></div>
      <div
        id="rightChart"
        class="rightChart"
        v-if="indexofs == '' && isaSS"
      ></div>
      <div v-if="indexofs == 1">
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{ topList.totalCost != null ? topList.totalCost : 0 }}
            </div>
            <div class="danwie">KWh</div>
          </div>
          <div class="values1">总耗能</div>
        </div>
        <div class="maring-w">
          <div class="flex">
            <div class="leftTiao"></div>

            <div class="values">
              {{ topList.convert != null ? topList.convert : 0 }}
            </div>
            <div class="danwie">t</div>
          </div>
          <div class="values1">折标煤</div>
        </div>
      </div>
      <div v-if="indexofs == 2">
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{ topList.totalCost != null ? topList.totalCost : 0 }}
            </div>
            <div class="danwie">t</div>
          </div>
          <div class="values1">总耗能</div>
        </div>
      </div>
      <div v-if="indexofs == 3">
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{ topList.totalCost != null ? topList.totalCost : 0 }}
            </div>
            <div class="danwie">M^3</div>
          </div>
          <div class="values1">总产能</div>
        </div>
        <div class="maring-w">
          <div class="flex">
            <div class="leftTiao"></div>

            <div class="values">
              {{ topList.convert != null ? topList.convert : 0 }}
            </div>
            <div class="danwie">t</div>
          </div>
          <div class="values1">折标煤</div>
        </div>
      </div>
    </div>
    <div class="flex" v-if="type == 2">
      <div>
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">{{ topList.totalValue }}</div>
            <div class="danwie">KWh</div>
          </div>
          <div class="values1">总产能</div>
        </div>
        <div class="maring-w">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">{{ topList.convertTotalValue }}</div>
            <div class="danwie">t</div>
          </div>
          <div class="values1">拆标煤</div>
        </div>
      </div>

      <div id="photovoltaicRight" class="photovoltaicRight"></div>
    </div>
    <div v-if="type == 3" class="flex">
      <div v-if="lisws == 3">
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{ topList.total != null ? topList.total : 0 }}
            </div>
            <div class="danwie">KWh</div>
          </div>
          <div class="values1">总产能</div>
        </div>
        <div class="maring-w" v-if="indexofs != 2">
          <div class="flex">
            <div class="leftTiao"></div>

            <div class="values">
              {{ topList.totalCo2 != null ? topList.totalCo2 : 0 }}
            </div>
            <div class="danwie">tCO2</div>
          </div>
          <div class="values1">节碳</div>
        </div>
      </div>
      <div id="energyRight" class="energyRight"></div>
    </div>

    <div class="flex" v-if="type == 4">
      <div class="tops">
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{
                topList.totalCarbonFootprint != null
                  ? topList.totalCarbonFootprint
                  : 0
              }}
            </div>
            <div class="danwie">tCO2</div>
          </div>
          <div class="values1">总碳排放</div>
        </div>
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{
                topList.electricCarbonFootprint != null
                  ? topList.electricCarbonFootprint
                  : 0
              }}
            </div>
            <div class="danwie">tCO2</div>
          </div>
          <div class="values1">电碳排放</div>
        </div>
        <div class="maring-w1">
          <div class="flex">
            <div class="leftTiao"></div>
            <div class="values">
              {{
                topList.gasCarbonFootprint != null
                  ? topList.gasCarbonFootprint
                  : 0
              }}
            </div>
            <div class="danwie">tCO2</div>
          </div>
          <div class="values1">气碳排放</div>
        </div>
      </div>

      <div id="carbonline" class="carbonline"></div>
    </div>
    <div class="flex" v-if="type == 5">
      <div id="energyRight" class="energyRight"></div>
    </div>
    <div class="flex" v-if="type == 6">
      <div id="energyRight" class="energyRight"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { eachar } from "./index";
import moment from "moment";
export default {
  mixins: [eachar],

  props: ["type", "topList", "lisws", "dateType"],
  data() {
    return {
      indextag: 0,
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
      pickerList: [
        {
          mode: ["year", "year"],
          format: "YYYY",
        },
        {
          mode: ["month", "month"],
          format: "YYYY-MM",
        },
        {
          mode: ["day", "day"],
          format: "YYYY-MM-DD",
        },
      ],
      listArr: [
        {
          id: "",
          text: "全部",
        },
        {
          id: 1,
          text: "电",
        },
        {
          id: 2,
          text: "水",
        },
        {
          id: 3,
          text: "天然气",
        },
      ],
      lissetArr: [
        {
          id: 1,
          text: "电",
        },
        {
          id: 2,
          text: "水",
        },
        {
          id: 3,
          text: "天然气",
        },
      ],
      tanzuji: [
        {
          id: "",
          text: "全部",
        },
        {
          id: 1,
          text: "电",
        },
        {
          id: 3,
          text: "天然气",
        },
      ],
      indexofs: "",
      energyofs: 1,
      value: [],
      isaSS: true,
    };
  },
  watch: {
    topList: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(
          "数据发生变化：",
          newVal,
          this.type,
          this.lisws,
          this.topList
        );

        setTimeout(() => {
          if (this.type == 1) {
            if (this.lisws == 2) {
              if (Object.keys(this.topList).length > 0) {
                if (
                  this.topList.barData != null &&
                  this.topList.barData.length > 0
                ) {
                  console.log("数据发生变化1：", this.listBar);

                  this.listBar.xAxis.data = [];
                  this.listBar.series[0].data = [];
                  if (this.listBar.series.length > 1) {
                    this.listBar.series[1].data = [];
                  }
                  this.topList.barData.forEach((element) => {
                    this.listBar.xAxis.data.push(element.name);
                    if (this.listBar.series[0].name == "电") {
                      this.listBar.series[0].data.push(element.carbon);
                    } else if (this.listBar.series[0].name == "天然气") {
                      this.listBar.series[0].data.push(element.gasCarbon);
                    }

                    if (this.listBar.series.length > 1) {
                      this.listBar.series[1].data.push(element.gasCarbon);
                    }
                  });
                  console.log(this.listBar.series, "this.listBar.series");
                  var myChart = echarts.init(
                    document.getElementById("leftChart")
                  );
                  myChart.setOption(this.listBar);
                } else {
                  this.listBar.xAxis.data = [];
                  this.listBar.series[0].data = [];
                  this.listBar.series[1].data = [];
                }
              }

              if (Object.keys(this.topList).length > 0) {
                if (
                  this.topList.pieData != null &&
                  this.topList.pieData.length > 0
                ) {
                  this.listPar.series[0].data = [];
                  this.topList.pieData.forEach((element) => {
                    this.listPar.series[0].data.push({
                      value: element.carbon,
                      name:
                        element.measureType == 1
                          ? "电"
                          : element.measureType == 3
                          ? "天然气"
                          : "",
                    });
                  });
                } else {
                  this.listPar.series[0].data = [];
                }
              } else {
                this.listPar.series[0].data = [];
              }
            } else {
              if (Object.keys(this.topList).length > 0) {
                if (
                  this.topList.tableRes != null &&
                  this.topList.tableRes.length > 0
                ) {
                  this.listBar.xAxis.data = [];
                  this.listBar.series[0].data = [];
                  if (this.listBar.series.length > 1) {
                    this.listBar.series[1].data = [];
                  }
                  this.topList.tableRes.forEach((element) => {
                    this.listBar.xAxis.data.push(element.mapName);
                    if (this.listBar.series[0].name == "水") {
                      this.listBar.series[0].data.push(element.waterCost);
                    } else if (this.listBar.series[0].name == "电") {
                      this.listBar.series[0].data.push(element.eleConvert);
                    } else if (this.listBar.series[0].name == "天然气") {
                      this.listBar.series[0].data.push(element.gasConvert);
                    }
                    if (this.listBar.series.length > 1) {
                      this.listBar.series[1].data.push(element.gasConvert);
                    }
                  });
                } else {
                  this.listBar.xAxis.data = [];
                  this.listBar.series[0].data = [];
                  if (this.listBar.series.length > 1) {
                    this.listBar.series[1].data = [];
                  }
                }
                console.log("数据发生变化1：", this.listBar);
              } else {
                this.listBar.series[0].data = [];
                if (this.listBar.series.length > 1) {
                  this.listBar.series[1].data = [];
                }
              }
              if (Object.keys(this.topList).length > 0) {
                if (
                  this.topList.ringRes != null &&
                  this.topList.ringRes.length > 0
                ) {
                  this.listPar.series[0].data = [];
                  this.topList.ringRes.forEach((element) => {
                    this.listPar.series[0].data.push({
                      value: element.productCost,
                      name: element.productName,
                    });
                  });
                } else {
                  this.listPar.series[0].data = [];
                }
              } else {
                this.listPar.series[0].data = [];
              }
            }
            console.log(this.listPar, "this.listPar");
            var myChart = echarts.init(document.getElementById("leftChart"));
            myChart.setOption(this.listBar);
            var rightChart = echarts.init(
              document.getElementById("rightChart")
            );
            rightChart.setOption(this.listPar);
          } else if (this.type == 2) {
            if (this.topList.list.length > 0) {
              this.photovoltaicBar.xAxis.data = [];
              this.photovoltaicBar.series[0].data = [];

              this.topList.list.forEach((element) => {
                this.photovoltaicBar.xAxis.data.push(element.name);
                this.photovoltaicBar.series[0].data.push(element.value);
              });
            } else {
              this.photovoltaicBar.xAxis.data = [];
              this.photovoltaicBar.series[0].data = [];
            }
            var photovoltaicRight = echarts.init(
              document.getElementById("photovoltaicRight")
            );
            photovoltaicRight.setOption(this.photovoltaicBar);
          } else if (this.type == 3) {
            var energyRight = echarts.init(
              document.getElementById("energyRight")
            );
            if (this.lisws == 1) {
              
              if (this.topList.length > 0) {
                this.energyline.xAxis.data = [];
                this.energyline.title = [];
                if (this.energyofs == 1) {
                  this.energyline.series[0].name = "电(KWh)";
                } else if (this.energyofs == 2) {
                  this.energyline.series[0].name = "水(t)";
                } else if (this.energyofs == 3) {
                  this.energyline.series[0].name = "天然气(M^3)";
                }
                this.energyline.series[0].data = [];
                this.topList.forEach((element) => {
                  this.energyline.xAxis.data.push(element.time);
                  this.energyline.series[0].data.push(element.cost);
                });
              } else {
                this.energyline.xAxis.data = [];
                this.energyline.series[0].data = [];
              }
              energyRight.setOption(this.energyline);
            } else if (this.lisws == 3) {
              if (Object.keys(this.topList).length > 0) {
                if (this.topList.barData.length > 0) {
                  this.listBar.xAxis.data = [];
                  this.listBar.series = [
                    {
                      data: [],
                      type: "bar",
                    },
                  ];
                  this.topList.barData.forEach((element) => {
                    this.listBar.xAxis.data.push(element.name);
                    this.listBar.series[0].data.push(element.carbon);
                  });
                } else {
                  this.listBar.xAxis.data = [];
                  this.listBar.series[0].data = [];
                }
              } else {
                this.listBar.xAxis.data = [];
                this.listBar.series[0].data = [];
              }
              energyRight.setOption(this.listBar);
            } else {
              if (this.topList.length > 0) {
                this.energyline.xAxis.data = [];
                this.energyline.series[0].data = [];
                this.topList.forEach((element) => {
                  this.energyline.xAxis.data.push(element.time);
                  this.energyline.series[0].data.push(element.cost);
                });
              } else {
                this.energyline.xAxis.data = [];
                this.energyline.series[0].data = [];
              }
              energyRight.setOption(this.energyline);
            }
            console.log(this.listBar, "sju1");
           
          
          } else if (this.type == 4) {
            var carbonline = echarts.init(
              document.getElementById("carbonline")
            );
            if (this.topList.data.length > 0) {
              this.listBar.xAxis.data = [];
              this.listBar.series[0] = {
                data: [],
                type: "bar",
              };
              this.topList.data.forEach((element) => {
                this.listBar.xAxis.data.push(element.name);
                this.listBar.series[0].data.push(
                  (element.cost + element.gasCarbon).toFixed(2)
                );
              });
            } else {
              this.listBar.xAxis.data = [];
              this.listBar.series[0].data = [];
            }
            carbonline.setOption(this.listBar);
          } else if (this.type == 5) {
            this.deiviceline.title = [];
            if (Object.keys(this.topList).length !== 0) {
              if (this.topList.now.length > 0 || this.topList.last.length > 0) {
                if (this.dateType == "2") {
                  this.deiviceline.series[0].name = "当年";
                  this.deiviceline.series[1].name = "前一年";
                } else if (this.dateType == "3") {
                  this.deiviceline.series[0].name = "当月";
                  this.deiviceline.series[1].name = "前一月";
                } else if (this.dateType == "4") {
                  this.deiviceline.series[0].name = "当日";
                  this.deiviceline.series[1].name = "前一日";
                }
                this.deiviceline.xAxis.data = [];
                this.deiviceline.series[0].data = [];
                this.deiviceline.series[1].data = [];
                this.topList.now.forEach((element) => {
                  // console.log(this.deiviceline,'cshi');
                  if (this.topList.now.length > 0) {
                    if (this.dateType == 4) {
                      this.deiviceline.xAxis.data.push(
                        element.reportDate
                          .split(" ")
                          [element.reportDate.split(" ").length - 1].toString()
                      );
                    } else {
                      this.deiviceline.xAxis.data.push(
                        element.reportDate
                          .split("-")
                          [element.reportDate.split("-").length - 1].toString()
                      );
                    }
                  }
                  this.deiviceline.series[0].data.push(
                    element.energyDissipation
                  );
                });
                this.topList.last.forEach((item) => {
                  if (
                    this.deiviceline.xAxis.data.length == 0 ||
                    this.topList.last.length > 0
                  ) {
                    if (this.dateType == 4) {
                      this.deiviceline.xAxis.data.push(
                        item.reportDate
                          .split(" ")
                          [item.reportDate.split(" ").length - 1].toString()
                      );
                    } else {
                      this.deiviceline.xAxis.data.push(
                        item.reportDate
                          .split("-")
                          [item.reportDate.split("-").length - 1].toString()
                      );
                    }
                  }
                  this.deiviceline.series[1].data.push(item.energyDissipation);
                });
                this.deiviceline.xAxis.data =
                  this.deiviceline.xAxis.data.filter(
                    (item, index) =>
                      this.deiviceline.xAxis.data.indexOf(item) === index
                  );
                this.deiviceline.title.push({
                  text: "单位：KWh",
                  left: 0,
                  top: "5%",
                  textStyle: {
                    fontSize: 14,
                    color: "#A2B0B8",
                  },
                });
              } else {
                this.deiviceline.xAxis.data = [];
                this.deiviceline.series[0].data = [];
                this.deiviceline.series[1].data = [];
              }
            }

            var energyRight = echarts.init(
              document.getElementById("energyRight")
            );
            energyRight.setOption(this.deiviceline);
          } else if (this.type == 6) {
            this.powerline.title.push({
              text: "单位: KW",
              left: 0,
              top: "5%",
              textStyle: {
                fontSize: 14,
                color: "#A2B0B8",
              },
            });
            this.powerline.series[0].data = [12, 14, 45, 23];
            this.powerline.xAxis.data = ["0时", "1时", "2时", "4时"];
            this.powerline.series[1].data = [15, 16, 35, 13];
            var energyRight = echarts.init(
              document.getElementById("energyRight")
            );
            energyRight.setOption(this.powerline);
          }
          this.$forceUpdate();
        }, 1000);
      },
    },
  },
  created() {},
  mounted() {
    console.log(this.lisws);

    this.value[0] = moment().subtract(30, "days").format("YYYY-MM-DD");
    this.value[1] = moment().format("YYYY-MM-DD");
    this.$emit("onTime", this.value);
  },
  methods: {
    ontable(itemn) {
      console.log(itemn);
      this.indexofs = itemn;

      if (!this.lisws || (this.lisws == 2 && this.type == 1)) {
        this.listBar.xAxis.data = [];
        this.listBar.series = [];
        this.isaSS = false;

        if (!itemn) {
          this.listBar.series = [
            {
              name: "电",
              data: [],
              type: "bar",
            },
            {
              name: "天然气",
              data: [],
              type: "bar",
            },
          ];
        } else if (itemn == 1) {
          this.listBar.series = [
            {
              name: "电",
              data: [],
              type: "bar",
            },
          ];
        } else if (itemn == 2) {
          this.listBar.series = [
            {
              name: "水",
              data: [],
              type: "bar",
            },
          ];
        } else if (itemn == 3) {
          this.listBar.series = [
            {
              name: "天然气",
              data: [],
              type: "bar",
            },
          ];
        }
        setTimeout(() => {
          this.isaSS = true;
        }, 100);
      }
      this.$forceUpdate();
      this.$emit("onIndexOfes", itemn);
    },

    onenergy(itemn) {
      console.log(this.value);
      this.energyofs = itemn;
      this.$emit("onIndexOfes", itemn);
    },

    handlePanelChange2(value, mode) {
      console.log(this.value);

      this.value = value;
    },
    onChange(date, dateString) {
      this.value = dateString;
      this.$emit("onTime", dateString);
      console.log(date, dateString, "123123");
    },
  },
};
</script>
<style lang="less"></style>
<style scoped lang="less">
.smapr {
  margin-left: 45px;
}
@font-face {
  font-family: DINBold;
  src: url("../../assets/DIN-Bold.otf") format("truetype");
}
.tops {
  padding-top: 10px;
}
.energyRight {
  width: 98%;
  height: 312px;
  line-height: 1;
  margin-left: 50px;
}
.photovoltaicRight {
  width: 1000px;
  height: 312px;
  line-height: 1;
  margin-left: 24px;
}

.carbonline {
  width: 1000px;
  height: 312px;
  line-height: 1;
  margin-left: 24px;
}
.rightChart {
  width: 402px;
  height: 312px;
  line-height: 1;
}
.leftChart {
  width: 752px;
  height: 312px;
  line-height: 1;
  margin-right: 55px;
}
.maring-w {
  margin-top: 108px;
}
.maring-w1 {
  margin-bottom: 40px;
}
.flex1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.selcrt {
  width: 88px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #1ffff2;
  background: url("../../assets/hotai/img.png");
  background-size: 100%;
  background-repeat: no-repeat;
}

.leftTiao {
  width: 6px;
  height: 21px;
  background: #1ffff2;
  border-radius: 0px 0px 0px 0px;
  margin-right: 14px;
  line-height: 1;
}
.values {
  font-family: DINBold;
  font-weight: bold;
  font-size: 32px;
  color: #ffffff;
  margin-right: 10px;
  line-height: 1;
}

.values1 {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 24px;
  color: #ffffff;
  line-height: 1;
  margin-left: 19px;
}
.danwie {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.65);
}
.selcrt1 {
  width: 88px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  background: url("../../assets/hotai/img1.png");
  background-size: 100%;
  background-repeat: no-repeat;
}
.flex {
  display: flex;
  align-items: center;
}
.times {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
}
</style>
