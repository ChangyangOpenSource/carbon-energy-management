import { axios } from "@/utils/request";
import Vue from "vue";

import { ACCESS_TOKEN } from "@/store/mutation-types";
const token = Vue.ls.get(ACCESS_TOKEN);

// 手动录入 列表
export function queryReadingList(params){
    return axios({
        url:"carbon/cyBizDeviceDataRecord/pageList",
        
        method:'get',
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
// 通过id查询
export function queryReadingById(params){
    return axios ({
        url:"carbon/cyBizDeviceDataRecord/readingPageList",
        method:"get",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
// 远程抄表
export function addremoteEntry(data){
    return axios({
        url:"carbon/cyBizDeviceInfo/remoteEntry",
        method:"post",
        data,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "X-Access-Token": token,
          },
    })
}
//获取手动抄表
export function  queryManualReadingList(parameter){
        return axios({
            url:"carbon/cyBizDeviceInfo/manualEntry",
            method:"post",
            data:parameter,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-Access-Token": token,
              },
        })
}
 
// 获取抄表记录
export function queryRecordsList(params){
    return axios({
        url:"carbon/cyBizDeviceDataRecord/pageList",
        method:"get",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}

// 检测抄表记录
export function excelCheck(data){
    return axios ({
        url:"carbon/cyBizDeviceInfo/importExcelCheck",
        method:"post",
        data,
        headers: { // 设置请求头
            'Content-Type': 'application/x-www-form-urlencoded'
          }
    })
}
// 获取远程抄表
export function queryReadingRecord(params){
    return axios({
        url:"carbon/cyRemoteReadingRecord/list",
        method:"get",
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
// 导入抄表记录
export function importExcel(data){
    return axios({
        url:"carbon/cyBizDeviceInfo/importExcel",
        method:"post",
        data,
        headers: { // 设置请求头
            'Content-Type': 'application/x-www-form-urlencoded'
          }
    })
}
// 获取上次抄表时间
export function ReadTime(){
    return axios({
        url:"carbon/cyRemoteReadingRecord/lastReadTime",
        method:'get',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Access-Token": token,
          },
    })
}
// 远程抄表导出
// export function deriveReading(params){
//     return axios({
//         url:"carbon/cyBizDeviceDataRecord/exportXls",
//         method:"get",
//         params,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "X-Access-Token": token,
//           },
//     })
// }