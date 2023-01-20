<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum?.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <routerLink
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
        >Start a thread</routerLink
      >
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

import ThreadList from "@/components/ThreadList.vue";

const props = defineProps({
  id: {
    requried: true,
    type: String,
  },
});
const store = useStore();

const forum = computed(() =>
  store.state.forums?.find((el) => el.id === props.id)
);
const threads = computed(() =>
  store.state.threads.filter((thread) => thread.forumId === props.id)
);
</script>

<style lang="scss" scoped></style>
