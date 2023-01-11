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
          v-model="text"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          Publish
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["save-post"]);

const text = ref("");

const save = () => {
  const postId = "0000" + Math.random();
  const post = {
    id: postId,
    text: text.value,
    publishedAt: Math.floor(Date.now() / 1000),
    userId: "38St7Q8Zi2N1SPa5ahzssq9kbyp1",
  };

  emit("save-post", { post });

  text.value = "";
};
</script>

<style lang="scss" scoped></style>
