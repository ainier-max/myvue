<template>
  <div v-if="currentBlueScript?.config" style="margin-left: 18px">
    <el-divider content-position="left"
      ><span style="font-size: 18px">输入参数</span></el-divider
    >
    <div
      v-for="(item, index) in currentBlueScript.config.blue_script_in_out_config
        .in"
      :key="index"
    >
      <div style="font-size: 14px">
        {{ index + 1 }}.{{ item.label }}({{ item.type }})

        <el-switch
          v-model="item.show"
          size="large"
          active-text="开"
          inactive-text="关"
          @change="handleChange($event, item)"
        />
      </div>

      <div v-if="item.type == 'object'">
        <table>
          <tr>
            <td>
              <el-input
                type="textarea"
                v-if="
                  typeof item.value == 'object' &&
                  item.value != null &&
                  item.value.noSaveFlag != true
                "
                disabled
                :value="JSON.stringify(item.value)"
                style="width: 250px"
                placeholder=""
              />
              <el-input
                type="textarea"
                v-if="
                  typeof item.value == 'object' &&
                  item.value != null &&
                  item.value.noSaveFlag == true
                "
                disabled
                :value="item.value.noSaveDescribe"
                style="width: 250px"
                placeholder="12"
              />
              <el-input
                v-if="
                  typeof item.value == 'number' || typeof item.value == 'string'
                "
                disabled
                :value="item.value"
                style="width: 250px"
                placeholder=""
              />
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type == 'boolean'">
        <table>
          <tr>
            <td>
              <el-input
                v-if="typeof item.value == 'object'"
                disabled
                type="textarea"
                :value="JSON.stringify(item.value)"
                style="width: 250px"
                placeholder=""
              />
              <el-input
                v-if="typeof item.value != 'object'"
                disabled
                :value="item.value"
                style="width: 250px"
                placeholder=""
              />
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type == 'string'">
        <table>
          <tr>
            <td>
              <el-input
                v-model="item.value"
                style="width: 250px"
                placeholder=""
              />
            </td>
            <td style="padding-left: 5px">
              <CircleClose
                style="color: red; width: 2em; height: 2em"
                @click="deleteParamIn(item.key)"
              />
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type == 'textarea'">
        <table>
          <tr>
            <td>
              <el-input
                v-model="item.value"
                style="width: 250px"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder=""
              />
            </td>
          </tr>
        </table>
      </div>

      <div v-if="item.type == 'number'">
        <table>
          <tr>
            <td>
              <el-input
                v-model="item.value"
                style="width: 250px"
                placeholder=""
              />
            </td>
            <td style="padding-left: 5px">
              <CircleClose
                style="color: red; width: 2em; height: 2em"
                @click="deleteParamIn(item.key)"
              />
            </td>
          </tr>
        </table>
      </div>
      <div v-if="item.type == 'array'">
        <el-input
          type="textarea"
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
      </div>
      <div v-if="item.type == 'event'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
        <el-input
          v-if="typeof item.value != 'object'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>

      <div v-if="item.type == 'function'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
        <el-input
          v-if="typeof item.value != 'object'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>
      <!--不确定输出类型-->
      <div v-if="item.show == true && item.type == 'doubtful'">
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'boolean' &&
            item.value != null
          "
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag != true
          "
          disabled
          :value="JSON.stringify(item.value)"
          style="width: 250px"
          placeholder=""
        />
        <el-input
          type="textarea"
          v-if="
            typeof item.value == 'object' &&
            item.value != null &&
            item.value.noSaveFlag == true
          "
          disabled
          :value="item.value.noSaveDescribe"
          style="width: 250px"
          placeholder="12"
        />
        <el-input
          v-if="typeof item.value == 'number' || typeof item.value == 'string'"
          disabled
          :value="item.value"
          style="width: 250px"
          placeholder=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { blueScriptDataStore } from "@/store/blueScriptData.ts";
const blueScriptDataStoreObj = blueScriptDataStore();
const { currentBlueScript } = storeToRefs(blueScriptDataStoreObj);
import { ElMessage } from "element-plus";

const handleChange = (event, item) => {
  console.log("handleChange--event", event);
  console.log("handleChange--item", item);
  if (event == false) {
    currentBlueScript.value.graphNode.removePort(item.portID);
  } else {
    currentBlueScript.value.graphNode.addPort({
      key: item.key,
      id: item.portID,
      group: "in",
      markup: [
        {
          tagName: "rect",
          selector: "rect",
        },
      ],
      attrs: {
        rect: {
          magnet: true,
          stroke: "#31d0c6",
          fill: "#ffffff",
          strokeWidth: 2,
          width: 10,
          height: 10,
          x: -5,
          y: -5,
        },
        text: {
          text: item.label, // 标签文本
          fill: "rgba(255,255,255,0.8)",
          fontSize: 12, // 文字大小
        },
      },
    });
  }
};
const deleteParamIn = (key) => {
  for (
    let i = 0;
    i < currentBlueScript.value.config.blue_script_in_out_config.in.length;
    i++
  ) {
    if (
      key == currentBlueScript.value.config.blue_script_in_out_config.in[i].key
    ) {
      //删除蓝图节点端口
      currentBlueScript.value.graphNode.removePort(
        currentBlueScript.value.config.blue_script_in_out_config.in[i].portID
      );
      currentBlueScript.value.config.blue_script_in_out_config.in.splice(i, 1);
      i = i - 1;
    }
  }
};
</script>

<style scoped></style>
