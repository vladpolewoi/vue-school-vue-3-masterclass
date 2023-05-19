<template>
  <VeeForm @submit="onSave">
    <AppFormField
      v-model="form.title"
      name="title"
      label="Title"
      rules="required"
    />

    <AppFormField
      v-model="form.text"
      name="text"
      label="Content"
      rules="required"
      as="textarea"
      rows="8"
      cols="140"
    />

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="emit('onCancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </VeeForm>
</template>

<script setup>
import { reactive, computed } from "vue";

const emit = defineEmits(["onSave", "onCancel"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
});
const form = reactive({
  title: props.title,
  text: props.text,
});

const existing = computed(() => !!props.title);

const onSave = () => {
  emit("onSave", { ...form });
};
</script>

<style lang="scss" scoped></style>
