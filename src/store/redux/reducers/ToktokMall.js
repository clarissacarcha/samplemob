const INITIAL_STATE = {

};
  
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CREATE_SESSION':
        return {...state, ...action.payload};
        default:
        return state;
    }
};
  