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
        <div>
          <p>
            {{ post.text }}
          </p>
        </div>
      </div>

      <div class="post-date text-faded">
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";

defineProps({
  posts: {
    required: true,
    type: Array,
  },
});
const store = useStore();

const userById = (userId) => store.getters.user(userId);
</script>
