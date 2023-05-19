<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="onRegister" class="card card-form">
        <h1 class="text-center">Register</h1>

        <AppFormField
          v-model="form.name"
          name="name"
          label="Full Name"
          rules="required"
        />

        <AppFormField
          v-model="form.username"
          name="username"
          label="Username"
          rules="required|unique:users,username"
        />

        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          rules="required|email|unique:users,email"
        />

        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          type="password"
          rules="required|min:6"
        />

        <div class="form-group">
          <label for="avatar"
            >Avatar
            <div v-if="avatarPreview">
              <img
                :src="avatarPreview"
                alt="avatarPreview"
                class="avatar-xlarge"
              />
            </div>
          </label>
          <VeeField
            v-show="!avatarPreview"
            name="avatar"
            id="avatar"
            type="file"
            class="form-input"
            accept="image/*"
            @change="onAvatarChange"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click="onRegisterWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import AppFormField from "../components/AppFormField.vue";
const emit = defineEmits(["ready"]);
emit("ready");

const router = useRouter();
const store = useStore();

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  avatar: "",
});
const avatarPreview = ref(null);

async function onRegister() {
  await store.dispatch("auth/registerUserWithEmailAndPassword", form);
  router.push("/");
}

async function onRegisterWithGoogle() {
  await store.dispatch("auth/signInWithGoogle");
  router.push("/");
}

function onAvatarChange(e) {
  form.avatar = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => (avatarPreview.value = e.target.result);
  reader.readAsDataURL(form.avatar);
}
</script>
