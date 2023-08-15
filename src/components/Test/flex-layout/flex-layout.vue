<template>
  <draggable
    :class="['flex-layout', `is-${type}`, previewClass]"
    tag="ul"
    v-model="list"
    :group="{ name: 'g1' }"
    handle=".flex-layout__tag"
    ghostClass="ghost"
    :animation="150"
    item-key="id"
    @change="handleChange"
  >
    <template #item="{ element }">
      <flex-item
        v-model="value"
        :element="element"
        :data="list"
        :parent-type="type"
      ></flex-item>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
import { ref, withDefaults, watchEffect, type Ref, computed } from "vue";
import draggable from "vuedraggable";
import FlexItem from "./flex-item.vue";
import type { LayoutItem } from "@/types/layers";
import {
  addComponentItem,
  changeLayoutItem,
} from "./operations";

// props
const props = withDefaults(
  defineProps<{
    /**
     * 数据源列表
     */
    data: LayoutItem[];
    /**
     * 行列类型
     */
    type?: string;
    /**
     * 选中值
     */
    modelValue?: string;
    /**
     * 是否预览模式
     */
    isPreview?: boolean;
  }>(),
  {
    type: "column",
    modelValue: "",
    isPreview: false
  }
);
// emits
const emits = defineEmits(["update:data", "update:modelValue"]);

// 监听数据源
let list: Ref<LayoutItem[]> = ref([]);
watchEffect(() => {
  list = ref(props.data);
});

// 监听选中值
const value = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});
const previewClass = computed(() => {
  return props.isPreview ? 'is-preview' : '';
})

// events
const handleChange = (data: any) => {
  // 检测操作类型
  if (data.added) {
    let { element, newIndex } = data.added;

    // 检测是新增，还是改变已有的容器
    if (element.id === null) {
      addComponentItem(newIndex, list.value, element);
    }
  }

  // 改变选项
  changeLayoutItem(list.value);

  // 提交改变数据
  emits("update:data", list.value);
};
</script>

<style lang="less">
.flex-layout {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 50px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: start;
  background-color: #fff;
  &.is-column {
    flex-direction: column;
    > .flex-layout__item > .flex-layout__resizeW {
      display: none !important;
    }
  }
  &.is-row {
    flex-direction: row;
    > .flex-layout__item > .flex-layout__resizeH {
      display: none !important;
    }
  }
  &__item {
    position: relative;
    display: block;
    min-width: 0;
    width: calc(100% - 8px);
    min-height: 50px;
    padding: 20px 0px 0px;
    border: 1px solid #ddd;
    margin: 8px 4px;
    text-align: center;
    user-select: none;
    &.is-active {
      border-color: #1890ff;
    }
    &.ghost {
      border-style: dashed;
      border-color: green;
    }
    + .flex-layout__item > .flex-layout__resizeW {
      display: block;
    }
  }
  &.is-preview {
    .flex-layout__item {
      width: 100%;
      margin: 0;
      padding: 0;
      border: 0;
    }
    .flex-layout__tag,
    .flex-layout__resizeW,
    .flex-layout__resizeH {
      display: none;
    }
  }
  &__tag {
    position: absolute;
    left: 0;
    top: 0;
    padding: 2px;
    border-radius: 2px;
    line-height: 1;
    background: #e2e2e2;
    cursor: grab;
  }
  &__tools {
    position: absolute;
    right: 0;
    top: 0;
    user-select: none;
    cursor: pointer;
    i {
      padding: 0;
      margin: 0 4px;
      line-height: 1;
      border-radius: 2px;
      background: #e2e2e2;
    }
  }
  &__resizeH {
    position: absolute;
    bottom: 2px;
    left: 50%;
    margin-left: -10px;
    width: 20px;
    height: 4px;
    border-bottom: 2px solid #ccc;
    cursor: ns-resize;
  }
  &__resizeW {
    display: none;
    position: absolute;
    left: -8px;
    top: 50%;
    margin-top: -10px;
    width: 4px;
    height: 20px;
    border-right: 2px solid #ccc;
    cursor: ew-resize;
  }
}
</style>
