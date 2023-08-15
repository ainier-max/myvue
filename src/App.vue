<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>
<style>
*{ margin:0;padding:0; }
html,body{
  width: 100%;
  height: 100%;
}
#app{
  width:100%;
  height: 100%;
}

::-webkit-scrollbar { /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 5px;
  background: #a8a9ab;
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  border-radius: 5px;
  background: #f0f2f5;
}
</style>