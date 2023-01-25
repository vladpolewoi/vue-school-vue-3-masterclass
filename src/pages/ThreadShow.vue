<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <routerLink
        :to="{ name: 'ThreadEdit', params: { id } }"
        class="btn-green btn-small"
        tag="button"
        >Edit Thread</routerLink
      >
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread.author.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>

    <PostList :posts="threadPosts" />
    <PostEditor @save-post="onSavePost" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import AppDate from "@/components/AppDate.vue";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const store = useStore();

const posts = computed(() => store.state.posts);
const thread = computed(() => store.getters.thread(props.id));
const threadPosts = computed(() => {
  return posts.value.filter(
    (post) => post && post.threadId === thread.value.id
  );
});

const onSavePost = ({ post }) => {
  const payload = {
    ...post,
    threadId: thread.value.id,
  };

  store.dispatch("createPost", payload);
};
</script>

<style lang="scss" scoped></style>
