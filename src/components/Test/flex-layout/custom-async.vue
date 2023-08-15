<!-- 动态注册组件 -->
<template>
  <Suspense>
    <template v-if="noEmptyData">
      <component
        v-if="isRegistered"
        :is="element.type"
        :element="element"
        :config="config"
        :data="data"
        :dimensions="element.dataSet.dimensions"
        :metrics="element.dataSet.metrics"
        @init="handleInit"
        @refresh-config="refreshConfig"
        @refresh-data="refreshData"
        @refresh-params="refreshParams"
        @event="handleEvent"
      ></component>
    </template>
    <template v-else>
      <div class="custom-empty">
        <span>暂无数据</span>
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  ref,
  type ComponentInternalInstance,
  onUnmounted,
  defineComponent,
} from "vue";
import type { LayoutItem } from "@/types/layers";
import { ReplStore } from "@/components/code-repl/store";
import { useInstanceStore } from "@/stores/instance";
import { useConfigData } from "@/utils/useConfigData";
import { useRequestData } from "@/utils/useRequestData";
import { registerBlueMapEvent } from "@/utils/useBlueMap";
import {
  useRegisterComponent,
  hasRegisterComponent,
  type componentCustomInstance,
} from "@/utils/useRegisterComponent";
import { requestComponentContainerById } from "@/api/components";

const props = defineProps<{
  element: LayoutItem;
}>();

const { staticParams, staticData, data, refresh } = useRequestData(
  props.element
);
const [config, { updateConfig }] = useConfigData(props.element.config);

// 获取组件实例
const instance = getCurrentInstance() as unknown as componentCustomInstance;
const isRegistered = ref(false);

// 是否数据为空
const noEmptyData = computed(() => {
  return (
    props.element.type === "float-layout" ||
    (data.value && data.value.rows.length > 0)
  );
});

// 实例挂载方法
const handleInit = (instance: ComponentInternalInstance | null) => {
  // 组件注入
  const InstanceStore = useInstanceStore();
  InstanceStore.addInstance(props.element.id, instance);
};

// 更新配置项方法
const refreshConfig = (config: any) => {
  updateConfig(config);
};

// 更新数据方法
const refreshData = async (data: any) => {
  if (data) {
    staticData.value = data;
  } else {
    refresh();
  }
};

// 更新数据参数方法
const refreshParams = async (params: any) => {
  if (params) {
    staticParams.value = params;
  } else {
    refresh();
  }
};

// 自定义事件方法
const handleEvent = (eventType: string, params: any) => {
  registerBlueMapEvent(props.element.id, eventType, params);
};

// 数据请求方法
function getTemplateData(componentId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const res = await requestComponentContainerById({
      id: componentId,
    });
    resolve(res);
  });
}

// Tips: hasRegisterComponent 判断是否已注册组件，若是未注册的组件，则可以通过请求拉取对应的模板内容
if (!hasRegisterComponent(instance, props.element.type)) {
  getTemplateData(props.element.container).then((templateContent) => {
    if (templateContent) {
      const serialize = templateContent;

      const store = new ReplStore({
        serializedState: serialize,
        // starts on the output pane (mobile only) if the URL has a showOutput query
        showOutput: false,
        // starts on a different tab on the output pane if the URL has a outputMode query
        // and default to the "preview" tab
        outputMode: "preview",
      });
      // 注册局部组件
      useRegisterComponent(instance, {
        name: props.element.type,
        store: store,
        isRegistered,
      });
    } else {
      console.warn("未找到对应组件ID：", props.element.container);
    }
  });
} else {
  // 触发渲染
  isRegistered.value = true;
}

// 可以将一些方法迁移至上层
defineExpose({
  refreshConfig,
  refreshData,
  refreshParams,
});

// 清除实例ID
onUnmounted(() => {
  const InstanceStore = useInstanceStore();
  InstanceStore.removeInstance(props.element.id);
});
</script>

<style lang="less" scoped>
.custom-empty {
  display: flex;
  justify-content: center;
  justify-items: center;
}
</style>
