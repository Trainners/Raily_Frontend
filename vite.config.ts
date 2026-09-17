import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //api 로 시작하는 요청을 모두 백엔드로 넘김
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 백엔드 CORS 허용 목록에 localhost:5173이 없어 Origin 헤더가 있으면 403이 남.
        // 프록시 경유라 브라우저 입장에선 같은 출처이므로 Origin을 제거해 CORS 검사를 건너뛰게 함 (로컬 전용)
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
          });
        },
      }
    }
  }
})
