<template>
  <div class="secenter">
    <div class="bg tables" v-if="!switchChange">
      <!-- 抽屉框 -->

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper bgs">
        <div class="title">重点耗能设备</div>
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :md="8" :sm="24">
              <a-form-model-item label="设备名称：">
                <a-select
                  allowClear
                  show-search
                  optionFilterProp="children"
                  placeholder="请输入搜索"
                  v-model="selectDeviceName"
                >
                  <a-select-option
                    v-for="(category, index) in data"
                    :value="category.name"
                    :key="index"
                  >
                    {{ category.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :md="8" :sm="24">
              <a-form-model-item label="设备位置：">
                <a-tree-select
                  v-model="selectMonitoringRange"
                  placeholder="请选择范围"
                  multiple
                  :tree-data="monitoringRange"
                  tree-default-expand-all
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>

            <a-col :xl="4" :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" :loading="searchBtn" icon="search"
                  >查询</a-button
                >
                <a-button
                  class="buttton2"
                  type="primary"
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 24px"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="right-bottom">
        <div class="contont-box">
          <div
            class="equmint-box"
            @click="devicesEqumint(item)"
            v-for="(item, index) in data"
            :key="index"
          >
            <div class="box-top">
              {{ item.name }}
            </div>
            <div class="box-center">
              {{ item.locationName }}
            </div>
            <div class="box-foot">
              <div class="fles">
                <div v-for="(value, ins) in item.keyNames" :key="ins">
                  {{ value }}
                </div>
              </div>
              <div class="fles">
                <div v-for="(value, ins) in item.keyValue" :key="ins">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <key-energy-details
        :details="details"
        @Toggle="handleCustomEvent"
      ></key-energy-details>
    </div>
  </div>
</template>

<script>
import { queryEquipmentList } from "@/api/Equipment";
import { getByType } from "@/api/tanpai.js";
import KeyEnergyDetails from "./module/keyEnergyDetails.vue";
export default {
  components: { KeyEnergyDetails },
  data() {
    return {
      searchBtn:false,
      keyData: [], //设备数据

      details: {
        id: undefined,
        name: undefined,
        locationName: undefined,
        deviceType: undefined,
      }, //设备详情
      selectDeviceName: undefined, //选中设备名称
      selectMonitoringRange: [], //选择设备位置
      monitoringRange: [], //设备位置
      data: [],
      switchChange: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      inquire: {
        brand: undefined,
        abbreviation: undefined,
        measureType: undefined,
        pageNo: 1,
        pageSize: 10,
      },
      timer: undefined,
      isAss: false,
    };
  },
  created() {
    this.getKeyEquipment();
    this.getMonitoringScope();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  methods: {
    getMonitoringScope() {
      let parameter = {
        type: 1,
      };
      getByType(parameter).then((res) => {
        if (res.code == 200) {
          this.monitoringRange = this.convertData(res.result);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    convertData(data) {
      return data.map((item) => ({
        title: item.name,
        value: item.id,
        key: item.id,
        children:
          item.children.length > 0 ? this.convertData(item.children) : [],
      }));
    },
    devicesEqumint(item) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.details = {
        id: item.id,
        locationName: item.locationName,
        name: item.name,
        deviceType: item.measureType_dictText,
      };
      this.switchChange = true;
    },
    handleCustomEvent(value) {
      this.switchChange = value;
    },
    customSort(a, b) {
      const order = { A相电压: 1, B相电压: 2, C相电压: 3 };
      return order[a] - order[b];
    },
    getKeyEquipment(params) {
      let parameter = {
        KeyDevice: true,
      };
      if (params) {
        parameter = Object.assign(parameter, params);
      }
      queryEquipmentList(parameter).then((res) => {
        if (res.code == 200) {
          res.result.records.forEach((item) => {
            item.keyNames = [];
            item.keyValue = [];
            if (item.keyData && typeof item.keyData === "string") {
              try {
                let obj = JSON.parse(item.keyData);
                if (obj && typeof obj === "object") {
                  let entries = Object.entries(obj);
                  entries.sort((a, b) => a[0].localeCompare(b[0])); // 按照key排序
                  for (let [key, value] of entries) {
                    console.log(key, value);
                    item.keyNames.push(key);
                    item.keyValue.push(value);
                  }
                  // item.keyNames.sort();
                  // item.keyValue.sort();
                } else {
                  console.error("解析后的数据不是对象：", obj);
                }
              } catch (error) {
                console.error("解析JSON数据时出现异常：", error);
              }
            } else {
              console.error("item.keyData 不是有效的字符串");
            }
          });
          this.data = res.result.records;
          console.log(this.data, "dat");
        } else {
          this.$message.warning(res.message);
        }
      });
      this.timer = setInterval(() => {
        queryEquipmentList(parameter).then((res) => {
          if (res.code == 200) {
            res.result.records.forEach((item) => {
              item.keyNames = [];
              item.keyValue = [];
              if (item.keyData && typeof item.keyData === "string") {
                try {
                  let obj = JSON.parse(item.keyData);
                  if (obj && typeof obj === "object") {
                    let entries = Object.entries(obj);
                    entries.sort((a, b) => a[0].localeCompare(b[0])); // 按照key排序
                    for (let [key, value] of entries) {
                      console.log(key, value);
                      item.keyNames.push(key);
                      item.keyValue.push(value);
                    }
                  } else {
                    console.error("解析后的数据不是对象：", obj);
                  }
                } catch (error) {
                  console.error("解析JSON数据时出现异常：", error);
                }
              } else {
                console.error("item.keyData 不是有效的字符串");
              }
            });
            this.data = res.result.records;
            console.log(this.data, "dat");
          } else {
            this.$message.warning(res.message);
          }
        });
      }, 12000);
    },
    searchQuery() {
      this.searchBtn=true
     this.getEquipmentList();
    },
    /**
     * 查询，重置后获取数据
     */
    getEquipmentList(){
      let parameter = {
        location: this.selectMonitoringRange.toString(),
        name: this.selectDeviceName,
        KeyDevice: true,
      };
      queryEquipmentList(parameter).then((res) => {
        if (res.code == 200) {
          this.data = res.result.records;
        } else {
          this.$message.warning(res.message);
        }
        this.searchBtn=false
      });
    },
    searchReset() {
      this.selectDeviceName = undefined;
      this.selectMonitoringRange = [];
      let parameter = {
        KeyDevice: true,
      };

     this.getEquipmentList();
    },
  },
};
</script>
<style lang="less">
.ant-drawer-content {
  background-color: #0b4144 !important;
}
.ant-drawer-header {
  background-color: #0b4144 !important;
  border: 0 !important;

  .ant-drawer-title {
    font-weight: 500 !important;
    font-size: 16px !important;
    color: #ffffff !important;
  }
}
</style>
<style scoped lang="less">
.fles {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.secenter {
  width: 100%;
  height: 100%;
}
.bg {
  width: 100%;
  height: 100%;
}

.instructions {
  margin-left: 142px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 20px;
  text-align: left;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 22px;
}
.contont-box {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px 10px;
}
.equmint-box {
  display: flex;
  flex-direction: column;

  margin-top: 24px;
  width: 386px;
  height: 188px;
  background: #006a77;
  border-radius: 4px 4px 4px 4px;
  .box-top {
    width: 250px;
    height: 24px;
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
    font-family: PingFang SC, PingFang SC;
    line-height: 24px;
    margin: 24px 288px 16px 24px;
  }
  .box-center {
    margin: 0 0px 16px 24px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    line-height: 24px;
  }
  .box-foot {
    display: flex;
    flex-direction: column;
    margin: 0 28px 24px 28px;

    color: #ffffff;
  }
}
</style>
