<template>
  <div>

    <div class="image-cropper">
       <ImageCropper ref="cropper"/>
    </div>

    <div class="btns" v-if="cropper">
       <button @click="cropper.selectImage">Select file</button>
       <button @click="cropper.saveAs">Save</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageCropper from './ImageCropper/index.vue'

const cropper = ref(null)

</script>

<style>
.image-cropper {
  /* height: 80vh; */
  display: flex;
  align-items: center;
  justify-content: center;
} 
.btns{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
.btns button{
  padding: 10px 25px;
  color: #fff;
  outline: none;
  border-radius: 7px;
  cursor: pointer;
  border: none;
}
.btns button:nth-child(1){
  background-color: rgb(38, 130, 235);
}
.btns button:nth-child(2){
  background-color: rgb(17, 185, 26);
}
</style>

