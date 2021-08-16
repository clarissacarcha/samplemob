
import AsyncStorage from '@react-native-community/async-storage';
const INITIAL_STATE = {
  user_address: [],
  myCart: [
  ],
  notifications: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'TOKTOKMALL_USER_ADDRESS':
      let new_user_address = []
      if (action.action === 'add') {
        new_user_address = [...state.user_address, action.payload]
      }
      if (action.action === 'set') {
        new_user_address = action.payload;
      }
      if (action.action === 'changeDefault') {
        new_user_address = state.user_address.map((data) =>
          data.id === action.payload
            ? {
                ...data,
                defaultAdd: 1,
              }
            : {
                ...data,
                defaultAdd: 0,
              },
        );
      }

      if (action.action === 'update') {
        new_user_address = state.user_address.map((data) =>
          data.id === action.payload.id ? action.payload : data,
        );
      }
      AsyncStorage.setItem('TOKTOKMALL_USER_ADDRESS', JSON.stringify(new_user_address))
      return {...state, user_address: new_user_address};
    case 'CREATE_MY_CART_SESSION':
      // let action = action.action
      if (action.action == 'set') {
        let stringyfiedPayload = JSON.stringify(action.payload);
        AsyncStorage.setItem('MyCart', stringyfiedPayload);
        return {...state, myCart: action.payload};
      } else if (action.action == 'push') {
        // console.log(action.payload)
        let myCartArr = state.myCart;
        if (myCartArr.length == 0) {
          myCartArr.push(action.payload);
        } else {
          let indexOf = myCartArr.findIndex((x) => x.store_id == action.payload.store_id);
          if (indexOf >= 0) {
            myCartArr[indexOf].cart.push(action.payload.cart[0]);
          } else {
            myCartArr.push(action.payload);
          }
        }
        // myCartArr.push(action.payload);
        let stringyfiedCart = JSON.stringify(myCartArr);
        AsyncStorage.setItem('MyCart', stringyfiedCart);
        return {...state, myCart: myCartArr};
      } else if (action.action == 'removeItems') {
        return {...state, myCart: action.payload};
      } else if (action.action == 'clearAll') {
        AsyncStorage.setItem('MyCart', '[]');
        return {...state, myCart: []};
      }
    case 'CREATE_NOTIFICATIONS_SESSION':
      if (action.action == 'set') {
        let stringyfiedPayload = JSON.stringify(action.payload);
        AsyncStorage.setItem('Notifications', stringyfiedPayload);
        return {...state, notifications: action.payload};
      } else if (action.action == 'push') {
        let notifArr = state.notifications;
        notifArr.push(action.payload);
        let stringyfiedNotifs = JSON.stringify(notifArr);
        AsyncStorage.setItem('Notifications', stringyfiedNotifs);
        return {...state, notifications: notifArr};
      } else if (action.action == 'read') {
        let notifArr = state.notifications;
        let index = notifArr.findIndex((raw) => raw.id == action.payload);
        notifArr[index].read = 1;
        let stringyfiedNotifs = JSON.stringify(notifArr);
        AsyncStorage.setItem('Notifications', stringyfiedNotifs);
        return {...state, notifications: notifArr};
      }
    default:
      return state;
  }
};
