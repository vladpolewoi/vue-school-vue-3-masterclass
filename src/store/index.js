import { createStore } from "vuex";
import sourceData from "@/data.json";
import { findById, upsert } from "@/helpers";

export default createStore({
  state: {
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
    ...sourceData,
  },
  getters: {
    getAuthUser: (state) => {
      const user = findById(state.users, state.authId);

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

      commit("SET_POST", {
        post: payload,
      });
      commit("APPEND_POST_TO_THREAD", {
        childId: payload.id,
        parentId: post.threadId,
      });
    },
    updateUser({ commit }, user) {
      commit("SET_USER", { user, userId: user.id });
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

      commit("SET_THREAD", { thread });
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
      commit("SET_THREAD", { thread: newThread });
      commit("SET_POST", { post: newPost });

      return newThread;
    },
  },
  mutations: {
    SET_POST(state, { post }) {
      upsert(state.posts, post);
    },
    SET_THREAD(state, { thread }) {
      upsert(state.threads, thread);
    },
    SET_USER(state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      state.users[userIndex] = user;
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
  },
});

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);

    resource[child] = resource[child] || [];
    resource[child].push(childId);
  };
}
