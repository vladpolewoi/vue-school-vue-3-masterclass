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
      <v-pagination
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import ThreadList from "@/components/ThreadList.vue";
import asyncDataStatus from "@/composables/asyncDataStatus";

const props = defineProps({
  id: {
    requried: true,
    type: String,
  },
});
const store = useStore();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["ready"]);

const { ready, fetched } = asyncDataStatus(emit);
const page = ref(parseInt(route.query?.page) || 1);

const forum = computed(() =>
  store.state.forums.items?.find((el) => el.id === props.id)
);
const threads = computed(() =>
  store.state.threads.items
    ?.filter((thread) => thread.forumId === forum.value.id)
    ?.map((thread) => store.getters["threads/thread"](thread.id))
);

const perPage = ref(4);
const threadCount = computed(() => forum.value.threads?.length);
const totalPages = computed(() =>
  threadCount.value ? Math.ceil(threadCount.value / perPage.value) : 0
);

onMounted(async () => {
  const forumData = await store.dispatch("forums/fetchForum", { id: props.id });
  const threadsData = await store.dispatch("threads/fetchThreadsByPage", {
    ids: forumData.threads,
    page: page.value,
    perPage: perPage.value,
  });
  await store.dispatch("users/fetchUsers", {
    ids: threadsData.map((thread) => thread.userId),
  });
  fetched();
});

watch(async () => {
  router.push({ query: { page: page.value } });
});
</script>

<style lang="scss" scoped></style>
