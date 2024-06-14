import { axios } from "@/utils/request";
import Vue from "vue";

import { ACCESS_TOKEN } from "@/store/mutation-types";
const token = Vue.ls.get(ACCESS_TOKEN);

// 获取设备信息数据列表
export function queryEquipmentList(params){
    return axios({
        url:"carbon/cyBizDeviceInfo/list",
        method:"get",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}

// 通过车间id获取设备信息
export function queryBizDeviceInfo(params){
    return axios({
        url:"carbon/cyBizDeviceInfo/queryByMapIds",
        method:"post",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
// 新增设备信息
export function addEquipment(parameter){
    return axios({
        url:"carbon/cyBizDeviceInfo/add",
        method:"post",
        data:parameter,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Access-Token": token,
          },
    })
}
// 通过id删除
export function deleteEquipment(params){
    return axios({
        url:"carbon/cyBizDeviceInfo/delete",
        method:"delete",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
//  编辑
export function editequipment(parameter){
    return axios({
        url:"carbon/cyBizDeviceInfo/edit",
        method:"post",
        data:parameter,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Access-Token": token,
          },
    })
}
// 通过id查询
export function queryByEquipmentId(params){
    return axios({
        url:"carbon/cyBizDeviceInfo/queryById",
        method:"get",
        params,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Access-Token": token,
          },
    })
}

// 重点设备详情
export function queryKeyDetails(params){
    return axios({
        url:"carbon/cyBizDeviceInfo/queryKeyDeviceById",
        method:'get',
        params,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Access-Token": token,
          },
    })
}

