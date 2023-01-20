import { defineStore, acceptHMRUpdate } from "pinia";
import sourceData from "@/data.json";

export const useCategoriesStore = defineStore("CategoriesStore", {
  state: () => ({
    categories: sourceData.categories,
  }),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot));
}
