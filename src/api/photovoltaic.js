import { axios } from "@/utils/request";
import Vue from "vue";

import { ACCESS_TOKEN } from "@/store/mutation-types";
const token = Vue.ls.get(ACCESS_TOKEN);

// 获取光伏电站数据
export function queryPhotovoltaicList(params) {
  return axios({
    url: "carbon/cyBizPowerStation/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}
// 通过id查询光伏电站
export function queryPhotovoltaicById(params) {
  return axios({
    url: "carbon/cyBizPowerStation/queryById",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}
// 编辑
export function editPhotovoltaic(parameter) {
  return axios({
    url: "carbon/cyBizPowerStation/edit",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}
// 绑定地图
export function bingingMap(parameter){
  return axios({
    url:"carbon/cyBizPowerStation/bindMap",
    method:"post",
    data:parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  })
}
// 获取所有设备状态
export function queryAllDeviceStatus(params){
  return axios({
    url:"carbon/cyBizPowerStation/state",
    method:'get',
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  })
}
