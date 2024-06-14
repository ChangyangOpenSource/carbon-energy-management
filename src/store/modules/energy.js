import Vue from "vue";
// 没有发请求，接口未出
const app={
    state:{
        columns:[],
        data:[],
    },
    mutations:{
        SET_DADA:(state,data)=>{
            state.data=data
        }
    },
    getters:{

    },
    actions:{
        // 获取数据
        GetenergyList({commit},Id){
            return new Promise((resolve,reject)=>{
                // 使用发起请求的方法
            //    energy(Id).then(response=>{
            //     if(response.code=='200'){
            //         const result = response.result
            //         commit('SET_DADA',result)
            //     }
            //    })
            })
        }
    }
}