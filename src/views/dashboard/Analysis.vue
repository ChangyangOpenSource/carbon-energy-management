<template>
  <div class="bg" ref="passBox" @click="onDouble">
    <section class="topBox" v-if="navKey == 1">
      <div class="topBox_left">
        {{ theTime }}
        <div class="hrBox"></div>
        <span>{{ theDate }} {{ theWeekday ? `星期${theWeekday}` : "" }}</span>
        <div class="flex3">
          <div
            @click="ontables(2)"
            :class="{ moren: true, xuanz: indexof == 1 }"
          >
            年
          </div>
          <div
            @click="ontables(3)"
            :class="{ moren: true, xuanz: indexof == 2 }"
          >
            月
          </div>
          <div
            @click="ontables(4)"
            :class="{ moren: true, xuanz: indexof == 3 }"
          >
            日
          </div>
        </div>
      </div>
      <div class="topBox_center"><span>新强联数字化能碳管理中心</span></div>
      <div class="topBox_right">
        <div
          class="topBox_right_item hoverCursorPointer"
          :class="{ topBox_right_item_active: indexsOF === index }"
          v-for="(item, index) in treeList"
          :key="index"
          @click="onChangeNavKey(item, index)"
        >
          {{ item.name }}
        </div>
        <img
          src="@assets/dataBigScreen/img15.png"
          alt=""
          class="fullScreenBtn hoverCursorPointer"
          @click="onFullPage"
        />
      </div>
    </section>
    <section class="center" v-if="navKey == 1">
      <div class="center-top">
        <div class="center-bg">
          <div class="center-bgLeft">
            <div class="bgLeft-title">总能耗</div>
            <div class="bgLeft-text" v-if="TionEnergy != null">
              {{ TionEnergy.one.total ? TionEnergy.one.total.toFixed(2) : 0 }}
            </div>
            <div class="bgLeft-text" v-else>0t</div>
            <div class="bgLeft-text1">t折标煤 </div>
          </div>
          <div class="center-bgright">
            <div>
              <div>
                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">电(t)折标煤</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.one.top.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>

                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">天然气(t折标煤)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.one.bottom.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-top">
        <div class="center-bg">
          <div class="center-bgLeft">
            <div class="bgLeft-title">碳排放</div>
            <div class="bgLeft-text" v-if="TionEnergy != null">
              {{ TionEnergy.two.total.toFixed(2) }}
            </div>
            <div class="bgLeft-text" v-else>0</div>
            <div class="bgLeft-text1">(tCO2)</div>
          </div>
          <div class="center-bgright">
            <div>
              <div v-for="item in 4" :key="item">
                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">电(tCO2)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.two.top.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>

                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">天然气(tCO2)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.two.bottom.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-top">
        <div class="center-bg">
          <div class="center-bgLeft">
            <div class="bgLeft-title">碳足迹</div>
            <div class="bgLeft-text" v-if="TionEnergy != null">
              {{ TionEnergy.three.total.toFixed(2) }}
            </div>
            <div class="bgLeft-text" v-else>0</div>
            <div class="bgLeft-text1">(tCO2/t)</div>
          </div>
          <div class="center-bgright">
            <div>
              <div v-for="item in 4" :key="item">
                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">电(tCO2/t)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.three.top.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>

                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">天然气(tCO2/t)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.three.bottom.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-top">
        <div class="center-bg">
          <div class="center-bgLeft">
            <div class="bgLeft-title">年累计CO2排放</div>
            <div class="bgLeft-text" v-if="TionEnergy != null">
              {{ TionEnergy.four.total.toFixed(2) }}
            </div>
            <div class="bgLeft-text" v-else>0</div>
            <div class="bgLeft-text1">(tCO2)</div>
          </div>
          <div class="center-bgright">
            <div>
              <div v-for="item in 4" :key="item">
                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">能耗(tCO2)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.four.top.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>

                <div class="listBox4_item">
                  <img
                    src="@assets/dataBigScreen/img4.png"
                    class="listBox4_item_icon"
                    alt=""
                  />
                  <div>
                    <div class="listBox4_item_text2">光伏(tCO2)</div>
                    <div class="listBox4_item_text" v-if="TionEnergy != null">
                      {{ TionEnergy.four.bottom.toFixed(2) }}
                    </div>
                    <div class="listBox4_item_text" v-else>0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="fels" v-if="navKey == 1">
      <section class="wigth">
        <IndexBdc :energyDistributionList="energyDistributionList" />
      </section>
      <section class="flexw">
        <IndexTask
          v-if="carboist.length > 0"
          :carboist="carboist"
          :type="1"
          :title="'碳排放'"
          :dateType="form.dateType"
        />
        <IndexTask v-else :type="1" :title="'碳排放'" />
      </section>

      <section class="wigth">
        <Monitor
          :carbonFootprintList="carbonFootprintList"
          :type="1"
          :title="'碳足迹'"
        />
      </section>
    </section>
    <section class="bottoms" v-if="navKey == 1">
      <section class="wigth">
        <Workplace :carbondistributionList="carbondistributionList" />
      </section>
      <section class="flexw">
        <IndexGunfe
          :photovoltaicCarbonList="photovoltaicCarbonList"
          title="'光伏节碳'"
        />
      </section>
      <section class="wigth">
        <MonitorJikong
          :carbonMonitoringList="carbonMonitoringList"
          :type="2"
          :title="'碳排监控'"
        />
      </section>
    </section>
  </div>
</template>

<script>
import IndexBdc from "./IndexBdc";
import IndexChart from "./IndexChart";
import IndexTask from "./IndexTask";
import Monitor from "./Monitor";
import Workplace from "./Workplace";
import MonitorJikong from "./MonitorJikong";
import IndexGunfe from "./IndexGunfe";
import {
  guangFuJieTan,
  nengYuanFenBu,
  tanPaiFang,
  tanPaiFenBu,
  tanZuJi,
  cyMonitorWarningRecord,
  queryProductionEnergy,
  getByType,
} from "@/api/tanpai.js";

export default {
  data() {
    return {
      timer: "", //定时器
      indexof: 1,
      theClock: "", // 时钟
      uploadDataClock: "", // 更新数据时钟
      theDate: "", // 当前日期
      theTime: "", // 当前时间
      theWeekday: "", // 当前星期几
      navList: ["新强联", "厂区2", "厂区3", "厂区4"], // 看板类型数据
      navKey: 1, // 看板类型切换
      indexsOF: 0, // 看板类型切换
      fullscreen: false, // 是否全屏
      lastTapDiffTime: 0, // 双击事件配置参数
      lastTapTimeoutFunc: null, // 双击事件配置参数
      form: {
        dateType: 2,
        mapId: "",
      },
      treeList: [],
      productionEnergyList: {},
      energyDistributionList: {}, //能源分布
      carboist: [], //碳排放
      carbonFootprintList: {}, //碳足迹
      carbondistributionList: {}, //碳排放量分布
      photovoltaicCarbonList: {}, //光伏节碳
      carbonMonitoringList: {}, //碳排监控
      TionEnergy: {},
    };
  },
  components: {
    IndexChart,
    IndexBdc,
    Monitor,
    IndexTask,
    Workplace,
    MonitorJikong,
    IndexGunfe,
  },
  created() {
    this.onClock();
    this.getByType();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getDigitalCarbonList() {
      this.getProductionEnergy();
      this.getEnergyDistribution();
      this.getCarbonEmission();
      this.getCarbonFootprint();
      this.getCarbonDistribution();
      this.cyMonitorWarningRecord();
      this.getPhotovoltaiCarbon();
    },
    ontables(value) {
      this.form.dateType = value;
      this.indexof = value - 1;
      this.navKey = null;
      this.$forceUpdate();
      setTimeout(() => {
        this.navKey = 1;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.getByType();
      }, 100);
    },
    // 获取顶部数据
    getProductionEnergy() {
      queryProductionEnergy(this.form).then((res) => {
        this.TionEnergy = res.result;
        // console.log(this.TionEnergy == null, "this.TionEnergy ");
      });
    },
    // 获取开始数据

    getByType() {
      getByType({ type: 1 }).then((res) => {
        // console.log(res.result[0], "124578");
        if (res.code == 200) {
          if (res.result.length > 0) {
            this.form.mapId = res.result[0].id;
          }
          this.treeList = res.result;

          this.getDigitalCarbonList();
          this.timer = setInterval(() => this.getDigitalCarbonList(), 300000);
        }
      });
    },
    onChangeNavKey(value, index) {
      console.log(value);
      this.form.mapId = value.id;
      this.indexsOF = index;
      this.navKey = null;
      this.$forceUpdate();

      setTimeout(() => {
        this.navKey = 1;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.getByType();
      }, 100);
    },
    // 获取能源分布数据
    getEnergyDistribution() {
      nengYuanFenBu(this.form).then((res) => {
        if (res.code == 200) {
          if (res.result == null) {
            this.energyDistributionList = [];
          } else {
            res.result.forEach((res) => {
              let arr = [];
              res.list.forEach((item) => {
                arr.push({
                  name: item.name,
                  value: item.percent,
                });
              });
              res.list = arr;
            });
            this.energyDistributionList = res.result;
          }
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取光伏节碳的数据
    getPhotovoltaiCarbon() {
      let parameter = {
        dateType: this.form.dateType,
        mapId: "",
      };
      guangFuJieTan(parameter).then((res) => {
        if (res.code == 200) {
          this.photovoltaicCarbonList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取碳排放
    getCarbonEmission() {
      tanPaiFang(this.form).then((res) => {
        if (res.code == 200) {
          if (res.result == null) {
            this.carboist = [];
          } else {
            this.carboist = res.result;
          }
        }
      });
    },
    // 获取碳排分布
    getCarbonDistribution() {
      tanPaiFenBu(this.form).then((res) => {
        if (res.code == 200) {
          if (res.result == null) {
            this.carbondistributionList = [];
          } else {
            this.carbondistributionList = res.result;
          }
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 获取碳足迹
    getCarbonFootprint() {
      let obk = {
        dateType: this.form.dateType,
        mapId: "",
      };
      tanZuJi(obk).then((res) => {
        if (res.code == 200) {
          this.carbonFootprintList = res.result;
        } else {
          this.$message.warning(res.message);
        }
      });
      //碳足迹
    },

    cyMonitorWarningRecord() {
      cyMonitorWarningRecord({
        pageNo: 1,
        pageSize: 10,
      }).then((res) => {
        if (res.code == 200) {
          this.carbonMonitoringList = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
      });
      //碳足迹
    },
    /** onProcessingData2
     * 处理数据（一位数组折分成二维数组）
     * @param {Object[]} aData 需要处理的数据
     * @param {Number} splitNum 几个分一组（默认4个）
     * @returns {*[]} 返回处理后的数据
     */
    onProcessingData2(aData, splitNum) {
      // 处理数据
      if (aData && aData.length > 0) {
        let len = aData.length;
        splitNum = splitNum || 4; //假设每行显示4个
        let lineNum =
          len % splitNum === 0
            ? len / splitNum
            : Math.floor(len / splitNum + 1);
        let resData = [];
        for (let i = 0; i < lineNum; i++) {
          // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          let temp = aData.slice(i * splitNum, i * splitNum + splitNum);
          resData.push(temp);
        }
        return resData;
      } else {
        return [];
      }
    },
    onClock() {
      // 每秒更新日期，时间，周几
      this.theClock = setInterval(() => {
        let date = new Date();
        let year = date.getFullYear(); // 获取年份
        let month = date.getMonth() + 1; // 获取月份（注意月份从0开始，需要加1）
        let day = date.getDate(); // 获取日期
        let hour = date.getHours(); // 获取小时
        let minute = date.getMinutes(); // 获取分钟
        let second = date.getSeconds(); // 获取秒数
        let weekday = date.getDay(); // 获取周几（注意周日返回的是0，周一返回的是1，以此类推）
        if (weekday === 0) {
          weekday = "日";
        } else if (weekday === 1) {
          weekday = "一";
        } else if (weekday === 2) {
          weekday = "二";
        } else if (weekday === 3) {
          weekday = "三";
        } else if (weekday === 4) {
          weekday = "四";
        } else if (weekday === 5) {
          weekday = "五";
        } else if (weekday === 6) {
          weekday = "六";
        }
        this.theDate = `${year}-${month > 9 ? month : "0" + month}-${
          day > 9 ? day : "0" + day
        }`;
        this.theTime = `${hour > 9 ? hour : "0" + hour}:${
          minute > 9 ? minute : "0" + minute
        }:${second > 9 ? second : "0" + second}`;
        this.theWeekday = weekday;
        // console.log('onClock', this.theDate, this.theTime, this.theWeekday)
      }, 1000);
    },
    async onDouble() {
      // 双击事件
      const _this = this;
      // 当前时间
      const curTime = new Date().getTime();
      // 上次点击时间
      const lastTime = _this.lastTapDiffTime;
      // 更新上次点击时间
      _this.lastTapDiffTime = curTime;
      // 两次点击间隔小于300ms, 认为是双击
      const diff = curTime - lastTime;
      if (diff < 300) {
        // 成功触发双击事件时，取消单击事件的执行
        _this.onFullPage();
        clearTimeout(_this.lastTapTimeoutFunc);
      } else {
        // 单击事件延时300毫秒执行
        _this.lastTapTimeoutFunc = setTimeout(function() {
          // console.log("单击");
        }, 300);
      }
    },
    onFullPage() {
      // 全屏事件
      // console.log(this.fullscreen);
      let element = this.$refs.passBox;
      if (this.fullscreen) {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // 进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
      // 强制刷新页面数据和图表
      let cacheNavKey = this.navKey;
      this.navKey = null;
      this.$forceUpdate();
      setTimeout(() => {
        this.navKey = cacheNavKey;
        this.getDigitalCarbonList();
      }, 100);
    },
  },
};
</script>

<style scoped lang="less">
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
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.wigth {
  width: 469px;
}
.flex3 {
  display: flex;
  align-items: center;
  margin-left: 25px;
}
.flexw {
  flex: 1;
  display: flex;
}
.fels {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 22px;
  margin-top: 30px;
}

.bottoms {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 22px;
  margin-top: 30px;
}
.center {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .center-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .center-bg {
    width: 415px;
    height: 157px;
    background-image: url("../../assets/dataBigScreen/img2.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    .center-bgLeft {
      width: 122px;
      height: 102.5px;
      margin-right: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-image: url("../../assets/dataBigScreen/img3.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .bgLeft-title {
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 16px;
        color: #ffffff;
        line-height: normal;
      }

      .bgLeft-text {
        font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
        line-height: 1;
        font-style: normal;
        text-transform: none;
      }

      .bgLeft-text1 {
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 12px;
        color: #a0bdf0;
        line-height: normal;
      }
    }
    .center-bgright {
      height: 127px;
      overflow-y: scroll;
      display: flex;
      justify-content: flex-end;

      .medium {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
        background-color: #fff;
      }

      /deep/ el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      /deep/el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
      }
      .listBox4_item {
        display: flex;
        align-items: center;
        height: 49px;
        margin-bottom: 21px;
        img {
          width: 57px;
          height: 49px;
          margin-right: 11px;
        }
      }
      .listBox4_item_text2 {
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: normal;
        font-size: 12px;
        line-height: 1;
        margin-bottom: 4px;
        color: #ffffff;
      }
      .listBox4_item_text {
        font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
        font-weight: 400;
        font-size: 28px;
        color: #00fff7;
        line-height: 1;
      }
    }
  }
}

.bg {
  width: 100%;
  height: 81vh;
  background: #01323a;
  overflow: auto;
}

.topBox {
  margin: 5px 5px 0;
  height: 65px;
  display: flex;
  justify-content: space-between;
  background-image: url("../../assets/dataBigScreen/img1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .topBox_left {
    padding-left: 30px;
    width: 450px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: bold;
    color: #1ffff2;
    // background-image: url("../../../assets/dataBigScreen/img4.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .hrBox {
      margin: 0 12px;
      width: 1px;
      height: 16px;
      background: #135280;
    }

    span {
      font-size: 12px;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      color: #1ffff2;
    }
  }

  .topBox_center {
    margin: 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    font-family: Source Han Sans CN, Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;

    span {
      transform: translateY(-5px);
    }
  }

  .topBox_right {
    width: 440px;
    display: flex;
    align-items: center;
    // background-image: url("../../../assets/dataBigScreen/img5.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .topBox_right_item {
      margin-right: 10px;
      width: 88px;
      height: 43px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 400;
      color: #1ce7dc;
      background-image: url("../../assets/dataBigScreen/img9.png");
      background-repeat: no-repeat;
      background-size: cover;
    }

    .topBox_right_item:last-child {
      margin-right: 14px;
    }

    .topBox_right_item_active {
      font-size: 16px;
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      color: #bcfffc;
      background-image: url("../../assets/dataBigScreen/img11.png");
      background-repeat: no-repeat;
      background-size: cover;
    }

    .fullScreenBtn {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
