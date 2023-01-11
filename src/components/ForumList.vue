<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <routerLink
          v-if="categoryId"
          :to="{ name: 'Category', params: { id: categoryId } }"
          >{{ title }}</routerLink
        >
        <span v-else>{{ title }}</span>
      </h2>

      <div class="forum-listing" v-for="forum in forums" :key="forum.id">
        <div class="forum-details">
          <routerLink
            :to="{ name: 'Forum', params: { id: forum.id } }"
            class="text-xlarge"
            >{{ forum.name }}</routerLink
          >
          <p>{{ forum.description }}</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length || 0 }}</span>
            {{ forum.thread?.length === 1 ? "thread" : "threads" }}
          </p>
        </div>

        <div class="last-thread"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  forums: {
    required: true,
    type: Array,
  },
  title: {
    type: String,
    default: "Forums",
  },
  categoryId: {
    required: false,
    type: String,
  },
});
</script>
