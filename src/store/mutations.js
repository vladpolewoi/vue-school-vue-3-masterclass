import { upsert, docToResource } from "@/helpers";

export default {
  SET_ITEM(state, { resource, item }) {
    upsert(state[resource].items, docToResource(item));
  },
  APPEND_UNSUBSCRIBE(state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe);
  },
  CLEAR_ALL_UNSUBSCRIBES(state) {
    state.unsubscribes = [];
  },
};
