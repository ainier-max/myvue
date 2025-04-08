<template>
  <div >
    <el-divider content-position="left"><span style="font-size: 18px">字段设置</span></el-divider>

    <el-input v-model="currentBlueScript.config.settings.SetGlobalSettingsField" style="width: 280px;padding-top: 10px"
              placeholder="输入字段名"/><br>

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

  created() {

  },
  watch: {},
  methods: {

  },
  mounted() {


  }
}
</script>

<style scoped>

</style>