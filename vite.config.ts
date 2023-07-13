import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
});




function myPlugin() {
  const virtualModuleId = 'virtual:my-module';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      console.log(id)
      if (id.endsWith('.lazy')) {
        return id;
      }
    },
    load(id: string) {
      // console.log(id.startsWith('lazy:'));
      if (id.endsWith('.lazy')) {
        console.log(id);
        const res = `
          <div>
            HIII
          </div>

      `;
        console.log(res);
        return res;
      }
    },
  };
}