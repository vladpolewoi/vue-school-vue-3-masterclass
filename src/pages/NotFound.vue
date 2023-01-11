<template>
  <div class="col-full text-center">
    <h1>Page Not Found</h1>
    <router-link :to="{ name: 'Home' }">Read some threads</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  props: {},
};
</script>
