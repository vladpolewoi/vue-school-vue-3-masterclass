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
    type: [Number, Object],
  },
});

const normalizedTimestamp = computed(
  () => props.timestamp?.seconds || props.timestamp
);
const timeAgo = computed(() => dayjs.unix(normalizedTimestamp.value).fromNow());
const localizedTime = computed(() =>
  dayjs.unix(normalizedTimestamp.value).format("llll")
);
</script>
