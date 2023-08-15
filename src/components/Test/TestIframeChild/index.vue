<template>
  <div style="width:100%;height:100%;">
    <div style="width: 100px;height: 100px;background: #9f9f9f;color:yellow">
      iframe子页面
    </div>
  </div>
</template>

<script>


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
    console.log("子页面初始化......window.parent",window.parent);
    let param={};
    param.value="456";
    window.parent.cbcIframeFun(param);
  },
  methods: {


  }

}
</script>

<style scoped>

</style>
