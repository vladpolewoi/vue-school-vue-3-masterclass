<template>
  <TheNavbar />
  <div class="container">
    <router-view />
  </div>
</template>
<script setup>
import TheNavbar from "@/components/TheNavbar.vue";
</script>
<style>
@import "assets/style.css";
</style>
