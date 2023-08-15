<!-- my-page.vue -->
<template>
  <div>
    <div style="height: 50px"></div>
    <h1>该文字显示为基座应用的界面</h1>
    <div style="height: 50px"></div>
    <micro-app name='app1' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 300px"></div>
    <micro-app name='app2' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>

    <!--
      name(必传)：应用名称
      url(必传)：应用地址，会被自动补全为http://localhost:3000/index.html
      baseroute(可选)：基座应用分配给子应用的基础路由，就是上面的 `/my-page`
      http://10.11.0.87:7105/#/home
      <micro-app name='app1' url='http://10.11.0.87:7105/' baseroute='my-page/home/'></micro-app>
      <micro-app name='app2' url='http://10.11.0.87:7105' baseroute='/my-page/about/'></micro-app>
      /#/
      <micro-app name='app2' url='http://10.11.0.87:7105/' baseroute='/my-page/home'></micro-app>
    <micro-app name='app1' url='http://10.11.0.87:7105/' baseroute='/my-page/about'></micro-app>

    <div v-for="(item,i) in arr">
     435
      <div style="width: 800px;height: 200px">
        <component   is="micro-app" :name="'app'+item.i" url='http://10.11.0.87:7105/' baseroute='/my-page/app'>
        </component>
      </div>
    </div>

    <micro-app name='app1' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>
    <micro-app name='app2' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>
    <micro-app name='app3' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>
    <micro-app name='app4' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>
    <micro-app name='app5' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>
    <div style="height: 100px"></div>
    <micro-app name='app6' url='http://10.11.0.87:7105' baseroute='/my-page/app/'></micro-app>



  <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>
    <iframe src="http://10.11.0.87:4000/#/Main/Centre"></iframe>

    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>
    <iframe src="http://10.11.0.87:7105/#/my-page/app"></iframe>

    -->





  </div>

</template>

<script>
export default {
  data() {
    return {
      arr:[
        {i:1},
        {i:2},
        {i:3},
        {i:4},
        {i:5},
        {i:6},
        {i:7},
      ]
    };
  },
}
</script>