<template>
  <div class="notifications">
    <transition-group name="notification">
      <div
        class="notification"
        :class="`notification-type-${notification.type}`"
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
.notifications {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.notification {
  background-color: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0.5);
  padding: 10px 20px;
  margin-bottom: 10px;
  border-left: 5px solid #263959;
}

.notification.notification-type-error {
  border-color: rgb(146, 5, 5);
}

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
