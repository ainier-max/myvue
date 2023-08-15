<template>
  <div style="width:100%;height:100%;">
    测试创屏接口

  </div>
</template>

<script>
import qs from 'qs'

export default {
  props: {
  },
  data() {
    return {

    }
  },
  create(){
  },
  mounted() {
    const Axios= axios.create({
      baseURL: '/bigscreen',
      timeout:5000,
      headers: {
        "bigScreenRelease":"release",
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    Axios({
      method: 'post',
      url: '/api/ds/datasource/getSqlData',
      data: {
        datasourceId:"10c0771b8b7346a88f38d053298888f8",
        dataSql:"SELECT count(1) as sum,jqlx FROM page_test_jq where 1=1 {{filter: and area ='#area'}} group by jqlx",
        //dataSql:"SELECT count(1) as sum,jqlx FROM page_test_jq where 1=1 and area='厦门' group by jqlx",
        routeparam:JSON.stringify({area: "厦门"})
      },
      transformRequest: [
        function (data) {
          console.log("111data",data);
          // 将请求数据转换成功 formdata 接收格式
          console.log("qsdata",qs.stringify(data));
          return qs.stringify(data)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      console.log("response1232",response);
    });


  },
  methods: {


  }

}
</script>

<style scoped>
.el-table :deep(.cell){
  line-height: 16px;
}
</style>
