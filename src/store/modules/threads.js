import firebase from "firebase/compat/app";
import chunk from "lodash/chunk";
import { makeFetchItemAction, makeFetchItemsAction } from "@/helpers";

import {
  findById,
  docToResource,
  makeAppendChildToParentMutation,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id);

        if (!thread) {
          return null;
        }

        return {
          ...thread,
          get author() {
            return findById(rootState.users.items, thread.userId);
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
  },
  actions: {
    async createThread(
      { commit, rootState, dispatch, state },
      { text, title, forumId }
    ) {
      const userId = rootState.auth.authId;
      // Refs
      const threadRef = firebase.firestore().collection("threads").doc();
      const userRef = firebase.firestore().collection("users").doc(userId);
      const forumRef = firebase.firestore().collection("forums").doc(forumId);

      const thread = {
        forumId,
        title,
        id: threadRef.id,
        userId,
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // performing batch
      const batch = firebase.firestore().batch();

      batch.set(threadRef, thread);
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      await batch.commit();

      const newThread = await threadRef.get();

      commit(
        "SET_ITEM",
        {
          resource: "threads",
          item: {
            ...newThread.data(),
            id: newThread.id,
          },
        },
        { root: true }
      );
      commit(
        "users/APPEND_THREAD_TO_USER",
        {
          parentId: userId,
          childId: threadRef.id,
        },
        { root: true }
      );
      commit(
        "forums/APPEND_THREAD_TO_FORUM",
        {
          parentId: forumId,
          childId: threadRef.id,
        },
        { root: true }
      );
      await dispatch(
        "posts/createPost",
        { text, threadId: threadRef.id },
        { root: true }
      );

      return findById(state.items, threadRef.id);
    },
    async updateThread({ commit, state, rootState }, { title, text, id }) {
      const thread = findById(state.items, id);
      const post = findById(rootState.posts.items, thread.posts[0]);
      let newThread = { ...thread, title };
      let newPost = { ...post, text };

      const threadRef = firebase.firestore().collection("threads").doc(id);
      const postRef = firebase.firestore().collection("posts").doc(post.id);
      const batch = firebase.firestore().batch();
      batch.update(threadRef, newThread);
      batch.update(postRef, newPost);
      await batch.commit();
      newThread = await threadRef.get();
      newPost = await postRef.get();

      commit(
        "SET_ITEM",
        { resource: "threads", item: newThread },
        { root: true }
      );
      commit("SET_ITEM", { resource: "posts", item: newPost }, { root: true });

      return docToResource(newThread);
    },
    fetchThread: makeFetchItemAction({ emoji: "📄", resource: "threads" }),
    fetchThreads: makeFetchItemsAction({ emoji: "📄", resource: "threads" }),
    fetchThreadsByPage({ dispatch, commit }, { ids, page, perPage = 10 }) {
      commit("CLEAR_THREADS");
      const chunkedIds = chunk(ids, perPage)[page - 1];
      return dispatch("fetchThreads", { ids: chunkedIds });
    },
  },
  mutations: {
    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    APPEND_CONTRIBUTOR_TO_THREAD: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
    CLEAR_THREADS(state) {
      state.items = [];
    },
  },
};
