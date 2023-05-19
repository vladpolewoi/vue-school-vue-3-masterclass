<template>
  <div class="col-full">
    <VeeForm @submit="save" :key="formKey">
      <AppFormField
        v-model="postCopy.text"
        name="text"
        rules="required"
        as="textarea"
        rows="8"
        cols="140"
      />

      <div class="btn-group">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          {{ post.id ? "Update Post" : "Submit Post" }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
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
const formKey = ref(Math.random());

const save = () => {
  emit("save-post", { post: postCopy });

  postCopy.text = "";
  formKey.value = Math.random();
};
</script>

<style lang="scss" scoped></style>
