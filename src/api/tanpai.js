import { axios } from '@/utils/request'
import Vue from 'vue'
import {ACCESS_TOKEN,} from "@/store/mutation-types"


export function getByType(params) {//地图表通过type获取
    return axios({
        url: '/carbon/cyMap/getByType',
        method: 'get',
        params: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function carbonAdd(data) {//地图表添加
    return axios({
        url: '/carbon/cyMap/add',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function carbondelete(data) {//地图表删除
    return axios({
        url: `/carbon/cyMap/delete?id=${data}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function carbonedit(data) {//地图表编辑
    return axios({
        url: '/carbon/cyMap/edit',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function listByType(params) {//地图标签获取
    return axios({
        url: '/carbon/cyMapTag/listByType',
        method: 'get',
        params: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function cyMapTagEdit(data) {//地图标签编辑
    return axios({
        url: '/carbon/cyMapTag/edit',
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyMapTagDelete(params) {//地图标签删除
    return axios({
        url: `/carbon/cyMapTag/delete?id=${params}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyMapTagadd(data) {//地图标签添加
    return axios({
        url: '/carbon/cyMapTag/add',
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function cyMapTagqueryById(params) {//通过id查询
    return axios({
        url: '/carbon/cyMap/queryById',
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}
// ---------------------工段管理--------------------------------
export function cyEnergyQuantity(params){
    //查询能源数据
    return axios({
        url:"carbon/cyWorkshopProcess/queryPageListTwo",
        method:"get",
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyworkshopById(params){
    // 通过id查询
    return axios({
        url:"carbon/cyWorkshopProcess/queryById",
        method:"get",
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyworkshopManagementEdit(paramter){
    // 编辑
    return axios({
        url:"carbon/cyWorkshopProcess/addWorkProcessAndDevice",
        method:"post",
        data:paramter,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


// ---------------------设备品牌型号表--------------------------------



export function cyBizBrandModelAdd(data) {//设备品牌添加
    return axios({
        url: '/carbon/cyBizBrandModel/add',
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyBizBrandModelEdit(data) {//设备品牌编辑
    return axios({
        url: '/carbon/cyBizBrandModel/edit',
        method: 'POST',
        data: data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyBizBrandModeldelete(data) {//通过id删除
    return axios({
        url: `/carbon/cyBizBrandModel/delete?id=${data}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyBizBrandModellist(params) {//分页列表查询
    return axios({
        url: `/carbon/cyBizBrandModel/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function cyBizBrandModelqueryById(params) {//通过id查询
    return axios({
        url: `/carbon/cyBizBrandModel/queryById`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


// --------------------------  能源管理--------------------------------


export function productCostControllerlist(params) {//通过id查询
    return axios({
        url: `/carbon/productCostController/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyPhotovoltaiclist(params) {//光伏发电
    return axios({
        url: `/carbon/cyPhotovoltaic/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function historyCostlist(params) {//能耗历史曲线
    return axios({
        url: `/carbon/historyCost/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function historyPhotoCostlist(params) {//光伏发电历史曲线
    return axios({
        url: `/carbon/historyPhotoCost/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}



// --------------------------  碳足迹--------------------------------

export function carbonFootprintlist(params) {//碳足迹
    return axios({
        url: `/carbon/carbonFootprint/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function productCarbonlist(params) {//生产排碳
    return axios({
        url: `/carbon/productCarbon/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function photovoltaicReductionlist(params) {//光伏减排
    return axios({
        url: `/carbon/photovoltaicReduction/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


// --------------------------  统计报表--------------------------------
export function statisticsDatalist(params) {//水电气
    return axios({
        url: `/carbon/statisticsData/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function statisticsDataphotoList(params) {//光伏
    return axios({
        url: `/carbon/statisticsData/photoList`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

// --------------------------  数据大屏--------------------------------

export function guangFuJieTan(params) {//光伏节碳
    return axios({
        url: `/carbon/screen/guangFuJieTan`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function nengYuanFenBu(params) {//能源分布
    return axios({
        url: `/carbon/screen/nengYuanFenBu`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function tanPaiFang(params) {//碳排放
    return axios({
        url: `/carbon/screen/tanPaiFang`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}


export function tanPaiFenBu(params) {//碳排放分布
    return axios({
        url: `/carbon/screen/tanPaiFenBu`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function tanZuJi(params) {//碳足迹
    return axios({
        url: `/carbon/screen/tanZuJi`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}

export function cyMonitorWarningRecord(params) {//碳排监控(监控接口)
    return axios({
        url: `/carbon/cyMonitorWarningRecord/list`,
        method: 'get',
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
}
// 获取生产能耗(大屏顶部)
export function queryProductionEnergy(params){
    return axios({
        url:"/carbon/screen/shengchannenghao",
        method:"get",
        params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
    })
} 
