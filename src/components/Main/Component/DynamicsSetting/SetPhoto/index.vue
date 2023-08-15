<template>
  <div>
    <div>
      <el-popconfirm title="确定删除该照片?"
                     confirm-button-text="删除"
                     cancel-button-text="取消"
                     @confirm="confirmEvent"
                     @cancel="cancelEvent">
        <template #reference>
          <img :src="option.value" style="width: 50px;height: 50px;padding-right: 10px">
        </template>
      </el-popconfirm>
    </div>

    <el-upload
        ref="uploadRef"
        style="width: 300px"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :data="paramData"
        :before-remove="beforeRemove"
        :before-upload="beforeAvatarUpload"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :list-type="listType">
      <el-button size="small" type="warning">图片上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
    </el-upload>

  </div>
</template>

<script>

import { genFileId } from 'element-plus'

export default {
  props: {
    option: {
      type: Object,
      default: {}
    },
  },
  data: function () {
    return {
      uploadUrl:window.cbcConfig.uploadUrl,
      getFileUrl:window.cbcConfig.getFileUrl,
      deleteFileUrl:window.cbcConfig.deleteFileUrl,
      fileList: [],
      listType: 'text',
      paramData: {},
      fileEndFlag:false,
      fileTypeErrorTip : "只能上传jpg/png文件",
      fileTypeJudge: ['image/png','image/jpeg'],
      photoUUID:"",
    }
  },
  components: {

  },

  created() {

  },
  watch: {

  },
  methods: {
    //删除照片
    confirmEvent() {
      this.photoUUID="";
    },
    cancelEvent(){
      console.log("取消");
    },

    //根据UUID删除文件
    handleRemove(file, fileList) {
      console.log("handleRemove-file", file);
      console.log("handleRemove-fileList", this.fileList);
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid == file.uid) {
          this.fileList.splice(i, 1);
          i--;
        }
      }

      let param1 = {};
      param1.uuid = file.uuid;
      axios.post(this.deleteFileUrl, param1, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "dataType": "json"
        }
      }).then(response => {
            if (response.data[0].state == "success") {
              console.log("成功删除文件：", response.data[0].state);
            } else {
              console.error("服务异常,错误信息：", response.data[0].message);
            }
          }).catch(error => {
        console.error("服务异常,错误信息：", error);
      });
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log("this.$refs445",this.$refs);
      this.$refs.uploadRef.clearFiles();
      let the=this;
      the.$nextTick(() => {
        files[0].uid = genFileId();
        console.log("files[0]11",files[0]);
        the.$refs.uploadRef.handleStart(files[0]);
        the.$refs.uploadRef.submit();
      })
    },
    beforeRemove(file, fileList) {
      if (file && file.status === "success") {
        return this.$confirm(`确定移除 ${file.name}？`);
      }
    },
    beforeAvatarUpload(file) {
      this.fileEndFlag = false;
      console.log("上传之前的文件判断", file);
      let isChooseFile = false;
      let isSize5M = false;
      for (let i = 0; i < this.fileTypeJudge.length; i++) {
        if (file.type == this.fileTypeJudge[i]) {
          isChooseFile = true;
        }
      }
      if (file.size / 1024 / 1024 < 5) {
        isSize5M = true;
      }
      if (isChooseFile == false) {
        this.$message.error(this.fileTypeErrorTip);
      }
      if (isSize5M == false) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }

      return isChooseFile && isSize5M;
    },
    handleAvatarSuccess(res, file) {
      console.log("res1111:", res, file);
      let fileObj = {};
      fileObj.name = file.name;
      fileObj.url = this.getFileUrl+"?uuid=" + file.response[0].uuid + "&type=photo";
      fileObj.uuid = file.response[0].uuid;
      this.fileList.push(fileObj);
      this.fileEndFlag = true;
      console.log("uuid:",fileObj.uuid);
      this.photoUUID=fileObj.uuid;

      let newUrl=this.getFileUrl+"?uuid="+this.photoUUID+"&type=photo";
      this.option.value=newUrl;
      console.log("this.option889",this.option);
      window.cbcDynamicsSetting.ctx.photoChange(this.option);


    },
    //获取url参数
    GetQueryString(value,name){
      let valueTemp=value.split("getFile.cbc?")[1];
      let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      let r = valueTemp.match(reg);
      if(r!=null){
        return  unescape(r[2]);
      }else{
        return null;
      }
    }

  },
  mounted() {
    console.log("this.parent");
    console.log("SetPhoto--options",this.option);
    let param = {};
    param.table_name = "低代码开发平台";
    param.file_type = "photo";
    this.paramData.param = JSON.stringify(param);
    if(this.option.value.indexOf("getFile.cbc?")>=0){
      this.photoUUID=this.GetQueryString(this.option.value,"uuid");
    }

    console.log("this.photoUUID",this.photoUUID);

  }
}
</script>

<style scoped>
:deep(.el-upload-list__item) {
  width: 200px;
}
</style>