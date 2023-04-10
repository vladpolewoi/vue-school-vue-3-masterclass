import { createStore } from "vuex";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";

export default createStore({
  state: {
    forums: [],
    users: [],
    posts: [],
    threads: [],
    categories: [],
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
    unsubscribes: [],
  },
  getters,
  actions,
  mutations,
});
