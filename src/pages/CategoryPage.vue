<template>
  <div class="container col-full" v-if="ready">
    <h1>{{ category?.name }}</h1>
    <ForumList
      v-if="category"
      :title="category.name"
      :categoryId="category.id"
      :forums="getForumsForCategory(category)"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import ForumList from "../components/ForumList.vue";
import asyncDataStatus from "@/composables/asyncDataStatus";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const store = useStore();
const emit = defineEmits(["ready"]);
const { ready, fetched } = asyncDataStatus(emit);

const category = computed(() =>
  store.state.categories.items.find((category) => category.id === props.id)
);

const getForumsForCategory = (category) => {
  return store.state.forums.items.filter(
    (forum) => forum.categoryId === category.id
  );
};

onMounted(async () => {
  const categoryData = await store.dispatch("categories/fetchCategory", {
    id: props.id,
  });

  await store.dispatch("forums/fetchForums", {
    ids: categoryData.forums,
  });
  fetched();
});
</script>
