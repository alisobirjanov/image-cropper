import { defineComponent, h } from 'vue'
import { isNumeric } from '@morev/utils'
import { baseTransition } from './mixins'
import { validateSlideOffset } from './utility/validate/validate-slide-offset.js'
import { slideOffset } from './utility/defaults/defaults.js'
import { getMatrix } from './utility/helpers.js'


export default defineComponent({
  name: 'transition-slide',
  mixins: [baseTransition],
  props: {
    offset: {
      validator: validateSlideOffset,
      default: () => slideOffset,
    },
  },
  methods: {
    onEnter(element: HTMLElement) {
      this.slideElement(element, 'enter');
      element.offsetTop; // eslint-disable-line no-unused-expressions

      this.setupTransition(element, 'enter');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    },

    onLeave(element) {
      this.setupTransition(element, 'leave');
      this.slideElement(element, 'leave');
    },

    slideElement(element, event = 'enter') {
      const { width, height, transform } = getComputedStyle(element);

      const offset = this.offset?.[event] ?? this.offset;
      let [offsetX, offsetY] = offset;

      if (!isNumeric(offsetX)) {
        const val = offsetX.endsWith('%')
          ? (parseFloat(width) * (parseFloat(offsetX.slice(0, -1)) || 0)) / 100
          : parseFloat(offsetX);
        offsetX = val;
      }

      if (!isNumeric(offsetY)) {
        const val = offsetY.endsWith('%')
          ? (parseFloat(height) * (parseFloat(offsetY.slice(0, -1)) || 0)) / 100
          : parseFloat(offsetY);
        offsetY = val;
      }

      const [matrixType, matrix] = getMatrix(transform);

      // Respect existing 3D transform
      if (transform.startsWith('matrix3d')) {
        matrix[12] += offsetX;
        matrix[13] += offsetY;
        // Respect existing 2D transform
      } else if (transform.startsWith('matrix')) {
        matrix[4] += offsetX;
        matrix[5] += offsetY;
        // Just apply the transition
      } else {
        matrix[4] = offsetX;
        matrix[5] = offsetY;
      }

      if (!this.noOpacity) {
        element.style.setProperty('opacity', 0);
      }

      element.style.setProperty('transform', `${matrixType}(${matrix})`);
    },

    resetElement(element) {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    },
  },
  render() {
    return h(this.cComponent, { ...this.cHooks, ...this.cAttrs }, this.$slots);
  }
})