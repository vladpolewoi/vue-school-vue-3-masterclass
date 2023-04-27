import { createApp } from "vue";
import { createPinia } from "pinia";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import firebaseConfig from "@/config/firebase.js";
import FontAwesome from "@/plugins/FontAwesome.js";
import ClickOutsideDirective from "@/plugins/ClickOutsideDirective.js";
import PageScrollDirective from "@/plugins/PageScrollDirective.js";
import Vue3Pagination from "@/plugins/Vue3Pagination";

firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store);
app.use(FontAwesome);
app.use(ClickOutsideDirective);
app.use(PageScrollDirective);
app.use(Vue3Pagination);

// register global components
const components = import.meta.globEager("./components/*.vue");
Object.entries(components).forEach(([path, definition]) => {
  const componentName = path
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");

  app.component(componentName, definition.default);
});

app.mount("#app");
