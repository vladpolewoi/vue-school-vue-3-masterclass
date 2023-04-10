// const { isReady } = useAsyncState(async () => {
//   const categories = await store.fetchAllCategories();
//   const forumIds = categories.map((c) => c.forums).flat();
//   await store.fetchForums(forumIds);
// }, undefined);
import { ref } from "vue";

export default function asyncDataStatus(emit) {
  const ready = ref(false);

  function fetched() {
    ready.value = true;
    emit("ready");
  }

  return {
    ready,
    fetched,
  };
}
