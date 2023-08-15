<template>
  <div>
    <ComponentRegister ref="registerRef"></ComponentRegister>
  </div>

</template>

<script>
import ComponentRegister from '../ComponentRegister/index.vue'


export default {
  name: 'ComponentRigisterIframe',
  props: {

  },
  data() {
    return {
      componentInfo:{}
    }
  },
  components: {
    ComponentRegister
  },

  created() {
    window.cbcIframeFunction = this.setComponentInfo;
  },
  methods: {
    setComponentInfo(componentInfo){
      this.$refs.registerRef.clearComponent();
      this.$refs.registerRef.setComponentInfo(componentInfo);
    }
  },
  mounted() {

  }
}

</script>