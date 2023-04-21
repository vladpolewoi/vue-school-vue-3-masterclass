import firebase from "firebase/compat";

export default {
  fetchItem({ commit }, { id, emoji, resource, handleUnsubscribe = null }) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            commit("SET_ITEM", { item, resource, id });
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
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    return Promise.all(
      ids.map((id) => dispatch("fetchItem", { id, resource, emoji }))
    );
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("CLEAR_ALL_UNSUBSCRIBES");
  },
};
