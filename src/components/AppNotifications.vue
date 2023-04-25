<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        class="notification"
        v-for="notification in notifications"
        :key="notification.id"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">X</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import useNotifications from "@/composables/useNotifications";

const { notifications, removeNotification } = useNotifications();
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: tranform 0.8s ease;
}
</style>
