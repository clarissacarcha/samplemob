const INITIAL_STATE = {
  notificationDeliveryId: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKTOK_DELIVERY_NOTIFICATION_DELIVERY':
      return {...state, ...action.payload};
    case 'SET_TOKTOK_DELIVERY_INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
};
