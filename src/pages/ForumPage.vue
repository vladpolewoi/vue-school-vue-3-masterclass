<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum?.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="#" class="btn-green btn-small">asd</a>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ThreadList from "@/components/ThreadList.vue";
import sourceData from "@/data.json";

const props = defineProps({
  id: {
    requried: true,
    type: String,
  },
});

const forum = computed(() =>
  sourceData.forums?.find((el) => el.id === props.id)
);
const threads = computed(() =>
  sourceData.threads.filter((thread) => thread.forumId === props.id)
);
</script>

<style lang="scss" scoped></style>
