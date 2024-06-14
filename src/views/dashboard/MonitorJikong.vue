<template>
  <div class="IndexBdcbg">
    <div class="IndexBdc-title">{{ title }}</div>
    <div class="ilistw">
      <div class="table-th">
        <div v-for="(item, index) in list" :key="index">{{ item }}</div>
      </div>
      <div class="listOver">
        <div class="table-td" v-for="item in carbonMonitoringList" :key="item">
          <div>
            {{ item.monitorName }}
          </div>
          <div>
            {{
              item.monitorType == 1
                ? "碳排放"
                : item.monitorType == 2
                ? "标准煤"
                : item.monitorType == 3
                ? "电"
                : item.monitorType == 4
                ? "水"
                : item.monitorType == 5
                ? "天然气"
                : "-"
            }}
          </div>
          <div :class="{colo1:item.warningState == 2,colo:item.warningState == 1}">
            {{
              item.warningState == 1
                ? "警告"
                : item.warningState == 2
                ? "严重"
                : "正常"
            }}
          </div>
          <div>{{ item.monitorValue.toFixed(2) }} {{ item.unit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["carbonMonitoringList", "type", "title"],
  data() {
    return {
      list: ["监控名称", "类型", "等级", "监控值"],
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
    if (this.type == 2) {
      console.log(this.carbonMonitoringList, "carbonMonitoringList");
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
.colo {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #ffda58 !important;
}

.colo1 {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #ff6f5c !important;
}
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
