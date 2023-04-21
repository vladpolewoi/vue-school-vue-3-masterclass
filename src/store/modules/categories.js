import firebase from "firebase/compat";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) =>
      dispatch(
        "fetchItem",
        { resource: "categories", id, emoji: "🏷" },
        { root: true }
      ),
    fetchCategories: ({ dispatch }, { ids }) =>
      dispatch(
        "fetchItems",
        { resource: "categories", ids, emoji: "🏷" },
        { root: true }
      ),
    fetchAllCategories({ commit }) {
      console.log("🔥", "🏷", "all categories");
      return new Promise((resolve) => {
        const unsubscribe = firebase
          .firestore()
          .collection("categories")
          .onSnapshot((snapshot) => {
            const categories = snapshot.docs.map((doc) => {
              const item = { ...doc.data(), id: doc.id };
              commit(
                "SET_ITEM",
                { resource: "categories", item },
                { root: true }
              );

              return item;
            });

            resolve(categories);
          });
        commit("APPEND_UNSUBSCRIBE", { unsubscribe }, { root: true });
      });
    },
  },
  mutations: {},
};
