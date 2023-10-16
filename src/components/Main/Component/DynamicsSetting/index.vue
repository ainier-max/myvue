<template>
  <div style="width: 100%;height: 100%">
    <!--
    <div style="color:red">注：下面参数调整不会保存至库中,仅供验证</div>
    -->
    <div v-for="item in visualizeOptions">
      <div v-if="item.type=='num'" style="margin-top: 5px">
        <p style="color: rgba(255,255,255,0.8)">{{item.label}}</p>
        <div style="height: 3px"></div>
        <el-input-number v-model='item.value' :min='0' @change="numChange(item)"></el-input-number>
      </div>

      <div v-if="item.type=='boolean'" style="margin-top: 5px">
        <p style="color: rgba(255,255,255,0.8)">{{item.label}}</p>
        <div style="height: 3px">{{item.options}}</div>
        <el-switch v-model="item.value"  @change="booleanChange(item)"/>
      </div>

      <div v-if="item.type=='color'" style="margin-top: 5px">
        <p style="color: rgba(255,255,255,0.8)">{{item.label}}</p>
        <div style="height: 3px">{{item.options}}</div>
        <el-color-picker v-model="item.value" show-alpha @change="colorChange(item)"/>
      </div>

      <div v-if="item.type=='string'" style="margin-top: 5px">
        <p style="color: rgba(255,255,255,0.8)">{{item.label}}</p>
        <div style="height: 3px">{{item.options}}</div>
        <el-input v-model="item.value" style="width:200px" @input="stringChange(item)" />
      </div>

      <div v-if="item.type=='photo'" style="margin-top: 5px">
        <p style="color: rgba(255,255,255,0.8)">{{item.label}}</p>
        <div style="height: 5px"></div>
        <SetPhoto :option="item"></SetPhoto>
      </div>
    </div>

  </div>
</template>



<script>
import SetPhoto from './SetPhoto/index.vue'
import {getCurrentInstance} from "vue";
export default {
  name: "DynamicsSetting",
  props: {
    visualizeOptions: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  components: {
    SetPhoto:SetPhoto,
  },
  watch: {
    visualizeOptions: {
      handler(newValue, oldValue) {
        //console.log("newValue:",newValue)
      },
      immediate: true,
      deep: true
    }
  },
  methods:{
    numChange(item){
      this.$emit("updateConfigParam",item);
    },
    booleanChange(item){
      this.$emit("updateConfigParam",item);
    },
    colorChange(item){
      console.log("item:",item);
      this.$emit("updateConfigParam",item);
    },
    stringChange(item){
      this.$emit("updateConfigParam",item);
    },
    photoChange(item){
      this.$emit("updateConfigParam",item);
    }

  },
  mounted() {
    window.cbcDynamicsSetting = getCurrentInstance();
  },

}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: #222629;
}

:deep(.el-input) {
  --el-input-border-color: #5B5C5E;
}

:deep(.el-input-number__increase) {
  background: #222629;
  border-left: 1px solid #5B5C5E;
}

:deep(.el-input-number__decrease) {
  background: #222629;
  border-right: 1px solid #5B5C5E;
}
</style>