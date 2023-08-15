<template>
  <el-pagination
      v-model:current-page="currentPage"
      v-model:pageSize="pageSize"
      :page-sizes="[100, 200, 300, 400]"
      :small="true"
      :disabled="false"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
</template>

<script>

export default {
  props: {
    component: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data: function () {
    return {
      currentPage:1,
      pageSize:100,
    }
  },
  create(){

  },
  mounted() {
  },
  methods: {
    handleSizeChange(val){
      //this.option.currentPage=val;
      console.log('handleSizeChange--val',val)
    },
    handleCurrentChange(val){
      console.log('handleCurrentChange--val',val)
    }


  },
}
</script>


