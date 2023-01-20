import { defineStore, acceptHMRUpdate } from "pinia";
import sourceData from "@/data.json";
import { useThreadsStore } from "./ThreadsStore";
export const usePostsStore = defineStore("PostsStore", {
  state: () => ({
    posts: sourceData.posts,
  }),
  getters: {},
  actions: {
    createPost(payload) {
      const post = {
        id: "0000" + Math.random(),
        ...payload,
      };

      this.posts.push(post);

      const threadsStore = useThreadsStore();
      const thread = threadsStore.find((thread) => thread.id === post.threadId);
      thread.posts.push(post.id);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot));
}
