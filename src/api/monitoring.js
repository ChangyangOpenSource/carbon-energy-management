import { axios } from "@/utils/request";
import Vue from "vue";

import { ACCESS_TOKEN } from "@/store/mutation-types";
const token = Vue.ls.get(ACCESS_TOKEN);

// 获取监控配置 列表
export function queryMonitoringList(params) {
  return axios({
    url:"carbon/cyMonitorConfig/list",
    method:"get",
    params,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Access-Token": token,
      },
})
}
// 通过车间id获取设备信息
export function queyrMapDeviceList(data){
  return axios({
    url:"carbon/cyBizDeviceInfo/queryByMapIds",
    method:"post",
    data,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
})
}

// 新增监控配置
export function addMonitoring(parameter) {
  return axios({
    url: "carbon/cyMonitorConfig/add",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}

// 通过id删除
export function deleteMonitoring(params) {
  return axios({
    url: "carbon/cyMonitorConfig/delete",
    method: "delete",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 通过id查询
export function queryMonitoringById(params){
  return axios({
    url:"carbon/cyMonitorConfig/queryById",
    method:'get',
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  })
}
// 编辑
export function editMonitoring(parameter) {
  return axios({
    url: "carbon/cyMonitorConfig/edit",
    method: "post",
    data:parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}

// 获取监控记录数据
export function  queryMonitoringRecordList(params){
  return axios({
    url:"carbon/cyMonitorWarningRecord/list",
    method:"get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  })
} 

// 修改状态
export function updateStatus(params){
  return axios({
    url:"carbon/cyMonitorConfig/updateStatus",
    method:"get",
    params,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  })
}