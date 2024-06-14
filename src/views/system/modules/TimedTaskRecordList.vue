<template>
  <a-card :bordered="false">

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

      </a-table>
    </div>

  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util';
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: 'TimedTaskRecordList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
    },
    props:{
      jobClassName:''
    },
    data () {
      return {
        model:{
          name:''
        },
        description: '定时任务记录表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'开始时间',
            align:"center",
            dataIndex: 'startTime',

          },
          {
            title:'执行时间',
            align:"center",
            dataIndex: 'executionTime'
          },
          {
            title:'执行结果',
            align:"center",
            dataIndex: 'executionResult',
            customRender:function (text){
              return text === 0 ? '成功':'失败'
            }
          },
        ],
        url: {
          list: "/timedTaskRecord/timedTaskRecord/list",
        },

      }
    },
    created() {
    },
    computed: {
    },
    methods: {
      getQueryParams() {
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.name = this.jobClassName
        return filterObj(param);
      },

    }
  }
</script>
<style scoped>
</style>
