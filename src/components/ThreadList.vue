<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-if="threads.length">
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
            <p class="replies-count">{{ thread.repliesCount }} replies</p>

            <AppAvatarImage
              class="avatar-medium"
              :src="userById(thread.userId).avatar"
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
      <div v-else style="padding: 10px; text-align: center">
        No Threads Available
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

defineProps({
  threads: {
    required: true,
    type: Array,
  },
});
const store = useStore();

const users = computed(() => store.state.users.items);

const userById = (userId) => users.value.find((p) => p.id === userId) || {};
</script>

<style lang="scss" scoped></style>
