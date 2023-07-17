<template>
  <DraggableResizableContainer class="cropper bg">

    <div class="cropper-wrap-box">
      <div class="cropper-canvas">
        <img v-if="imgData.url" :src="imgData.url" alt="Picture" class="" :style="getStyles">
      </div>
    </div>

    <div class="cropper-modal"></div>

    <DraggableResizable v-model="data">
      <span class="view-box" v-if="imgData.url">
        <img :src="imgData.url" alt="file.png" :style="getViewBoxStyles" />
      </span>
    </DraggableResizable>
  </DraggableResizableContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DraggableResizableContainer from '../DraggableResizable/DraggableResizableContainer.vue';
import DraggableResizable from '../DraggableResizable/DraggableResizable.vue';
import { loadImage, calcCenter, saveAs } from '../utils'

import imgUrl from '../assets/img.jpg'

import { Cropper } from './Cropper'

const cropper = new Cropper({width: 500, height: 500})

const data = ref({
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

let imgEll: HTMLImageElement | null = null


const getViewBoxStyles = computed(() => {
  const { x, y } = data.value
  const { width, height, x: a, y: b } = imgData.value

  return {
    width: width + 'px',
    height: height + 'px',
    transform: `translateX(${-x + a}px) translateY(${-y + b}px)`
  }
})

const CROP_BOX_WIDTH = 500
let aspectRatio = 0

const imageUrl = ref(imgUrl)


async function init(url: string) {
  imgEll = await loadImage(url)

  const width = imgEll.width
  const height = imgEll.height

  if (Math.max(width, height) < CROP_BOX_WIDTH) {
    aspectRatio = 1
    imgData.value = {
      height,
      width,
      x: calcCenter(CROP_BOX_WIDTH, width),
      y: calcCenter(CROP_BOX_WIDTH, height)
    }
    return
  }

  if (width > height) {
    aspectRatio = CROP_BOX_WIDTH / width
    imgData.value = {
      height: CROP_BOX_WIDTH * (height / width),
      width: CROP_BOX_WIDTH,
      x: 0,
      y: calcCenter(CROP_BOX_WIDTH, CROP_BOX_WIDTH * (height / width))
    }
    return
  }


  aspectRatio = CROP_BOX_WIDTH / height

  imgData.value = {
    width: CROP_BOX_WIDTH * (width / height),
    height: CROP_BOX_WIDTH,
    x: calcCenter(CROP_BOX_WIDTH, CROP_BOX_WIDTH * (width / height)),
    y: 0
  }

}

function save() {
  cropper.savaAs(data.value)
  return
  if (!imgEll) return
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const { width: w, height: h, x, y } = data.value
  const { x: a, y: b } = imgData.value

  canvas.width = w / aspectRatio
  canvas.height = h / aspectRatio

  const dx = (x - a) / aspectRatio
  const dy = (y - b) / aspectRatio

  const sw = w / aspectRatio
  const sh = h / aspectRatio

  context?.drawImage(imgEll, dx, dy, sw, sh, 0, 0, sw, sh)

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      saveAs(url, 'image.png')
    }
  });
}


function selectImage() {
  cropper.selectImage().then(data => {
    console.log(data)
    imgData.value = data
  })
  // const input = document.createElement('input')
  // input.setAttribute('type', 'file')
  // input.setAttribute('accept', 'image/*')

  // input.addEventListener('input', (event: Event) => {
  //   const blob = (event.target as HTMLInputElement).files
  //   if (blob) {
  //     imageUrl.value = URL.createObjectURL(blob[0])
  //     init(imageUrl.value || imgUrl)
  //   }
  // })

  // input.click()
}

// init(imgUrl).then(() => {
//   console.log(imgData.value)
// })

cropper.loadImage(imgUrl).then(data3 => {
  console.log(data3, 'data')
  imgData.value = data3
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