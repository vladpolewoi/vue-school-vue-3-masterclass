<template>
  <div class="container col-full" v-if="ready">
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import asyncDataStatus from "@/composables/asyncDataStatus";
// import { storeToRefs } from "pinia";
// import { useCategoriesStore } from "@/stores/CategoriesStore";
import CategoryList from "@/components/CategoryList.vue";

// Vuex
const store = useStore();
const categories = computed(() => store.state.categories.items);
const emit = defineEmits(["ready"]);
const { ready, fetched } = asyncDataStatus(emit);

onBeforeMount(async () => {
  const categoriesData = await store.dispatch("categories/fetchAllCategories");
  const forumsIds = categoriesData.flatMap((category) => category.forums);
  await store.dispatch("forums/fetchForums", { ids: forumsIds });
  fetched();
});

// Pinia
// const { categories } = storeToRefs(useCategoriesStore());
</script>
