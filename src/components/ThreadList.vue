<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <routerLink
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
              >{{ thread.title }}</routerLink
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }} replies</p>

          <img
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            alt=""
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import sourceData from "@/data.json";

defineProps({
  threads: {
    required: true,
    type: Array,
  },
});

// const threads = reactive(sourceData.threads);
// const posts = reactive(sourceData.posts);
const users = reactive(sourceData.users);

// const postById = (postId) => posts.find((p) => p.id === postId);
const userById = (userId) => users.find((p) => p.id === userId);
</script>

<style lang="scss" scoped></style>
