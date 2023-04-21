<template>
  <div class="container col-full" v-if="ready">
    <div class="col-full push-top">
      <h1>
        Create new thread in <i>{{ forum.name }}</i>
      </h1>

      <ThreadEditor @onSave="save" @onCancel="cancel" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import asyncDataStatus from "@/composables/asyncDataStatus";

const props = defineProps({
  forumId: {
    required: true,
    type: String,
  },
});
const router = useRouter();
const store = useStore();
const emit = defineEmits(["ready"]);

const { ready, fetched } = asyncDataStatus(emit);

const forum = computed(() =>
  store.state.forums.items.find((forum) => forum.id === props.forumId)
);

const save = async ({ title, text }) => {
  const thread = await store.dispatch("threads/createThread", {
    forumId: forum.value.id,
    title,
    text,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: "Forum", params: { id: forum.value.id } });
};

onBeforeMount(async () => {
  await store.dispatch("forums/fetchForum", { id: props.forumId });
  fetched();
});
</script>

<style lang="scss" scoped></style>
