import firebase from "firebase/compat/app";
import { findById } from "@/helpers";

export default {
  fetchItem(
    { commit, state },
    {
      id,
      emoji,
      resource,
      handleUnsubscribe = null,
      once = false,
      onSnapshot = null,
    }
  ) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (once) {
            unsubscribe();
          }
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };

            let previousItem = findById(state[resource].items, id);
            previousItem = previousItem ? { ...previousItem } : null;

            commit("SET_ITEM", { item, resource, id });

            if (typeof onSnapshot === "function") {
              const isLocal = doc.metadata.hasPendingWrites;
              onSnapshot({ item: { ...item }, previousItem, isLocal });
            }

            resolve(item);
          }

          resolve(null);
        });

      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit("APPEND_UNSUBSCRIBE", { unsubscribe });
      }
    });
  },
  fetchItems({ dispatch }, { ids, resource, emoji, onSnapshot = null }) {
    return Promise.all(
      ids.map((id) =>
        dispatch("fetchItem", { id, resource, emoji, onSnapshot })
      )
    );
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("CLEAR_ALL_UNSUBSCRIBES");
  },
};
