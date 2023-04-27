<template>
  <img :src="src || '/placeholder.png'" alt="profile picture" />
</template>

<script>
export default {
  name: "AppAvatarImage",
  props: {
    src: { type: String },
  },
};
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
