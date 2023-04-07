<template>
  <div v-if="forum" class="col-full push-top">
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

  <div class="col-full push-top" v-if="threads?.length">
    <ThreadList :threads="threads" />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
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
  forum.value?.threads
    ?.map((threadId) => store.getters.thread(threadId))
    .filter(Boolean)
);
onMounted(async () => {
  const forumData = await store.dispatch("fetchForum", { id: props.id });
  const threadsData = await store.dispatch("fetchThreads", {
    ids: forumData.threads,
  });
  console.log(threadsData.map((thread) => thread.userId));
  store.dispatch("fetchUsers", {
    ids: threadsData.map((thread) => thread.userId),
  });
});
</script>

<style lang="scss" scoped></style>
