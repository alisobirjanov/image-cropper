<template>
  <div ref="ell">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'


// const grids = [1, 1]
// const [ gridX, gridY ] = grids

const ell = ref<HTMLElement | null>(null)


provide('key', {
  getParentSize() {
    const { width, height } = (ell.value as HTMLElement)?.getBoundingClientRect()
    return {
      width, height
    }
  }
})

</script>

<style scoped>
div {
  margin: 30px;
  position: relative;
  /* width: 500px;
  height: 500px; */
  border: 1px solid #000;
}
</style>
