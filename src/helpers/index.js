export const findById = (resources, id) =>
  resources?.find((r) => r.id === id) || null;

export const upsert = (resources, resource) => {
  const index = resources.findIndex((r) => r.id === resource.id);

  if (resource.id && index !== -1) {
    resources[index] = resource;
  } else {
    resources.push(resource);
  }
};

export const docToResource = (doc) => {
  if (typeof doc?.data !== "function") return doc;

  return { ...doc.data(), id: doc.id };
};

export const makeAppendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state.items, parentId);

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
};

export const makeFetchItemAction = ({ resource, emoji }) => {
  return ({ dispatch }, payload) =>
    dispatch("fetchItem", { resource, emoji, ...payload }, { root: true });
};

export const makeFetchItemsAction = ({ resource, emoji }) => {
  return ({ dispatch }, payload) =>
    dispatch("fetchItems", { resource, emoji, ...payload }, { root: true });
};

export const arrayRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
