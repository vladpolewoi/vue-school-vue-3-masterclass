<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <PostList :posts="threadPosts" />
    <PostEditor @save-post="onSavePost" />
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import sourceData from "@/data.json";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});

const posts = reactive(sourceData.posts);
const thread = computed(() =>
  sourceData.threads.find((el) => el.id === props.id)
);
const threadPosts = computed(() =>
  posts.filter((post) => post.threadId === thread.value.id)
);

const onSavePost = ({ post }) => {
  const payload = {
    ...post,
    threadId: thread.value.id,
  };

  posts.push(payload);
  thread.value.posts.push(payload);
};
</script>

<style lang="scss" scoped></style>
