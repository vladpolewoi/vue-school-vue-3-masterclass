import { reactive } from "vue";

const notifications = reactive([]);

const addNotification = ({ message, timeout = null }) => {
  const id = Math.random() + Date.now();

  notifications.push({
    id,
    message,
  });

  if (timeout) {
    setTimeout(() => {
      removeNotification(id);
    }, timeout);
  }
};

const removeNotification = (id) => {
  const index = notifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications.splice(index, 1);
  }
};

export default function useNotifications() {
  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
