<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <label for="thread_content">Content:</label>
        <textarea
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
          v-model="postCopy.text"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          {{ post.id ? "Update Post" : "Submit Post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      text: null,
    }),
  },
});
const emit = defineEmits(["save-post"]);
const postCopy = reactive({ ...props.post });

const save = () => {
  emit("save-post", { post: postCopy });

  postCopy.text = "";
};
</script>

<style lang="scss" scoped></style>
