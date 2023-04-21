import firebase from "firebase/compat";

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
    async fetchAuthUsersPosts({ commit, state }) {
      const posts = await firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", state.authId)
        .get();
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
