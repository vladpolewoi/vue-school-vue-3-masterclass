<template>
  <div class="container col-full" v-if="ready">
    <div class="col-large push-top" v-if="thread">
      <h1>
        {{ thread.title }}
        <routerLink
          v-if="thread.userId === authUser?.id"
          :to="{ name: 'ThreadEdit', params: { id } }"
          class="btn-green btn-small"
          tag="button"
          >Edit Thread</routerLink
        >
      </h1>

      <p>
        By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
        >, <AppDate :timestamp="thread.publishedAt" />.
        <span
          style="float: right; margin-top: 2px"
          class="hide-mobile text-faded text-small"
          >{{ thread.repliesCount }} replies by
          {{ thread.contributorsCount }} contributors</span
        >
      </p>

      <PostList :posts="threadPosts" />
      <PostEditor v-if="authUser" @save-post="onSavePost" />
      <div v-else class="text-center" style="margin-bottom: 50px">
        <router-link :to="{ name: 'Login', query: { redirectTo: route.path } }"
          >Sign In</router-link
        >
        or
        <router-link
          :to="{ name: 'Register', query: { redirectTo: route.path } }"
          >Register</router-link
        >
        to reply
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import AppDate from "@/components/AppDate.vue";
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";
import asyncDataStatus from "@/composables/asyncDataStatus";

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
});
const store = useStore();
const route = useRoute();
const emit = defineEmits(["ready"]);
const { ready, fetched } = asyncDataStatus(emit);

const posts = computed(() => store.state.posts.items);
const thread = computed(() => store.getters["threads/thread"](props.id));
const threadPosts = computed(() => {
  return posts.value.filter(
    (post) => post && post.threadId === thread.value.id
  );
});
const authUser = computed(() => store.getters["auth/getAuthUser"]);

const onSavePost = ({ post }) => {
  const payload = {
    ...post,
    threadId: thread.value.id,
  };

  store.dispatch("posts/createPost", payload);
};

onMounted(async () => {
  // fetch thread
  const thread = await store.dispatch("threads/fetchThread", { id: props.id });

  // fetch user
  store.dispatch("users/fetchUser", { id: thread.userId });

  // fetch the posts in thred.posts
  const posts = await store.dispatch("posts/fetchPosts", { ids: thread.posts });
  const users = posts?.map((post) => post.userId);
  await store.dispatch("users/fetchUsers", { ids: users });
  fetched();
});
</script>
