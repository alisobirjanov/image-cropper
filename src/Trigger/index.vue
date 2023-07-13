<template>
  <slot :open="open" />

  <Teleport to="body">
    <div class="popup" :style="{ top: top + 'px', left: left + 'px' }">
      <slot name="content" :test="234" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const top = ref(0)
const left = ref(0)

function open(event: MouseEvent) {
  const { x, y, width } = (event.target as HTMLElement).getBoundingClientRect()
  console.log('open', x, y)
  top.value = y - 20
  left.value = x + Math.round(width / 2)
}

</script>

<style>
.popup {
  display: inline-block;
  position: absolute;
  border: 1px solid red;
}
</style>