import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //api 로 시작하는 요청을 모두 백엔드로 넘김
      '/api':{
        // 백엔드 주소는 추후 배포 혹은 도메인 연결시 수정
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
