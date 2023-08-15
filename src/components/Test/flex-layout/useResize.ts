import { useEventListener } from '@yx-frame/hooks';
import { type VNodeRef, type ToRef, reactive, unref, isVNode } from 'vue';
import type { LayoutItem } from '@/types/layers';
import { useFlexLayoutStore } from "@/stores/flex-layout";

export type DragStatus = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export function useResizeHeight(target: VNodeRef, element: ToRef<LayoutItem>) {
  // 拖拽数据
  let dragStatus: DragStatus = reactive({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  let parent: HTMLDivElement;
  const VIEW_HEIGHT = document.documentElement.clientHeight;

  const handleMove = (event: MouseEvent): void => {
    const { clientY } = event;
    element.value.attr.h = (clientY - dragStatus.y + dragStatus.h) * 100 / VIEW_HEIGHT;
  };

  const handleMoveEnd = () => {
    document.removeEventListener('mousemove', handleMove, false);
  };

  useEventListener(
    'mousedown',
    (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      parent = target.parentElement as HTMLDivElement;
      const { clientHeight, clientWidth } = parent;
      const { clientX, clientY } = event;

      // 记录初始状态
      dragStatus = reactive({
        x: clientX,
        y: clientY,
        w: clientWidth,
        h: clientHeight,
      });

      document.addEventListener('mousemove', handleMove, false);
      document.addEventListener('mouseup', handleMoveEnd, false);
    },
    {
      target: target,
    }
  );
}

export function useResizeWidth(target: VNodeRef, element: ToRef<LayoutItem>, data: ToRef<LayoutItem[]>) {
  // 拖拽数据
  let dragStatus = {
    x: 0,
    w: 0,
    currentModuleWidth: 0,
    prevModuleWidth: 0
  };
  let parent: HTMLDivElement;

  const handleMove = (event: MouseEvent): void => {
    const { clientX } = event;

    const index = data.value.findIndex(item => item === element.value);
    const prevElement = data.value[index -1];
    const increment = (clientX - dragStatus.x) * dragStatus.currentModuleWidth / dragStatus.w;

    prevElement.attr.w = increment + dragStatus.prevModuleWidth
    element.value.attr.w = -increment + dragStatus.currentModuleWidth;

  };

  const handleMoveEnd = () => {
    document.removeEventListener('mousemove', handleMove, false);
  };

  useEventListener(
    'mousedown',
    (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      parent = target.parentElement as HTMLDivElement;
      const { clientWidth } = parent;
      const { clientX } = event;

      // 前个模块
      const index = data.value.findIndex(item => item === element.value);
      const prevElement = data.value[index -1];

      // 记录初始状态
      dragStatus = {
        x: clientX,
        w: clientWidth,
        currentModuleWidth: element.value.attr.w,
        prevModuleWidth: prevElement.attr.w
      };

      document.addEventListener('mousemove', handleMove, false);
      document.addEventListener('mouseup', handleMoveEnd, false);
    },
    {
      target: target,
    }
  );
}

/**
 * 画布监听的全局状态
 * @param {VNodeRef} target 画布 DOM
 */
export function useCanvasGlobalEvents(target: VNodeRef) {
  const _target = isVNode(target) ? target : unref(target)?.$el;
  useEventListener(
    'mousedown',
    (event: MouseEvent) => {
      const eventElement = event.target as HTMLDivElement;

      // 查找上级元素
      const parentElement = (ele: HTMLDivElement) => {
        const classList = ele?.classList;
        if (!ele || classList && classList.value.includes("flex-layout")) return ;
        if (classList.value === 'view-area') {
          // 移除默认值
          const flexLayoutStore = useFlexLayoutStore();
          flexLayoutStore.$patch({ selectedItemId: "" });
        } else {
          parentElement(ele.offsetParent as HTMLDivElement);
        }
      }

      parentElement(eventElement);
    },
    {
      target: _target
    }
  );
}
