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
import { useStore } from "vuex";

defineProps({
  categories: {
    required: true,
    type: Array,
  },
});
const store = useStore();

const getForumsForCategory = (category) => {
  return store.state.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<style lang="scss" scoped></style>
