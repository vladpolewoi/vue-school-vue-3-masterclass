<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImage
            :src="userData.avatar"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="isUploadingImage" color="white" />
            <fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: '8' }"
            />
          </div>
          <input
            v-show="false"
            type="file"
            id="avatar"
            accept="image/*"
            @change="onAvatarChange"
          />
        </label>
      </p>
      <UserProfileCardEditorRandomAvatar @hit="userData.avatar = $event" />

      <div class="form-group">
        <input
          v-model="userData.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          v-model="userData.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="userData.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          v-model="userData.website"
          autocomplete="off"
          class="form-input"
          id="user_website"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          v-model="userData.email"
          autocomplete="off"
          class="form-input"
          id="user_email"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          v-model="userData.location"
          autocomplete="off"
          class="form-input"
          id="user_location"
        />
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import UserProfileCardEditorRandomAvatar from "@/components/UserProfileCardEditorRandomAvatar.vue";

const props = defineProps({
  user: {
    required: true,
    type: Object,
  },
});
const store = useStore();
const router = useRouter();
const userData = reactive(JSON.parse(JSON.stringify(props.user)));
const isUploadingImage = ref(false);

const save = async () => {
  await handleRandomAvatarUpload();
  store.dispatch("users/updateUser", { ...userData });
  router.push({ name: "Profile" });
};

const cancel = () => {
  router.push({ name: "Profile" });
};

async function onAvatarChange(e) {
  isUploadingImage.value = true;

  const file = e.target.files[0];
  const uploadedImage = await store.dispatch("auth/uploadAvatar", { file });

  userData.avatar = uploadedImage || userData.avatar;

  isUploadingImage.value = false;
}

async function handleRandomAvatarUpload() {
  const randomAvatarGenerated = userData.avatar.startsWith("https://pixabay");

  if (randomAvatarGenerated) {
    const image = await fetch(userData.avatar);
    const blob = await image.blob();
    userData.avatar = await store.dispatch("auth/uploadAvatar", {
      file: blob,
      filename: "random",
    });
  }
}
</script>

<style lang="scss" scoped></style>
