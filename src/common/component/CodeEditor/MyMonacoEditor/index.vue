<template>
  <div :id="id" style="height: 100%;width: 100%"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import { toRaw } from 'vue'
export default {
  props: {
    code: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: "code"
    },

  },
  data() {
    return {
      monacoInstance:null,
    }
  },
  components: {

  },

  methods:{
    layout(){
      console.log("monacoInstance--layout");
      toRaw(this.monacoInstance).layout();//销毁实例
    },
    destroy(){
      toRaw(this.monacoInstance).dispose();//销毁实例
    },
    init(){
      //console.log("初始化代码编辑器11",this.code);
      let the=this;
      this.monacoInstance=monaco.editor.create(document.getElementById(this.id),{
        value:this.code,
        //javascript,json
        language:"html",
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark
        autoIndent: true, // 自动缩进
      });
      this.monacoInstance.onDidChangeModelContent((event) => {
        const newValue=toRaw(this.monacoInstance).getValue()
        the.$emit('update',newValue);
      })
    }
},
  mounted() {
    this.init();
    window.addEventListener('resize',()=>{
      //console.log('处理窗口缩放时要处理的逻辑操作！');
      toRaw(this.monacoInstance).layout();//销毁实例
    });

  }

}
</script>