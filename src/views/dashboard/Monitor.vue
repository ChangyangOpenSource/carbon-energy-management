<template>
  <div class="IndexBdcbg">
    <div class="IndexBdc-title">{{title}}</div>
    <div class="ilistw">
      <div class="table-th">
        <div v-for="(item, index) in list" :key="index">{{ item }}</div>
      </div>
      <div class="listOver">
        <div class="table-td" v-for="item in carbonFootprintList" :key="item">
          <div >
            {{ item.name }}  
          </div>
          <div>tCO2/套</div>
          <div>
            {{item.carbon}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props:['carbonFootprintList','type','title'],
  data() {
    return {
      list: ["生产阶段", "单位", "碳排放"],
      color: ["#089898", "#44D7B6", "#00FAFF", "#00B7FF", "#FFA06C"],
      listsa: [
        {
          text: "1",
        },
        {
          text: "1",
        },
        {
          text: "1",
        },
      ],
    };
  },
  mounted() {
    if(this.type==1){
      console.log(this.carbonFootprintList)
    }
  },
  methods: {},
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
</style>
<style scoped lang='less'>
@font-face {
  font-family: DINBold;
  src: url("../../assets/优设标题黑.TTF") format("truetype");
}
.table-td:hover {
  background: linear-gradient(
    90deg,
    rgba(14, 77, 104, 0) 0%,
    #126161 51%,
    rgba(14, 77, 104, 0) 100%
  );
  border-radius: 0px 0px 0px 0px;
}
.listOver {
  height: 88%;
  overflow: scroll;
}
.ilistw {
  margin-top: 27px;
  padding: 0 24px;
  height: 88%;

  .table-th {
    width: 100%;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 18px;
    color: #ffffff;
    background: linear-gradient(#2f8e8e 0%, rgba(47, 61, 82, 0.09) 100%);
    border-radius: 0px 0px 0px 0px;
    div {
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .table-td {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 13px 0;
    div {
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
      font-weight: normal;
      font-size: 14px;
      color: #ffffff;
    }
  }

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
  height: 361px;
  background-image: url("../../assets/dataBigScreen/img8.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .IndexBdc-title {
    font-family:DINBold;
    font-weight: 400;
    font-size: 20px;
    color: #ffffff;
    line-height: 1;
    margin-left: 31px;
    padding-top: 6px;
  }
}
</style>
