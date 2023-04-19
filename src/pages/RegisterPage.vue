<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="onRegister" action="" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="form.username"
            id="username"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            v-model="form.avatar"
            id="avatar"
            type="text"
            class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button @click="onRegisterWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

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

async function onRegister() {
  await store.dispatch("registerUserWithEmailAndPassword", form);
  router.push("/");
}

async function onRegisterWithGoogle() {
  await store.dispatch("signInWithGoogle");
  router.push("/");
}
</script>
