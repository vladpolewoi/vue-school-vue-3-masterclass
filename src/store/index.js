import { createStore } from "vuex";
import getters from "@/store/getters";
import actions from "@/store/actions";
import mutations from "@/store/mutations";
import categories from "@/store/modules/categories";
import forums from "@/store/modules/forums";
import threads from "@/store/modules/threads";
import users from "@/store/modules/users";
import auth from "@/store/modules/auth";
import posts from "@/store/modules/posts";

export default createStore({
  modules: {
    categories,
    forums,
    threads,
    users,
    posts,
    auth,
  },
  state: {
    unsubscribes: [],
  },
  getters,
  actions,
  mutations,
});
