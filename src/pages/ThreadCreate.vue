<template>
  <div class="container">
    <div v-if="forum" class="col-full push-top">
      <h1>
        Create new thread in <i>{{ forum.name }}</i>
      </h1>

      <ThreadEditor @onSave="save" @onCancel="cancel" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  forumId: {
    required: true,
    type: String,
  },
});
const router = useRouter();
const store = useStore();

store.dispatch("fetchForum", { id: props.forumId });

const forum = computed(() =>
  store.state.forums.find((forum) => forum.id === props.forumId)
);

const save = async ({ title, text }) => {
  const thread = await store.dispatch("createThread", {
    forumId: forum.value.id,
    title,
    text,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: "Forum", params: { id: forum.value.id } });
};
</script>

<style lang="scss" scoped></style>
