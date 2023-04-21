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
          <a href="#">See only started threads?</a>
        </div>

        <hr />
        <PostList :posts="user.posts" />
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

const emit = defineEmits(["ready"]);
const store = useStore();
const user = computed(() => store.getters["getAuthUser"]);
const { ready, fetched } = asyncDataStatus(emit);

onBeforeMount(async () => {
  await store.dispatch("fetchAuthUsersPosts");
  fetched();
});

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});
</script>
