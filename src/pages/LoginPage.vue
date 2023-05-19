<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="onSubmit" class="card card-form">
        <h1 class="text-center">Login</h1>

        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          rules="required|email"
        />

        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          type="password"
          rules="required|min:6"
        />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }"
            >Create an account?</router-link
          >
        </div>
      </VeeForm>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import AppFormField from "../components/AppFormField.vue";
const store = useStore();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["ready"]);
emit("ready");

const form = reactive({
  email: "",
  password: "",
});

function successRedirect() {
  const redirectTo = route.query.redirectTo || { name: "Home" };
  router.push(redirectTo);
}

async function signInWithGoogle() {
  await store.dispatch("auth/signInWithGoogle");
  successRedirect();
}

function onSubmit() {
  try {
    store.dispatch("auth/signInWithEmailAndPassword", { ...form });
    successRedirect();
  } catch (error) {
    console.log(error);
  }
}
</script>
