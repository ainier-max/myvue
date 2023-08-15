<template>
  <!--
  <div style="display: grid;grid-template-rows: 12% 30% 58%">
    <div style="background: red">11</div>
    <div style="background: blue">22</div>
    <div style="background: yellow">33</div>
  </div>

  <div style="display: flex;flex-direction: column">
    <div style="flex-basis:40%;background: red">11</div>
    <div style="flex-basis:30%;background: blue">22</div>
    <div style="flex-basis:30%;background: yellow">33</div>
  </div>
  -->

  <div style="display: flex;flex-direction: row;">
    <div style="flex-basis:40%">
      <div style="border: 1px solid yellowgreen;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
    <div style="flex-basis:40%;background-image: url('http://10.11.0.87:8087/cbc/getFile.cbc?uuid=f76c6dee83da42348572f95a7486ca2d&type=photo')">22</div>
    <div style="flex-basis:20%;background: yellow;"></div>
  </div>

</template>

<script>

export default {
  props: {

  },
  data() {
    return {
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
  created(){

  },
  mounted() {
  },
  methods: {

  }

}
</script>

<style scoped>

</style>

