/**
 * @fileoverview 应用程序的主入口文件
 * @description 配置和初始化Vue 3应用程序，包括路由、状态管理等核心功能
 * @author [HuaHua]
 * @date [20241201]
 * @lastModified [20250109]
 */

/**
 * Vue 3的创建应用函数
 * @external vue
 */
import { createApp } from "vue";

/**
 * 路由配置实例
 * @external @/router/router
 */
import router from "@/router/router";

/**
 * Pinia状态管理库的创建函数
 * @external pinia
 */
import { createPinia } from "pinia";

/**
 * Pinia持久化存储插件
 * @external pinia-plugin-persistedstate
 */
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

/**
 * 全局样式文件
 * @external @/style/index.scss
 */
import "@/style/index.scss";

/**
 * 根组件
 * @external @/App.vue
 */
import App from "@/App.vue";

/**
 * 创建Vue应用实例
 * @constant {import('vue').App} app
 */
const app = createApp(App);

/**
 * 初始化应用
 * 1. 安装Pinia状态管理
 * 2. 配置Pinia持久化插件
 * 3. 安装路由
 * 4. 挂载到DOM
 */
app.use(createPinia().use(piniaPluginPersistedstate)).use(router).mount("#app");
