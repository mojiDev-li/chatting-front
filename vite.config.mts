// Plugins
import Components from "unplugin-vue-components/vite"
import Vue from "@vitejs/plugin-vue"
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify"
import ViteFonts from "unplugin-fonts/vite"
import Layouts from "vite-plugin-vue-layouts"
import VueRouter from "unplugin-vue-router/vite"

// Utilities
import { defineConfig } from "vite"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900"
          }
        ]
      }
    })
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 3000
    // proxy: {
    //   // 경로가 "/api" 로 시작하는 요청을 대상으로 proxy 설정
    //   "/api": {
    //     // 요청 전달 대상 서버 주소 설정
    //     target: "http://localhost:8085",
    //     // 요청 헤더 host 필드 값을 대상 서버의 호스트 이름으로  변경
    //     changeOrigin: true,
    //     // 요청 경로에서 '/api' 제거
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //     // SSL 인증서 검증 무시
    //     secure: false,
    //     // WebSocket 프로토콜 사용
    //     ws: true
    //   }
    // }
  }
})
