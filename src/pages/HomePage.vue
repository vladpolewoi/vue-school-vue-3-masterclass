<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// import { storeToRefs } from "pinia";
// import { useCategoriesStore } from "@/stores/CategoriesStore";
import CategoryList from "@/components/CategoryList.vue";

// Vuex
const store = useStore();
const categories = computed(() => store.state.categories);

// Pinia
// const { categories } = storeToRefs(useCategoriesStore());
</script>
