<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid" v-if="ready">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.name }} recent activity </span>
        </div>

        <hr />
        <PostList :posts="user.posts" />
        <AppInfinteScroll
          :done="user.posts.length === user.postsCount"
          @load="loadMore"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
import asyncDataStatus from "@/composables/asyncDataStatus";
import AppInfinteScroll from "@/components/AppInfiniteScroll.vue";

const emit = defineEmits(["ready"]);
const store = useStore();
const user = computed(() => store.getters["auth/getAuthUser"]);
const { ready, fetched } = asyncDataStatus(emit);

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const lastPostFetched = computed(() => {
  return user.value.posts.length === 0
    ? null
    : user.value.posts[user.value.posts.length - 1];
});

async function loadMore() {
  return store.dispatch("auth/fetchAuthUsersPosts", {
    startAfter: lastPostFetched.value,
  });
}

onBeforeMount(async () => {
  await loadMore();
  fetched();
});
</script>
