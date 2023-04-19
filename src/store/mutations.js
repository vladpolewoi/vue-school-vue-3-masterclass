import { findById, upsert, docToResource } from "@/helpers";

export default {
  SET_ITEM(state, { resource, item }) {
    upsert(state[resource], docToResource(item));
  },
  APPEND_UNSUBSCRIBE(state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe);
  },
  CLEAR_ALL_UNSUBSCRIBES(state) {
    state.unsubscribes = [];
  },
  SET_AUTH_ID(state, id) {
    state.authId = id;
  },
  SET_AUTH_USER_UNSUBSCRIBE(state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe;
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
  APPEND_CONTRIBUTOR_TO_THREAD: makeAppendChildToParentMutation({
    parent: "threads",
    child: "contributors",
  }),
};

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);

    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed. ${parent} not found.`
      );
      return null;
    }

    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}
