<template>
  <div style="height: 100%;overflow-y:hidden">
    <div style="height:60px;background-color: #453628;display: flex;flex-direction: row;align-items:center" >
      <div style="flex-basis:80%">
        <span style="font-size: 28px;color:white;font-weight: bold;padding-left: 20px">低代码开发平台</span>
      </div>

      <div style="flex-basis:20%;color:white;padding-right: 20px;" align="right" >{{ userid }}</div>
    </div>

    <div style="width:100%;height:calc(100% - 60px);display: flex;flex-direction: row;">
      <div style="height:100%;flex-basis:200px;background-color: #2c3e50">
        <el-menu
              style="background:transparent ;"
              :default-active="activeIndex"
              class="elmenu-vertical"
              @select="handleSelect_menu"
              @open="handleOpen"
              @close="handleClose"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-menu-item index="1">
                <i class="el-icon-document"></i>
                <span slot="title" style="font-size: 16px">平台中心</span>
              </el-menu-item>

              <el-menu-item index="2">
                <i class="el-icon-location"></i>
                <span slot="title" style="font-size: 16px">前端组件</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-location"></i>
                <span slot="title" style="font-size: 16px">打包组件</span>
              </el-menu-item>


              <el-menu-item index="3">
                <i class="el-icon-location"></i>
                <span slot="title" style="font-size: 16px">蓝图工具</span>
              </el-menu-item>

              <el-menu-item index="5">
                <i class="el-icon-location"></i>
                <span slot="title" style="font-size: 16px">平台手册</span>
              </el-menu-item>

            </el-menu>
      </div>

      <div style="flex: 1;">
        <router-view></router-view>
      </div>
    
    </div>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      userid: '',
    };
  },
  mounted: function () {
    //如果未登陆，则跳转登陆页
    this.userid = window.localStorage.getItem('loginUserid');
    if (this.userid == null || this.userid == '' || this.userid == 'null') {
      this.$router.push('/Login');
    }
    //根据路由信息，高亮菜单项
    if(this.$route.fullPath.indexOf("/Main/Centre")>=0){
      this.activeIndex="1";
    }

    if(this.$route.fullPath.indexOf("/Main/Uphold")>=0 || this.$route.fullPath.indexOf("/Main/ComponentUpload")>=0){
      this.activeIndex="2";
    }

    if(this.$route.fullPath.indexOf("/Main/BlueScript")>=0){
      this.activeIndex="3";
    }

    if(this.$route.fullPath.indexOf("/Main/Md")>=0){
      this.activeIndex="5";
    }



  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect_menu(key, keyPath) {
      console.log(key, keyPath);
      if (key == "1") {
        console.log("平台中心");
        this.$router.push('/Main/Centre')
      }
      if (key == "2") {
        console.log("页面组件维护");
        this.$router.push('/Main/Uphold')
      }
      if (key == "3") {
        console.log("蓝图工具维护");
        this.$router.push('/Main/BlueScript')
      }
      if (key == "4") {
        console.log("打包组件维护");
        this.$router.push('/Main/PackComponent')
      }
      if (key == "5") {
        console.log("平台手册");
        this.$router.push('/Main/Md')
      }
    }
  }
}
</script>

<style>

.el-menu {
  border-right: solid 0px #333 !important;
  background-color: #2c3e50 !important;
}

.logo {
  width: 200px;
  float: left;
  text-align: center;
  font-weight: 900;
  font-size: 20px
}

.elmenu-horizontal {
  margin-left: 201px;
}

.el-menu-item:focus, .el-menu-item:hover {
  background-color: rgba(13, 13, 13, 0.5) !important;
}

.el-submenu__title:hover {
  background-color: rgba(13, 13, 13, 0.5) !important;
}


</style>
