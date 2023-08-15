<template>
  <div>
    <draggable
        :list="list"
        :disabled="!enabled"
        item-key="name"
        class="list-group"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        style="display: flex;flex-direction: row;width: 500px;height: 100px">

      <template #item="{ element }">

        <div style="flex-basis:20%;background: yellow;margin-left: 20px" :class="{ 'not-draggable': !enabled }">
          <div>{{element.name}}</div>
        </div>

      </template>

    </draggable>
  </div>
</template>

<script>


export default {

  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ]
    };
  }
};
</script>
<style scoped>

</style>