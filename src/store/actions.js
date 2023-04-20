import firebase from "firebase/compat";
import { findById, docToResource } from "@/helpers";

export default {
  initAuthentication({ dispatch, commit, state }) {
    if (state.authObserverUnsubscribe) {
      state.authObserverUnsubscribe();
    }

    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await dispatch("fetchAuthUser");
          resolve(user);
        }

        resolve(null);
      });
      commit("SET_AUTH_OBSERVER_UNSUBSCRIBE", unsubscribe);
    });
  },
  async createPost({ commit, state }, post) {
    const payload = {
      userId: state.authId,
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
    const userRef = firebase.firestore().collection("users").doc(state.authId);
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

    commit("SET_ITEM", {
      resource: "posts",
      item: { ...payload, id: newPost.id },
    });
    commit("APPEND_POST_TO_THREAD", {
      childId: newPost.id,
      parentId: post.threadId,
    });
    commit("APPEND_CONTRIBUTOR_TO_THREAD", {
      childId: payload.userId,
      parentId: post.threadId,
    });
  },
  async registerUserWithEmailAndPassword(
    { dispatch },
    { avatar = null, email, name, username, password }
  ) {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    await dispatch("createUser", {
      id: result.user.uid,
      email,
      name,
      username,
      avatar,
    });
  },
  signInWithEmailAndPassword(_, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  async signInWithGoogle({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await firebase.auth().signInWithPopup(provider);
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await dispatch("createUser", {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        username: user.displayName,
        avatar: user.photoURL,
      });
    }
  },
  async signOut({ commit }) {
    await firebase.auth().signOut();
    commit("SET_AUTH_ID", null);
  },
  async createUser({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
    const usernameLower = username.toLowerCase();
    email = email.toLowerCase();
    const user = {
      avatar,
      email,
      name,
      username,
      usernameLower,
      registeredAt,
    };
    const userRef = firebase.firestore().collection("users").doc(id);
    await userRef.set(user);
    const newUser = await userRef.get();

    commit("SET_ITEM", { resource: "users", item: newUser });

    return docToResource(newUser);
  },
  updateUser({ commit }, user) {
    commit("SET_ITEM", { resource: "users", item: user });
  },
  async updatePost({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false,
      },
    };
    const postRef = firebase.firestore().collection("posts").doc(id);
    await postRef.update(post);

    const updatedPost = await postRef.get();
    commit("SET_ITEM", { resource: "posts", item: docToResource(updatedPost) });
  },
  async createThread({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId;
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

    commit("SET_ITEM", {
      resource: "threads",
      item: {
        ...newThread.data(),
        id: newThread.id,
      },
    });
    commit("APPEND_THREAD_TO_USER", {
      parentId: userId,
      childId: threadRef.id,
    });
    commit("APPEND_THREAD_TO_FORUM", {
      parentId: forumId,
      childId: threadRef.id,
    });
    await dispatch("createPost", { text, threadId: threadRef.id });

    return findById(state.threads, threadRef.id);
  },
  async updateThread({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id);
    const post = findById(state.posts, thread.posts[0]);
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

    commit("SET_ITEM", { resource: "threads", item: newThread });
    commit("SET_ITEM", { resource: "posts", item: newPost });

    return docToResource(newThread);
  },

  fetchThread: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "threads", id, emoji: "📄" }),

  fetchUser: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "users", id, emoji: "👤" }),

  fetchAuthUser: async ({ dispatch, commit }) => {
    const userId = firebase.auth().currentUser?.uid;

    if (!userId) {
      return null;
    }

    await dispatch("fetchItem", {
      resource: "users",
      id: userId,
      emoji: "👤",
      handleUnsubscribe: (unsubscribe) => {
        commit("SET_AUTH_USER_UNSUBSCRIBE", unsubscribe);
      },
    });
    commit("SET_AUTH_ID", userId);
  },

  fetchPost: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "posts", id, emoji: "💬" }),

  fetchForum: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "forums", id, emoji: "🏁" }),

  fetchCategory: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "categories", id, emoji: "🏷" }),

  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" }),

  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "threads", ids, emoji: "📄" }),

  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "users", ids, emoji: "👤" }),

  fetchForums: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "forums", ids, emoji: "🏁" }),

  fetchAllCategories({ commit }) {
    console.log("🔥", "🏷", "all categories");
    return new Promise((resolve) => {
      const unsubscribe = firebase
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
      commit("APPEND_UNSUBSCRIBE", { unsubscribe });
    });
  },
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
  async unsubscribeAuthUserSnapshot({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe();
      commit("SET_AUTH_USER_UNSUBSCRIBE", null);
    }
  },
};
