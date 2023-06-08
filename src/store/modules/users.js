import firebase from "@/helpers/firebase";
import { makeFetchItemAction, makeFetchItemsAction } from "@/helpers";

import {
  findById,
  makeAppendChildToParentMutation,
  docToResource,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    getAuthUser: (state, getters, rootState) => {
      return getters.user(rootState.auth.authId) || null;
    },
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id);

        if (!user) {
          return null;
        }

        const posts = rootState.posts?.items?.filter(
          (post) => post.userId === user.id
        );
        const threadIds = rootState.threads?.items?.filter(
          (thread) => thread.userId === user.id
        );
        const postsCount = user.postsCount || 0;
        const threadsCount = user.threads?.length || 0;

        return {
          ...user,
          posts,
          threadIds,
          postsCount,
          threadsCount,
        };
      };
    },
  },
  actions: {
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

      commit("SET_ITEM", { resource: "users", item: newUser }, { root: true });

      return docToResource(newUser);
    },
    async updateUser({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        email: user.email || null,
        name: user.name || null,
        username: user.username || null,
        bio: user.bio || null,
        website: user.website || null,
        location: user.location || null,
      };
      const userRef = firebase.firestore().collection("users").doc(user.id);
      await userRef.update(updates);
      commit("SET_ITEM", { resource: "users", item: user }, { root: true });
    },

    fetchUser: makeFetchItemAction({ resource: "users", emoji: "🙋‍♂️" }),
    fetchUsers: makeFetchItemsAction({ resource: "users", emoji: "🙋‍♂️" }),
  },
  mutations: {
    APPEND_THREAD_TO_USER: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
  },
};
