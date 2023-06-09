<template>
  <VueFinalModal
    v-model="showModal"
    classes="modal-container"
    content-class="modal"
  >
    <div class="modal-content">
      <h4>Login again to change your email</h4>
      <VeeForm @submit="reauthenticate">
        <AppFormField
          name="reauth-email"
          label="Email"
          v-model="email"
          rules="required|email"
        />
        <AppFormField
          name="reauth-password"
          label="Password"
          v-model="password"
          type="password"
        />
        <div class="form-group">
          <button class="btn btn-primary" type="submit">Login</button>
        </div>
      </VeeForm>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { VueFinalModal } from "vue-final-modal";
// import { useRouter } from "vue-router";
// const router = useRouter();

// Modal
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Form
const store = useStore();
const emit = defineEmits(["fail"]);
const email = ref("");
const password = ref("");

async function reauthenticate() {
  try {
    await store.dispatch("auth/reauthenticate", {
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    emit("fail", error);
  }
  // router.push({ name: "ProfileEdit" });
}
</script>

<style lang="scss" scoped></style>
