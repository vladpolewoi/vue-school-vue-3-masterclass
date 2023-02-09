import { createStore } from "vuex";
import { findById, upsert } from "@/helpers";
import firebase from "firebase/compat";

export default createStore({
  state: {
    forums: [],
    users: [],
    posts: [],
    threads: [],
    categories: [],
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },
  getters: {
    getAuthUser: (state, getters) => {
      return getters.user(state.authId) || {};
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);

        if (!thread) {
          return null;
        }

        return {
          ...thread,
          get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors.length;
          },
        };
      };
    },
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id);

        if (!user) {
          return null;
        }

        const posts = state.posts.filter((post) => post.userId === user.id);
        const threads = state.threads.filter(
          (thread) => thread.userId === user.id
        );
        const postsCount = posts.length;
        const threadsCount = threads.length;

        return {
          ...user,
          posts,
          threads,
          postsCount,
          threadsCount,
        };
      };
    },
  },
  actions: {
    createPost({ commit, state }, post) {
      const payload = {
        id: "0000" + Math.random(),
        userId: state.authId,
        publishedAt: Math.floor(Date.now() / 1000),
        ...post,
      };

      commit("SET_ITEM", { resource: "posts", item: payload });
      commit("APPEND_POST_TO_THREAD", {
        childId: payload.id,
        parentId: post.threadId,
      });
      commit("APPEND_CONTRIBUTOR_TO_THREAD", {
        childId: payload.userId,
        parentId: post.threadId,
      });
    },
    updateUser({ commit }, user) {
      commit("SET_ITEM", { resource: "users", item: user });
    },
    async createThread({ commit, state, dispatch }, { text, title, forumId }) {
      const id = "0000" + Math.random();
      const userId = state.authId;
      const thread = {
        forumId,
        title,
        id,
        userId,
        publishedAt: Math.floor(Date.now() / 1000),
      };

      commit("SET_ITEM", { resource: "threads", item: thread });
      commit("APPEND_THREAD_TO_USER", { parentId: userId, childId: id });
      commit("APPEND_THREAD_TO_FORUM", { parentId: forumId, childId: id });
      dispatch("createPost", { text, threadId: id });

      return findById(state.threads, id);
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);
      const post = findById(state.posts, thread.posts[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };
      commit("SET_ITEM", { resource: "threads", item: newThread });
      commit("SET_ITEM", { resource: "posts", item: newPost });

      return newThread;
    },

    fetchThread({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "threads", id, emoji: "📄" });
    },
    fetchUser({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "users", id, emoji: "👤" });
    },
    fetchPost({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "posts", id, emoji: "💬" });
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" });
    },
    fetchThreads({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "threads", ids, emoji: "📄" });
    },
    fetchUsers({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "users", ids, emoji: "👤" });
    },
    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "forums", ids, emoji: "🏁" });
    },
    fetchAllCategories({ commit }) {
      console.log("🔥", "🏷", "all categories");
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection("categories")
          .onSnapshot((snapshot) => {
            const categories = snapshot.docs.map((doc) => {
              const item = { ...doc.data(), id: doc.id };
              commit("SET_ITEM", { resource: "categories", item });

              return item;
            });

            resolve(categories);
          });
      });
    },
    fetchItem({ commit }, { id, emoji, resource }) {
      console.log("🔥", emoji, id);
      return new Promise((resolve) => {
        firebase
          .firestore()
          .collection(resource)
          .doc(id)
          .onSnapshot((doc) => {
            const item = { ...doc.data(), id: doc.id };
            commit("SET_ITEM", { item, resource, id });
            resolve(item);
          });
      });
    },
    fetchItems({ dispatch }, { ids, resource, emoji }) {
      return Promise.all(
        ids.map((id) => dispatch("fetchItem", { id, resource, emoji }))
      );
    },
  },
  mutations: {
    SET_ITEM(state, { resource, item }) {
      upsert(state[resource], item);
    },
    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    APPEND_THREAD_TO_FORUM: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads",
    }),
    APPEND_THREAD_TO_USER: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
    APPEND_CONTRIBUTOR_TO_THREAD: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
  },
});

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);

    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}
