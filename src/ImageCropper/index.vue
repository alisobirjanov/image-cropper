<template>
  <DraggableResizableContainer class="cropper bg">

    <div class="cropper-wrap-box">
      <div class="cropper-canvas">
        <img v-if="imgData.url" :src="imgData.url" alt="Picture" class="" :style="getStyles">
      </div>
    </div>

    <div class="cropper-modal"></div>

    <DraggableResizable v-model="crop">
      <span class="view-box" v-if="imgData.url">
        <img :src="imgData.url" alt="file.png" :style="getViewBoxStyles" />
      </span>
    </DraggableResizable>
  </DraggableResizableContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DraggableResizableContainer from '../DraggableResizable/DraggableResizableContainer.vue'
import DraggableResizable from '../DraggableResizable/DraggableResizable.vue'
// @ts-ignore
import imgUrl from '../assets/img.jpg'

import { Cropper } from './Cropper'

const cropper = new Cropper({width: 500, height: 500})

const crop = ref({
  width: 250,
  height: 250,
  x: 100,
  y: 100,
});


const imgData = ref({
  url: '',
  width: 0,
  height: 0,
  x: 0,
  y: 0
})

const getStyles = computed(() => {
  const { width, height, x, y } = imgData.value
  return {
    width: width + 'px',
    height: height + 'px',
    transform: `translateX(${x}px) translateY(${y}px)`
  }
})

const getViewBoxStyles = computed(() => {
  const { x, y } = crop.value
  const { width, height, x: a, y: b } = imgData.value

  return {
    width: width + 'px',
    height: height + 'px',
    transform: `translateX(${-x + a}px) translateY(${-y + b}px)`
  }
})

function save() {
  cropper.savaAs(crop.value)
}


function selectImage() {
  cropper.selectImage().then(data => {
    imgData.value = data
  })
}

cropper.loadImage(imgUrl).then(data => {
  imgData.value = data
})

defineExpose({
  selectImage,
  saveAs: save
})

</script>

<style>
.cropper {
  width: 500px;
  height: 500px;
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: hidden;
}

.cropper-modal {
  background-color: #000;
  opacity: 0.5;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.view-box {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}

</style>