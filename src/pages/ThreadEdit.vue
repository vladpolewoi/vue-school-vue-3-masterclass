<template>
  <div class="container">
    <div class="col-full push-top">
      <h1>
        Editing <i>{{ thread.title }}</i>
      </h1>

      <ThreadEditor
        :title="thread.title"
        :text="text"
        @onSave="save"
        @onCancel="cancel"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const router = useRouter();
const store = useStore();

const thread = computed(() =>
  store.state.threads.find((thread) => thread.id === props.id)
);
const text = computed(
  () => store.state.posts.find((post) => post.id === thread.value.posts[0]).text
);

const save = async ({ title, text }) => {
  const thread = await store.dispatch("updateThread", {
    id: props.id,
    title,
    text,
  });
  router.push({ name: "ThreadShow", params: { id: thread.id } });
};

const cancel = () => {
  router.push({ name: "ThreadShow", params: { id: thread.value.id } });
};
</script>

<style lang="scss" scoped></style>
