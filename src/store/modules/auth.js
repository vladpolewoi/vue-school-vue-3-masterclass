import firebase from "@/helpers/firebase";
import useNotifications from "@/composables/useNotifications.js";

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null,
  },
  getters: {
    getAuthUser: (state, getters, rootState, rootGetters) => {
      return rootGetters["users/user"](state.authId) || null;
    },
  },
  actions: {
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
    async registerUserWithEmailAndPassword(
      { dispatch },
      { avatar = null, email, name, username, password }
    ) {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      avatar = await dispatch("uploadAvatar", {
        authId: result.user.uid,
        file: avatar,
      });

      await dispatch(
        "users/createUser",
        {
          id: result.user.uid,
          email,
          name,
          username,
          avatar,
        },
        { root: true }
      );
    },
    async uploadAvatar({ state }, { authId, file, filename }) {
      if (!file) return null;

      authId = authId || state.authId;
      filename = filename || file.name;

      try {
        const storageBucket = firebase
          .storage()
          .ref()
          .child(`uploads/${authId}/images/${Date.now()}-${filename}`);
        const snapshot = await storageBucket.put(file);
        const url = await snapshot.ref.getDownloadURL();
        return url;
      } catch (err) {
        const { addNotification } = useNotifications();
        addNotification({ message: "Error uploading avatar", type: "error" });
      }
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
        await dispatch(
          "users/createUser",
          {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            username: user.displayName,
            avatar: user.photoURL,
          },
          { root: true }
        );
      }
    },
    async signOut({ commit }) {
      await firebase.auth().signOut();
      commit("SET_AUTH_ID", null);
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser?.uid;

      if (!userId) {
        return null;
      }

      await dispatch(
        "fetchItem",
        {
          resource: "users",
          id: userId,
          emoji: "👤",
          handleUnsubscribe: (unsubscribe) => {
            commit("SET_AUTH_USER_UNSUBSCRIBE", unsubscribe);
          },
        },
        { root: true }
      );
      commit("SET_AUTH_ID", userId);
    },
    async fetchAuthUsersPosts({ commit, state }, { startAfter }) {
      let query = firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", state.authId)
        .orderBy("publishedAt", "desc")
        .limit(3);

      if (startAfter) {
        const doc = await firebase
          .firestore()
          .collection("posts")
          .doc(startAfter.id)
          .get();
        query = query.startAfter(doc);
      }

      const posts = await query.get();
      posts.forEach((post) => {
        commit("SET_ITEM", { resource: "posts", item: post }, { root: true });
      });
    },
    async unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit("SET_AUTH_USER_UNSUBSCRIBE", null);
      }
    },
  },
  mutations: {
    SET_AUTH_ID(state, id) {
      state.authId = id;
    },
    SET_AUTH_USER_UNSUBSCRIBE(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },
    SET_AUTH_OBSERVER_UNSUBSCRIBE(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe;
    },
  },
};
