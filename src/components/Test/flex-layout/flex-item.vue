<template>
  <li :class="flexItemClass" :style="flexItemStyle">
    <div class="flex-layout__tag" @click="emits('update:modelValue', element.id)">
      {{ element.name + ' ' + element.id?.toString().substring(0, 4) }}
    </div>
    <div class="flex-layout__tools" v-if="element.id === modelValue">
      <i v-if="element.type === 'docker'" @click="handleToggleType(element)">{{ element.config.type }}</i>
      <i v-if="element.type === 'docker'" @click="handleSplitBox(element)">split</i>
      <i @click="handleDelete(element)">delete</i>
    </div>
    <template v-if="element.type === 'docker'">
      <flex-layout v-model:data="element.content" v-model="value" :type="element.config.type" />
    </template>
    <template v-else>
      <custom-async :element="element"></custom-async>
      <!-- <component :is="element.type" :element="element"></component> -->
    </template>
    <div class="flex-layout__resizeW" ref="dragWRef"></div>
    <div
      class="flex-layout__resizeH"
      v-show="isContainerHide"
      ref="dragHRef"
    ></div>
  </li>
</template>

<script lang="ts" setup>
import { ref, type VNodeRef, computed, toRefs } from 'vue';
import { useResizeHeight, useResizeWidth } from './useResize';
import type { LayoutItem } from '@/types/layers';
import FlexLayout from './flex-layout.vue';
import CustomAsync from "./custom-async.vue";
import { splitLayoutItem, deleteLayoutItem } from './operations';

// props
const props = defineProps<{
  element: LayoutItem;
  data: LayoutItem[];
  parentType: string;
  modelValue: string;
}>();

// emits
const emits = defineEmits(['update:modelValue']);

const flexItemClass = computed(() => {
  return {
    'flex-layout__item': true,
    'is-active': props.element.id === props.modelValue
  }
})
const flexItemStyle = computed(() => {
  const { w, h } = props.element.attr;
  const { config, content } = props.element;
  const flexBasis = props.parentType === 'column' ? 'auto' : w + '%';
  const resetAutoHeight =
    (config.type === 'column' && content.length > 0) || props.parentType === 'row';
  const height = resetAutoHeight ? 'auto' : h === 'auto' ? 'auto' : h + 'vh';
  return {
    flexBasis: flexBasis,
    height: height,
    minHeight: height
  };
});

const isContainerHide = computed(() => {
  const { config, content } = props.element;
  return !(config.type === 'column' && content.length > 0);
});
const value = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

// events
const handleToggleType = (item: LayoutItem) => {
  item.config.type = item.config.type === 'column' ? 'row' : 'column';
};
const handleSplitBox = (item: LayoutItem) => {
  splitLayoutItem(item);
};
const handleDelete = (item: LayoutItem) => {
  const { data } = toRefs(props);
  deleteLayoutItem(item.id, data);
};

// dragHRef
const dragHRef = ref<VNodeRef>();
const { data, element } = toRefs(props);
useResizeHeight(dragHRef, element);

const dragWRef = ref<VNodeRef>();
useResizeWidth(dragWRef, element, data);
</script>
