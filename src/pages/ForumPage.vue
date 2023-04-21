<template>
  <div class="container col-full" v-if="ready">
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
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import ThreadList from "@/components/ThreadList.vue";
import asyncDataStatus from "@/composables/asyncDataStatus";

const props = defineProps({
  id: {
    requried: true,
    type: String,
  },
});
const store = useStore();
const emit = defineEmits(["ready"]);

const { ready, fetched } = asyncDataStatus(emit);

const forum = computed(() =>
  store.state.forums.items?.find((el) => el.id === props.id)
);
const threads = computed(() =>
  forum.value?.threads
    ?.map((threadId) => store.getters["threads/thread"](threadId))
    .filter(Boolean)
);
onMounted(async () => {
  const forumData = await store.dispatch("forums/fetchForum", { id: props.id });
  const threadsData = await store.dispatch("threads/fetchThreads", {
    ids: forumData.threads,
  });
  await store.dispatch("users/fetchUsers", {
    ids: threadsData.map((thread) => thread.userId),
  });
  fetched();
});
</script>

<style lang="scss" scoped></style>
