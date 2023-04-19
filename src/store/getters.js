import { findById } from "@/helpers";

export default {
  getAuthUser: (state, getters) => {
    return getters.user(state.authId) || null;
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
      const postsCount = user.postsCount || 0;
      const threadsCount = user.threads?.length || 0;

      return {
        ...user,
        posts,
        threads,
        postsCount,
        threadsCount,
      };
    };
  },
};
