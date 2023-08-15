<template>
  <div>

    <div>
      水平向：
      <el-radio-group v-model="horizontalValue">
        <el-radio-button label="left" />
        <el-radio-button label="center" />
        <el-radio-button label="right" />
      </el-radio-group>
    </div>

    <div>
      垂直向：
      <el-radio-group v-model="verticalValue">
        <el-radio-button label="flex-start" />
        <el-radio-button label="center" />
        <el-radio-button label="flex-end" />
      </el-radio-group>
    </div>


    <div :style="styleObj">
      <div style="background: red;width: 80px;">
        文字内容
      </div>
    </div>
  </div>

</template>

<script>

export default {
  props: {

  },
  data() {
    return {
      horizontalValue:'left',
      verticalValue:'flex-start',
      styleObj:{
        width:'300px',
        height:'300px',
        background:'gray',
        display:'flex',
        justifyContent:'left',
        alignItems:'flex-start'
      }


    }
  },
  watch:{
    "horizontalValue": {
      handler(newVal, oldVal) {
        console.log('值变化:',oldVal,newVal);
        this.styleObj.justifyContent=newVal;

      }
    },
    "verticalValue": {
      handler(newVal, oldVal) {
        console.log('值变化:',oldVal,newVal);
        this.styleObj.alignItems=newVal;

      }
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

