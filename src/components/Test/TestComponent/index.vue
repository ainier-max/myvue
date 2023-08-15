<template>
  <div>
    <el-form :model="form" label-width="50px" :rules="rules" ref="formRef">
      <div v-for="(item, index) in formInfos">
        <el-form-item  v-if="item.type=='el-input'" :prop="item.key" :label="item.label">
          <el-input v-model="form[item.key]" />
        </el-form-item>

        <el-form-item  v-if="item.type=='el-select'" :prop="item.key"  :label="item.label">
          <el-select v-if="item.type=='el-select'" v-model="form[item.key]">
            <el-option v-for="(option, index) in item.options" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>

        <el-form-item  v-if="item.type=='el-button'" >
          <el-button type="primary" @click="onSubmit">{{item.label}}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  props: {
    component: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      form: {},
      "formInfos": [{
        "type": "el-input",
        "label": "姓名",
        "key": "name"
      }, {
        "type": "el-select",
        "label": "地区",
        "key": "area",
        "options": [{
          "label": "厦门",
          "value": "厦门"
        }, {
          "label": "福州",
          "value": "福州"
        }, {
          "label": "泉州",
          "value": "泉州"
        }]
      }, {
        "type": "el-button",
        "label": "新增",
        "key": "submit"
      }],
      rules: {},
    }
  },
  created(){
    let obj={};
    for(let i = 0; i < this.formInfos.length; i++){
      if(this.formInfos[i].type!='el-button'){

        obj[this.formInfos[i].key]=[{required: true, message: '不能为空', trigger: 'blur'}];
      }
      this.form[this.formInfos[i].key]="";
    }
    //console.log("obj:",obj);
    this.rules=reactive(obj);
    console.log("规则：",this.rules);
  },
  mounted() {
    //console.log("this.component122",this.component);
  },
  methods: {
    onSubmit(){
      var flag = false;
      console.log("this.$refs.formRef",this.$refs.formRef);
      this.$refs.formRef.validate((valid) => {
        console.log("valid",valid);
        flag = valid;
        console.log("flag",flag);
        this.$emit('event', "submit", this.form ,this.component);
      });

    }
  }

}
</script>

<style scoped>

</style>

