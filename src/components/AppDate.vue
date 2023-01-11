<template>
  <span :title="localizedTime">
    {{ timeAgo }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedDate from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
  timestamp: {
    required: true,
    type: Number,
  },
});

const timeAgo = computed(() => dayjs.unix(props.timestamp).fromNow());
const localizedTime = computed(() =>
  dayjs.unix(props.timestamp).format("llll")
);
</script>
