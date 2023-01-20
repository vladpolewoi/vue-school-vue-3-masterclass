<template>
  <div class="post-list" v-for="post in posts" :key="post.id">
    <div class="post">
      <div class="user-info">
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

        <p class="desktop-only text-small">107 posts</p>
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
import { computed } from "vue";
import { useStore } from "vuex";

defineProps({
  posts: {
    required: true,
    type: Array,
  },
});
const store = useStore();

const users = computed(() => store.state.users);

const userById = (userId) => users.value.find((p) => p.id === userId);
</script>
