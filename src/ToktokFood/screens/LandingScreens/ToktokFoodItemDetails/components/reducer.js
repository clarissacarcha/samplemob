export default reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_VARIANTS':
      return [{...state, variants: action.payload}];
    case 'UPDATE_ADD_ONS':
      return [{...state, addOns: action.payload}];
  }
};
