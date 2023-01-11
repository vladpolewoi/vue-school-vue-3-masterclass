<template>
  <h1>{{ category.name }}</h1>
  <ForumList
    :title="category.name"
    :categoryId="category.id"
    :forums="getForumsForCategory(category)"
  />
</template>

<script setup>
import { computed } from "vue";
import ForumList from "../components/ForumList.vue";
import sourceData from "@/data.json";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const category = computed(() =>
  sourceData.categories.find((category) => category.id === props.id)
);

const getForumsForCategory = (category) => {
  return sourceData.forums.filter((forum) => forum.categoryId === category.id);
};
</script>
