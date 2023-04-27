<template>
  <div class="text-center" style="margin-bottom: 15px">
    <button class="btn-green btn-xsmall" @click.prevent="getRandomImage">
      Random Avatar
    </button>
    <br />
    <small style="opacity: 0.5"
      >Powered by <a href="https://pixabay.com">Pixabay</a></small
    >
  </div>
</template>

<script setup>
import { arrayRandom } from "@/helpers";

const emit = defineEmits(["hit"]);

async function getRandomImage() {
  const words = ["space", "code", "patterns", "brown"];
  const word = arrayRandom(words);
  const res = await fetch(
    `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_KEY}&q=${word}`
  );
  const data = await res.json();
  const randomImage = arrayRandom(data.hits);

  emit("hit", randomImage.webformatURL);
}
</script>

<style lang="scss" scoped></style>
