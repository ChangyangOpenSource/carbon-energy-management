import { axios } from "@/utils/request";
import Vue from "vue";

import { ACCESS_TOKEN } from "@/store/mutation-types";
const token = Vue.ls.get(ACCESS_TOKEN);
// 查询能源列表
export function queryEnergyType(params) {
  return axios({
    url: "carbon/cyBaseCarbonEnergyType/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 查询能源名称列表
export function queryEnergyNameList(params) {
  return axios({
    url: "carbon/cyBaseCarbonEnergyName/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 查询能源名称详情
export function queryEnergyDetails(params) {
  return axios({
    url: "carbon/cyBaseCarbonEnergyName/queryById",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}

// 新增能源类型
export function addEnergy(parameter) {
  return axios({
    url: "carbon/cyCalcCarbonEmissionConfig/add",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}

// 通过id删除
export function deleteIdEnergy(params) {
  return axios({
    url: "carbon/cyCalcCarbonEmissionConfig/delete",
    method: "delete",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}

//   编辑
export function editEnergy(parameter) {
  return axios({
    url: "carbon/cyCalcCarbonEmissionConfig/edit",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}

// 分页列表查询
export function queryEnergyList(params) {
  return axios({
    url: "carbon/cyCalcCarbonEmissionConfig/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 通过id查询
export function queryIdEnergy(params) {
  return axios({
    url: "carbon/cyCalcCarbonEmissionConfig/queryById",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}

// 折碳煤分页列表查询
export function queryMetacarboniteList(params) {
  return axios({
    url: "carbon/cyCalcStandardCoalCoefficientConfig/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 折碳煤查询能源名称列表
export function queryMetacarboniteNameList(params) {
  return axios({
    url: "carbon/cyBaseStandardCoalCoefficientType/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 通过id查询(折碳煤)
export function queryMetacarbonite(params) {
  return axios({
    url: "carbon/cyBaseStandardCoalCoefficientType/queryById",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 添加折标煤规则
export function addMetacarbonite(parameter) {
  return axios({
    url: "carbon/cyCalcStandardCoalCoefficientConfig/add",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}
// 通过id删除（折标煤）
export function deleteMetacarbonite(params) {
  return axios({
    url: "carbon/cyCalcStandardCoalCoefficientConfig/delete",
    method: "delete",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
// 编辑折标煤规则
export function editMetacarbonite(parameter) {
  return axios({
    url: "carbon/cyCalcStandardCoalCoefficientConfig/edit",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": token,
    },
  });
}
// 通过id查询(在查询中数据)
export function queryMetacarboniteDetails(params) {
  return axios({
    url: "carbon/cyCalcStandardCoalCoefficientConfig/queryById",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}

export function queryNewEquipment(params) {
  return axios({
    url: "remote/cyRemoteNewDevice/list",
    method: "get",
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Access-Token": token,
    },
  });
}
