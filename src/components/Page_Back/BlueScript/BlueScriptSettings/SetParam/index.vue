<template>
  <div v-if="currentBlueScript?.config">
    <el-divider content-position="left"><span style="font-size: 18px">参数名设置</span></el-divider>
    <el-input v-model="currentBlueScript.config.settings.paramFieldSetting" style="width: 150px;padding-top: 10px"
              placeholder="输入参数字段名"/><br>
  </div>
</template>

<script>


export default {
  props: {
    currentBlueScript: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {

    }
  },
  components: {},

  created() {

  },

  computed: {

  },
  watch: {


  },
  methods: {

  },
  mounted() {

  }
}
</script>

<style scoped>


</style>