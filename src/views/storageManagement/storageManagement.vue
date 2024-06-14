<template>
  <div class="bg">
    <a-col :span="24">
    <div class="top-title">储能运行情况</div>
    </a-col>
    <a-row :gutter="[16, 24]">
      <a-col :span="12">
        <div class="left-content">
          <div class="title">电站信息</div>
          <div class="left-box">
            <div class="content">
              <div>电站额定容量</div>
              <div>45451215KWh</div>
            </div>
            <div class="content">
              <div>电站额定功率</div>
              <div>3450KWh</div>
            </div>
            <div class="content">
              <div>电站SOC上限</div>
              <div>100%</div>
            </div>
            <div class="content">
              <div>电站SOC下限</div>
              <div>0%</div>
            </div>
            <div class="content">
              <div>PCS额定功率</div>
              <div>3450kW</div>
            </div>

            <div class="content">
              <div>PCS总数</div>
              <div>36台</div>
            </div>
            <div class="content">
              <div>电池单体容量</div>
              <div>13.5111MWh</div>
            </div>
            <div class="content">
              <div>电池总数量</div>
              <div>19簇</div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="right-content">
          <div class="title">充放电量</div>
          <div class="right-box">
            <div class="content">
              <div>日充电量</div>
              <div>276KWh</div>
            </div>
            <div class="content">
              <div>日放电量</div>
              <div>376KWh</div>
            </div>
            <div class="content">
              <div>累计充电量</div>
              <div>12312.99KWh</div>
            </div>
            <div class="content">
              <div>累计放电量</div>
              <div>12342.99KWh</div>
            </div>
           
          </div>
        </div>
      </a-col>
    </a-row>
    <a-col :span="24">
    <div class="content-title">运行状态</div>
    </a-col>
    <a-row :gutter="[16, 24]">
      <a-col :span="12"
        >
        <div class="right-content">
         
          <div class="right-box">
            <div class="content">
              <div>电站运行状态</div>
              <div>充电</div>
            </div>
            <div class="content">
              <div>整站SOC(%)</div>
              <div>55%</div>
            </div>
            <div class="content">
              <div>可用充电量</div>
              <div>0.0KWh</div>
            </div>
            <div class="content">
              <div>可用放电量</div>
              <div>0.0KWh</div>
            </div>
            <div class="content">
              <div>最大可充功率</div>
              <div>0.0KWh</div>
            </div>
            <div class="content">
              <div>最大可放功率</div>
              <div>0.0KW</div>
            </div>
        
          </div>
        </div>
        </a-col
      >
      <a-col :span="12"
        >
        <div class="right-footer">
          <div class="title">功率曲线</div>
            <eacharts :type="6"  :topList="topList" />
        </div>
        </a-col
      >
    </a-row>
  </div>
</template>

<script>
import eacharts from "@/components/eacharts/index.vue";
export default {
    components: { eacharts },
    data() {
        return{
            topList:{},
        }
    },
    methods:{
        /**
         * 获取功能曲线数据
         */
        getpower(){

        },
    }
};
</script>

<style scoped lang="less">
.element::-webkit-scrollbar {  
  display: none;  
}
.bg {
  width: 100%;
  height:calc(100vh - 13vh);
 overflow-y: auto;
 overflow-x: hidden;
  .left-content {
    padding: 20px 0;
    background-image: url("../../assets/组合\ 22.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .title {
      width: 100px;
      margin: 0 auto;
      font-family: DINBold;
      font-weight: 400;
      font-size: 22px;
      color: #ffffff;
      line-height: 20px;
    }
    .left-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 20px 28px;
      margin: 22px 10px;
    }
    .content {
      padding: 10px 20px 0 20px;
      display: flex;
      justify-content: space-between;
      width: 330px;
      height: 44px;
      background: linear-gradient(
        90deg,
        rgba(0, 91, 97, 0.67) 0%,
        #077880 51%,
        #005b61 100%
      );
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
    }
  }
  .right-content {
    padding: 20px 0;
    background-image: url("../../assets/组合\ 22.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .title {
      width: 100px;
      margin: 0 auto;
      font-family: DINBold;
      font-weight: 400;
      font-size: 22px;
      color: #ffffff;
      line-height: 20px;
    }
    .right-box {
      display: flex;
      flex-wrap: wrap;
     
      gap: 20px 0px;
      margin: 22px 10px;
    }
    .content {
    padding: 10px 20px 0 20px;
      display: flex;
  
      justify-content: space-between;
      width: 772px;
      height: 44px;
      background: linear-gradient(
        90deg,
        rgba(0, 91, 97, 0.67) 0%,
        #077880 51%,
        #005b61 100%
      );
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
    }
  }
}
.top-title {
  width: 1664px;
  height: 74px;
  background: #053c43;
  margin-bottom: 24px;
  border-radius: 0px 0px 0px 0px;
  padding: 6px 700px;
  font-family: DINBold;
  font-weight: 400;
  font-size: 40px;
  color: #ffffff;
  line-height: 62px;
  letter-spacing: 2px;
}
.content-title{
    width: 1664px;
    height: 56px;
  background: #053c43;
  margin: 24px 0;
  border-radius: 0px 0px 0px 0px;
  padding: 0px 770px;
  font-family: DINBold;
  font-weight: 400;
font-size: 24px;
  color: #ffffff;
  line-height: 56px;
  letter-spacing: 2px;
}
.right-footer{
    padding: 48px 24px 0;
    width: 820px;
height: 447px;
    background-image: url("../../assets/组合\ 22.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .title{
      color: #fff;
      font-weight: 600;
font-size: 20px;
    }
}
</style>
