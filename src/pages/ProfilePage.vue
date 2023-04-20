<template>
  <div class="container">
    <div class="flex-grid">
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
import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const emit = defineEmits(["ready"]);
emit("ready");

const store = useStore();
const user = computed(() => store.getters["getAuthUser"]);

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});
</script>
