import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 브라우저 환경에서 process.env를 사용할 수 있도록 설정
    'process.env': {}
  }
})
