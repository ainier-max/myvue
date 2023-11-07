<template>
  <div class="login" style="height: 100%;">
    <div style="position: relative;top: 50%;left:50%;margin-top: -160px;margin-left: -211px">
      <el-form ref="loginForm" label-width="80px" class="login-box">
        <h3 class="login-title">通用采集系统</h3>
        <el-form-item label="账号">
          <el-input type="text" placeholder="请输入账号" v-model="userid"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" placeholder="请输入密码" v-model="password"/>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" v-on:click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {commonSelectRequest, commonSelectRequestAndOtherParam, commonExcuteRequest} from "../../common/js/request.js"
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      userid: 'cbc',
      password: '123456'
    }
  },
  methods: {
    login() {
      this.getClientIP();
      const param = {};
      param.userid = this.userid;
      param.password = this.password;
      param.sql = "page_user.findUser";
      commonSelectRequest(window.axios, param, this.loginCallBack);
    },
    loginCallBack(result) {
      if (result.objects.length > 0) {
        console.log("登录成功");
        window.localStorage.setItem('loginUserid', result.objects[0].userid);
        this.$router.push('/Main/Centre')
      }
    },
    getClientIP() {
      axios.get('/cbc/getClientIP.cbc', {}
      ).then(function (response) {
        console.log("登陆IP地址", response.data[0].ip);
        window.localStorage.setItem('clientIP', response.data[0].ip);
      }).catch(function (error) {
        console.log("error", error);
      });
    },


    addTestData() {
      let areaArr=['厦门','福州','泉州'];
      let jqlxArr=['刑事','交通','纠纷'];
      let bjyfArr=['6月','7月','8月'];

      let areaIndex=Math.floor(Math.random()*3);
      let jqlxIndex=Math.floor(Math.random()*3);
      let bjyfIndex=Math.floor(Math.random()*3);

      console.log(areaIndex);
      let param = {};
      param.sql = "page_test_jq.insert";
      param.area=areaArr[areaIndex];
      param.jqlx=jqlxArr[jqlxIndex];
      param.bjyf=bjyfArr[bjyfIndex];
      param.bjnr="测试数据";
      commonExcuteRequest(axios, param, this.savePageBackCallBack);
    },
    savePageBackCallBack(result) {
      console.log("result:", result);
      if (result.state = "success") {
        this.$message.success('保存成功！');
      }
    },


  },
  mounted() {
    console.log("插入测试数据");
    for(let i=0;i<300;i++){
      //this.addTestData();
    }

  }

}
</script>

<style scoped>
.login {
  height: 100%;
  width: 100%;
  position: fixed;
  background-image: url(./img/background.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
  background-color: white;
  opacity: 0.9;
}

.login-title {
  text-align: center;
  margin: 0 auto 30px auto;
  color: #303133;
}
</style>
