/*
 * @Author: futurechenpi 2625765150@qq.com
 * @Date: 2025-09-30 09:50:52
 * @LastEditors: futurechenpi 2625765150@qq.com
 * @LastEditTime: 2025-09-30 20:22:53
 * @FilePath: \learn-frontend\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true, 
    port: 3000,
    open: true,
    strictPort: true, 
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

