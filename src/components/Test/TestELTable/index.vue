<template>
  <div style="width:100%;height:100%;">
    <div style="width:100%;height:100px;background: blue" ref="cbcTableRef">
      <el-table :data="tableData" style="width: 100%;overflow: hidden" height="100%"
                :cell-style="{padding:'0px'}" :row-style="{height:cellHeight}" :header-row-style="{height:'30px'}" >
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>

  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      cellHeight:'0px',
      tableData : [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]
    }
  },
  create(){
  },
  mounted() {
    let tableBodyHeight=parseFloat(this.$refs.cbcTableRef.style.height)-30;
    this.cellHeight=tableBodyHeight/this.tableData.length+"px";
    console.log("cellHeight",this.cellHeight);

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
