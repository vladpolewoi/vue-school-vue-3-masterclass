<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :categoryId="category.id"
  />
</template>

<script setup>
import ForumList from "@/components/ForumList.vue";
import sourceData from "@/data.json";

defineProps({
  categories: {
    required: true,
    type: Array,
  },
});

const getForumsForCategory = (category) => {
  return sourceData.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<style lang="scss" scoped></style>
