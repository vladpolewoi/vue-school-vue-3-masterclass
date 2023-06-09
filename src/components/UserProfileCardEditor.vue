<template>
  <div class="profile-card">
    <VeeForm @submit="save">
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

      <AppFormField
        v-model="userData.username"
        name="username"
        rules="required"
        label="Username"
        placeholder="Username"
      />

      <AppFormField
        v-model="userData.name"
        name="name"
        label="Name"
        rules="required"
        placeholder="Full Name"
      />

      <AppFormField
        v-model="userData.bio"
        name="bio"
        label="Bio"
        placeholder="Write a few words about yourself."
        as="textarea"
      />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <AppFormField
        v-model="userData.website"
        name="website"
        label="Website"
        placeholder="Website"
      />

      <AppFormField
        v-model="userData.email"
        name="email"
        label="Email"
        placeholder="Email"
        rules="email|required"
      />

      <AppFormField
        v-model="userData.location"
        name="location"
        label="Location"
        placeholder="Location"
        list="locations"
        @mouseenter.once="onMouseEnterLocations"
      />
      <datalist id="locations">
        <option
          v-for="country in locationCountries"
          :key="country.name.common"
          :value="country.name.common"
        />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
    <UserProfileCardEditorReauthenticate
      v-model="needsReAuth"
      @success="onReauthenticated"
      @fail="onReauthenticatedFailed"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import UserProfileCardEditorRandomAvatar from "@/components/UserProfileCardEditorRandomAvatar.vue";
import UserProfileCardEditorReauthenticate from "./UserProfileCardEditorReauthenticate.vue";
import useNotifications from "@/composables/useNotifications";
import AppFormField from "./AppFormField.vue";

const props = defineProps({
  user: {
    required: true,
    type: Object,
  },
});
const store = useStore();
const router = useRouter();
const { addNotification } = useNotifications();
const userData = reactive(JSON.parse(JSON.stringify(props.user)));
const isUploadingImage = ref(false);

async function saveUserData() {
  await store.dispatch("users/updateUser", {
    ...userData,
    threads: userData.threadIds,
  });
  addNotification({
    message: "Profile updated successfully.",
    type: "success",
    timeout: 3000,
  });
  router.push({ name: "Profile" });
}

const save = async () => {
  await handleRandomAvatarUpload();

  const emailChanged = userData.email !== props.user.email;

  if (emailChanged) {
    needsReAuth.value = true;
  } else {
    saveUserData();
  }
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
  const randomAvatarGenerated = userData?.avatar?.startsWith("https://pixabay");

  if (randomAvatarGenerated) {
    const image = await fetch(userData.avatar);
    const blob = await image.blob();
    userData.avatar = await store.dispatch("auth/uploadAvatar", {
      file: blob,
      filename: "random",
    });
  }
}

// Location Options
const locationCountries = ref([]);

async function loadLocationOptions() {
  const response = await fetch("https://restcountries.com/v3/all");
  locationCountries.value = await response.json();
}

function onMouseEnterLocations() {
  loadLocationOptions();
}

// Reauthentication
const needsReAuth = ref(false);

async function onReauthenticated() {
  await store.dispatch("auth/updateEmail", { email: userData.email });
  saveUserData();
  needsReAuth.value = false;
}

function onReauthenticatedFailed() {
  addNotification({
    type: "error",
    message: "Reauthentication failed. Please try again.",
    timeout: 3000,
  });
  router.push({ name: "Profile" });
  needsReAuth.value = true;
}
</script>

<style lang="scss" scoped></style>
