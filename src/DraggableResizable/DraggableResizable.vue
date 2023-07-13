<template>
  <div class="item" ref="ell" :style="getStyles">
    <div class="content">
      <slot />
    </div>
    <!-- <div>
      <div v-for="handle in risizeHandles" :key="handle.type" class="border" :class="handle.type"
        @mousedown.stop="addEvents($event, handle.fn)">
      </div>
    </div> -->
    <span @mousedown="handleDrag" class="face move"></span>

    <span 
      v-for="handle in risizeHandles"
      :key="handle.type"
      :class="handle.type"
      @mousedown="addEvents($event, handle.fn)"
    >
    </span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue';
import { risizeHandles, dragHandle } from './handlers';

const ell = ref(null);

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      width: 100,
      height: 100,
      x: 20,
      y: 20,
    }),
  },
  // grid: {
  //   type: Array,
  //   default: () => [1, 1],
  //   validator: (val) => {
  //     if(val.length !== 2) {
  //       return false
  //     }
  //     return true
  //   }
  // }
});

const getStyles = computed(() => ({
  top: props.modelValue.y + 'px',
  left: props.modelValue.x + 'px',
  width: props.modelValue.width + 'px',
  height: props.modelValue.height + 'px',
}));

const emit = defineEmits(['update:modelValue']);

// const grids = [1, 1]
// const [gridX, gridY] = grids

const { getParentSize } = inject('key', { getParentSize: () => { } });

const calcLimits = (width: number, height: number, x: number, y: number) => {
  const parenSize = getParentSize();
  return {
    maxWidth: {
      left: width + x,
      right: parenSize.width - x,
    },
    maxHeight: {
      top: height + y,
      bottom: parenSize.height - y,
    },
    top: 0,
    left: 0,
    right: Math.floor(parenSize.width - width),
    bottom: Math.floor(parenSize.height - height),
  };
};
//@ts-ignore
const addEvents = (event: MouseEvent, handler) => {
  const offsetX = event.clientX;
  const offsetY = event.clientY;
  const { width, height, x, y } = props.modelValue;

  const limits = calcLimits(width, height, x, y);

  const onMove = (event: MouseEvent) => {
    let deltaX = event.clientX - offsetX;
    let deltaY = event.clientY - offsetY;
    // deltaX = Math.floor(deltaX / gridX) * gridX
    // deltaY = Math.floor(deltaY / gridY) * gridY

    const result = handler({
      deltaX,
      deltaY,
      width,
      height,
      limits,
      x,
      y,
    });
    emit('update:modelValue', {
      ...props.modelValue,
      ...result,
    });
  };
  const cleanup = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', cleanup);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', cleanup);
};

function handleDrag(event: MouseEvent) {
  addEvents(event, dragHandle);
}
</script>

<style>
.item {
  position: absolute;
}

.content {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.face,
.mr, .mt, .ml, .mb,
.tr, .tl, .bl, .br {
  display: block;
  height: 100%;
  opacity: 0.1;
  position: absolute;
  width: 100%;
}

.face {
  background-color: #fff;
  left: 0;
  top: 0;
}

.mr, .mt, .ml, .mb {
  background-color: #39f;
}

.mr {
  cursor: ew-resize;
  right: -3px;
  top: 0;
  width: 5px;
}

.mt {
  cursor: ns-resize;
  height: 5px;
  left: 0;
  top: -3px;
}

.ml {
  cursor: ew-resize;
  left: -3px;
  top: 0;
  width: 5px;
}

.mb {
  bottom: -3px;
  cursor: ns-resize;
  height: 5px;
  left: 0;
}

.tr, .tl, .bl, .br {
  background-color: #39f;
  height: 5px;
  opacity: 0.75;
  width: 5px;
}

.tr {
  cursor: nesw-resize;
  right: -3px;
  top: -3px;
}

.tl {
  cursor: nwse-resize;
  left: -3px;
  top: -3px;
}

.bl {
  bottom: -3px;
  cursor: nesw-resize;
  left: -3px;
}

.br {
  bottom: -3px;
  cursor: nwse-resize;
  height: 20px;
  opacity: 1;
  right: -3px;
  width: 20px;
}


@media (min-width: 768px) {
  .br {
    height: 15px;
    width: 15px;
  }
}

@media (min-width: 992px) {
  .br {
    height: 10px;
    width: 10px;
  }
}

@media (min-width: 1200px) {
  .br {
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }
}
</style>
