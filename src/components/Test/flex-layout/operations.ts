import type { ToRef } from "vue";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import type { LayoutItem } from "@/types/layers";

// 默认布局数据
const DEFAULT_LAYER_DATA = {
  attr: {
    w: 100,
    h: "auto",
    padding: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    margin: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    backgroundColor: "",
    border: {
      width: 1,
      type: "solid",
      color: ""
    }
  },
  content: [],
  dataSet: {
    data: {
      columns: [],
      rows: [],
      map: {}
    }
  }
}

// 默认布局容器数据
const DEFAULT_FLEX_LAYOUT_DATA = _.merge({}, DEFAULT_LAYER_DATA, {
  name: "Flex 容器",
  type: "docker",
  attr: {
    w: 100,
    h: 11,
    x: 0,
    y: 0
  },
  config: {
    type: "row",
  },
  dataSet: {
    show: false,
    data: {
      columns: [],
      rows: [],
      map: {}
    }
  }
});

// add data item
export const addComponentItem = (
  newIndex: number,
  layersData: LayoutItem[],
  element: LayoutItem
): void => {
  const { id, type, ...others } = element;
  const DEFAULT_TPL = type === 'docker' ?  DEFAULT_FLEX_LAYOUT_DATA : DEFAULT_LAYER_DATA;
  const item = _.merge({}, DEFAULT_TPL, {
    id: uuid(),
    type,
    ...others
  });
  layersData.splice(newIndex, 1, item);
};

// change data item
export const changeLayoutItem = (data: LayoutItem[]): void => {
  changeElementWidth(data);
};

// split box
export const splitLayoutItem = (item: LayoutItem) => {
  const { id, type, config, content, ...others } = item;
  // 切割盒子
  if (item.content.length > 0) {
    const newItem = _.merge({}, DEFAULT_FLEX_LAYOUT_DATA, { id: uuid(), ...others });
    item.content.push(newItem);
  } else {
    for (let i = 0; i < 2; i++) {
      const newItem = _.merge({}, DEFAULT_FLEX_LAYOUT_DATA, { id: uuid(), ...others });
      item.content.push(newItem);
    }
  }

  changeElementWidth(item.content);
};

// delete box
export const deleteLayoutItem = (id: string, data: ToRef<LayoutItem[]>) => {
  let index = data.value.findIndex((item) => item.id === id);
  data.value.splice(index, 1);

  changeElementWidth(data.value);
};

// change width
export const changeElementWidth = (data: LayoutItem[]): void => {
  const len = data.length;
  data.map((item) => {
    item.attr.w = 100 / len;
  });
};
