<template>
  <h1>Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script setup>
import { reactive } from "vue";
import CategoryList from "@/components/CategoryList.vue";
import sourceData from "@/data.json";

const categories = reactive(sourceData.categories);
</script>
