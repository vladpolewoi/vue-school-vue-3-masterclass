import firebase from "firebase/compat/app";
import {
  docToResource,
  makeFetchItemAction,
  makeFetchItemsAction,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    async createPost({ commit, rootState }, post) {
      const payload = {
        userId: rootState.auth.authId,
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...post,
      };

      // performing batch
      const batch = firebase.firestore().batch();
      const postRef = firebase.firestore().collection("posts").doc();
      const threadRef = firebase
        .firestore()
        .collection("threads")
        .doc(post.threadId);
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(rootState.auth.authId);
      batch.set(postRef, payload);
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(payload.userId),
      });
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1),
      });
      await batch.commit();

      const newPost = await postRef.get();
      commit(
        "SET_ITEM",
        {
          resource: "posts",
          item: { ...newPost.data(), id: newPost.id },
        },
        { root: true }
      );
      commit(
        "threads/APPEND_POST_TO_THREAD",
        {
          childId: newPost.id,
          parentId: post.threadId,
        },
        { root: true }
      );
      commit(
        "threads/APPEND_CONTRIBUTOR_TO_THREAD",
        {
          childId: payload.userId,
          parentId: post.threadId,
        },
        { root: true }
      );
    },
    async updatePost({ commit, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false,
        },
      };
      const postRef = firebase.firestore().collection("posts").doc(id);
      await postRef.update(post);

      const updatedPost = await postRef.get();
      commit(
        "SET_ITEM",
        {
          resource: "posts",
          item: docToResource(updatedPost),
        },
        { root: true }
      );
    },
    fetchPost: makeFetchItemAction({ resource: "posts", emoji: "💬" }),
    fetchPosts: makeFetchItemsAction({ resource: "posts", emoji: "💬" }),
  },
  mutations: {},
};
