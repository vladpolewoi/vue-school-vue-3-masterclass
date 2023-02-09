import { createApp } from "vue";
import { createPinia } from "pinia";
import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import firebaseConfig from "@/config/firebase.js";

firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store);

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
