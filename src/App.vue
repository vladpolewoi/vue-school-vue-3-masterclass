<template>
  <TheNavbar />
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady" :key="route.path" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>
<script setup>
import TheNavbar from "@/components/TheNavbar.vue";
import AppSpinner from "./components/AppSpinner.vue";
import NProgress from "nprogress";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

const showPage = ref(false);
NProgress.configure({ showSpinner: false });
function onPageReady() {
  showPage.value = true;
  NProgress.done();
}

router.beforeEach(() => {
  NProgress.start();
  showPage.value = false;
});

store.dispatch("auth/fetchAuthUser");
</script>

<style>
@import "assets/style.css";
@import "./../node_modules/nprogress/nprogress.css";

#nprogress .bar {
  background: #00ff0d !important;
}
</style>
