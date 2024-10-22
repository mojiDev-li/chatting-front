/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// init
import "../init.ts"

// Plugins
import { registerPlugins } from "@/plugins"

// Components
import App from "./App.vue"

// Composables
import { createApp } from "vue"

const app = createApp(App)

// app.directive("auto-scroll-bottom", {
//   // dom 업데이트시 스크롤을 최하단으로 이동
//   updated: (el) => {
//     setTimeout(() => {
//       console.log("scrollTop >>", el.scrollTop, el.scrollHeight)
//       el.scrollTop = el.scrollHeight
//     }, 100)
//   }
// })

registerPlugins(app)

app.mount("#app")
