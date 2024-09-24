import { createApp } from "vue";
import router from "@/router/router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "@/style/index.scss";
import App from "@/App.vue";

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate)).use(router).mount("#app");
