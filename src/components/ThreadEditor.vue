<template>
  <form @submit.prevent="onSave">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="form.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="emit('onCancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </form>
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
