<template>
  <div style="height: 300px; width: 500px; border: 1px solid red; background:red;position: relative;">
    <vue-draggable-resizable :w="300" :h="150" :scale="1"  @dragging="onDrag" @resizing="onResize" :parent="true">
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br>
        X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}</p>
    </vue-draggable-resizable>
  </div>
</template>

<script>
//vue3引入组件 注意和vue2中的路径不同
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
export default {
  props: {

  },
  data() {
    return {
      width: 300,
      height: 150,
      x: 0,
      y: 0
    }
  },
  created(){

  },
  components:{
    VueDraggableResizable:VueDraggableResizable
  },
  mounted() {
  },
  methods: {
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    }

  }

}
</script>

<style scoped>

</style>

