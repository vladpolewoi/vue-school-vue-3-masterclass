<template>
  <h1>{{ category?.name }}</h1>
  <ForumList
    v-if="category"
    :title="category.name"
    :categoryId="category.id"
    :forums="getForumsForCategory(category)"
  />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import ForumList from "../components/ForumList.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const store = useStore();

const category = computed(() =>
  store.state.categories.find((category) => category.id === props.id)
);

const getForumsForCategory = (category) => {
  return store.state.forums.filter((forum) => forum.categoryId === category.id);
};

onMounted(async () => {
  const categoryData = await store.dispatch("fetchCategory", { id: props.id });

  await store.dispatch("fetchForums", {
    ids: categoryData.forums,
  });
});
</script>
