<template>
  <div class="post-list" v-for="post in posts" :key="post.id">
    <div class="post">
      <div class="user-info" v-if="userById(post.userId)">
        <a href="profile.html#profile-details" class="user-name">{{
          userById(post.userId).name
        }}</a>

        <a href="profile.html#profile-details">
          <img
            class="avatar-large"
            :src="userById(post.userId).avatar"
            alt=""
          />
        </a>

        <p class="desktop-only text-small">
          {{ userById(post.userId).postsCount }} posts
        </p>
        <p class="desktop-only text-small">
          {{ userById(post.userId).threadsCount }} threads
        </p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor
            v-if="editing === post.id"
            :post="post"
            @save-post="handleUpdate"
            >Edit mode</PostEditor
          >
          <p v-else>
            {{ post.text }}
          </p>
        </div>
        <a
          v-if="post.userId === store.state.auth.authId"
          href="#"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Make a change"
          @click.prevent="toggleEditMode(post.id)"
        >
          <fa icon="pencil-alt" />
        </a>
      </div>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import PostEditor from "./PostEditor.vue";

defineProps({
  posts: {
    required: true,
    type: Array,
  },
});
const store = useStore();
const editing = ref(null);

const userById = (userId) => store.getters["users/user"](userId);

function toggleEditMode(postId) {
  editing.value = postId === editing.value ? null : postId;
}

function handleUpdate(event) {
  store.dispatch("posts/updatePost", event.post);
  editing.value = null;
}
</script>
