<template>
  <TheNavbar />
  <div class="container">
    <router-view />
  </div>
</template>
<script setup>
import TheNavbar from "@/components/TheNavbar.vue";
import { useStore } from "vuex";

const store = useStore();

store.dispatch("fetchAuthUser");
</script>
<style>
@import "assets/style.css";
</style>
