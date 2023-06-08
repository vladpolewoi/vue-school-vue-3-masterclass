import firebase from "@/helpers/firebase";
import { makeFetchItemAction, makeFetchItemsAction } from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ resource: "categories", emoji: "🏷" }),
    fetchCategories: makeFetchItemsAction({
      resource: "categories",
      emoji: "🏷",
    }),
    fetchAllCategories({ commit }) {
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
