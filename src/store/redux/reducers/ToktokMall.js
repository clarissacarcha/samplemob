import AsyncStorage from '@react-native-community/async-storage';
const INITIAL_STATE = {
  user_address: [],
  defaultAddress: {},
  myFavorites: [],
  myCart: [],
  notifications: [],
  myFollowing: [],
  searchHistory: [],
  myCartCount: 0,
  notificationCount: 0,
  otpAttempts: 1,
  customModal: {
    visible: false
  },
  customConfirmModal: {
    visible: false,
    onConfirmAction: () => {},
    message: "Are you sure you want to delete this item?"
  },
  customPlaceOrderModal: {
    visible: false,
    onConfirmAction: () => {},
    onCancelAction: () => {},
    title: "Your order has been placed!",
    message: "Your order has been placed successfully. Please visit My Orders to check the progress and other details."
  },
  modal: {
    visible: false,
  },
  customMessageModal: {
    visible: false,
    title: ["We're sorry but this product is ", "SOLD OUT."],
    message: "This item is currently out of stock.",
    action: {
      onPress: () => {},
      title: "Back to Home."
    }
  },
  toktokWalletBalance: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'TOKTOK_MALL_SET_TOKTOK_WALLET_BALANCE': 
    return {...state, toktokWalletBalance: action.payload};
    case 'TOKTOK_MALL_OPEN_MODAL':
    return {...state, customModal: {visible: true, ...action.payload}};
    case 'TOKTOK_MALL_CLOSE_MODAL':
    return {...state, customModal: {visible: false}};
    case 'TOKTOK_MALL_OPEN_MODAL_2':
    return {...state, modal: {...state.modal, visible: true, ...action.payload}};
    case 'TOKTOK_MALL_CLOSE_MODAL_2':
    return {...state, modal: {visible: false}};
    case 'TOKTOK_MALL_OPEN_CONFIRM_MODAL':
    return {...state, customConfirmModal: { ...state.customConfirmModal, visible: true, ...action.payload}};
    case 'TOKTOK_MALL_CLOSE_CONFIRM_MODAL':
    return {...state, customConfirmModal: INITIAL_STATE.customConfirmModal};
    case 'TOKTOK_MALL_OPEN_MESSAGE_MODAL':
      return {...state, customMessageModal: { ...state.customMessageModal, visible: true, ...action.payload}};
    case 'TOKTOK_MALL_CLOSE_MESSAGE_MODAL':
    return {...state, customMessageModal: INITIAL_STATE.customMessageModal};
    case 'TOKTOK_MALL_OPEN_PLACE_ORDER_MODAL':
      return {...state, customPlaceOrderModal: { ...state.customPlaceOrderModal, visible: true, ...action.payload}};
    case 'TOKTOK_MALL_CLOSE_PLACE_ORDER_MODAL':
    return {...state, customPlaceOrderModal: INITIAL_STATE.customPlaceOrderModal};
    case 'TOKTOK_MALL_CART_COUNT':
      let count = state.myCartCount
      if(action.action === "add"){
        count = count + action.payload
      }
      if(action.action === "remove"){
        count = count - action.payload
      }
      if(action.action === "set"){
        count = action.payload
      }
      AsyncStorage.setItem('ToktokMallUserCartCount', count + "");
      return {...state, myCartCount: count};
    case 'TOKTOK_MALL_OTP_ATTEMPTS':
      let attempts = state.otpAttempts
      if(action.action === "add"){
        attempts = attempts + action.payload
      }
      if(action.action === "remove"){
        attempts = attempts - action.payload
      }
      if(action.action === "set"){
        attempts = action.payload
      }
      AsyncStorage.setItem('ToktokMallOTPAttempts', attempts + "");
      return {...state, otpAttempts: count};
    case 'TOKTOK_MALL_NOTIFICATION_COUNT':
        let ncount = state.notificationCount
        if(action.action === "add"){
          ncount = ncount + action.payload
        }
        if(action.action === "remove"){
          ncount = ncount - action.payload
        }
        if(action.action === "set"){
          ncount = action.payload
        }
        AsyncStorage.setItem('ToktokMallUserNotificationCount', ncount + "");
        return {...state, notificationCount: ncount};
    case 'TOKTOK_MY_FOLLOWING':
      let newMyFollowing = state.myFollowing
      if(action.action === "follow"){
        newMyFollowing.push(action.payload)
      }
      if(action.action === "set"){
        newMyFollowing = action.payload
      }
      if(action.action === "unfollow"){
        let index = null
        newMyFollowing.map((data, i) => {
          if(data.id === action.payload.id){
            index = i
          }
        })

        newMyFollowing.splice(index, 1)
      }

      AsyncStorage.setItem('ToktokMallMyFollowing', JSON.stringify(newMyFollowing));
      return {...state, myFollowing: newMyFollowing};
    case 'TOKTOK_MY_FAVORITES':
      let newMyFavorites = state.myFavorites;
      if (action.action === 'add') {
        let shopExists = {
          index: 0,
          value: false,
        };
        state.myFavorites.map((data, index) => {
          if (data.shop.id === action.payload.shop.id) {
            shopExists = {
              index,
              value: true,
            };
          }
        });
        if (shopExists.value) {
          newMyFavorites[shopExists.index].items.push(action.payload.item);
        } else {
          newMyFavorites.push({shop: action.payload.shop, items: [action.payload.item]});
        }
      }
      if (action.action === 'delete') {
        let shopExists = {
          index: 0,
          value: false,
        };
        state.myFavorites.map((data, index) => {
          if (data.shop.id === action.payload.shop.id) {
            shopExists = {
              index,
              items: data.items.length > 1 ? 'many' : 'solo',
            };
          }
        });
        if (shopExists.items === 'many') {
          newMyFavorites = state.myFavorites;
          let index = 0;
          newMyFavorites[shopExists.index].items.map((data, i) => {
            if (data.Id === action.payload.item.Id) {
              index = i;
            }
          });
          newMyFavorites[shopExists.index].items.splice(index, 1);
        } else {
          newMyFavorites = state.myFavorites;
          newMyFavorites.splice(shopExists.index, 1);
        }
      }
      if (action.action === 'set') {
        newMyFavorites = action.payload;
      }

      AsyncStorage.setItem('ToktokMallMyFavorites', JSON.stringify(newMyFavorites));
      return {...state, myFavorites: newMyFavorites};
    case 'TOKTOKMALL_USER_ADDRESS':
      let new_user_address = [];
      if (action.action === 'add') {
        new_user_address = [...state.user_address, action.payload];
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
        new_user_address = state.user_address.map((data) => (data.id === action.payload.id ? action.payload : data));
      }
      if (action.action === "remove") {
        new_user_address = state.user_address.filter((data) => (data.id !== action.payload));
      }
      // AsyncStorage.setItem('ToktokMallUserAddresses', JSON.stringify(new_user_address));
      return {...state, user_address: new_user_address};
    case 'CREATE_MY_CART_SESSION':
      // let action = action.action
      if (action.action == 'set') {
        let stringyfiedPayload = JSON.stringify(action.payload);
        AsyncStorage.setItem('ToktokMallMyCart', stringyfiedPayload);
        return {...state, myCart: action.payload};
      } else if (action.action == 'push') {
        // console.log(action.payload)
        let myCartArr = state.myCart;
        let exists = false
        myCartArr = myCartArr.map((item) => {
          if(item.item_id === action.payload.item_id && item.variation === action.payload.variation){
            exists = true
            return {
              ...item,
              qty: item.qty + action.payload.qty
            }
          }else{
            return item
          }
        })
        console.log(myCartArr)
        if(!exists){
        myCartArr.push(action.payload)
        }
        let stringyfiedCart = JSON.stringify(myCartArr.reverse());
        AsyncStorage.setItem('ToktokMallMyCart', stringyfiedCart);
        return {...state, myCart: myCartArr};
      } else if (action.action == 'removeItems') {
        return {...state, myCart: action.payload};
      } else if (action.action == 'clearAll') {
        
        AsyncStorage.setItem('ToktokMallMyCart', '[]');
        return {...state, myCart: []};

      } else if (action.action == 'DeleteMultiple') {

        let myCartArr = state.myCart
        action.payload.map((item, i) => {
          let index = myCartArr.findIndex( a => a.item_id == item.item_id)
          if(index > -1){
            myCartArr.splice(index, 1)
          }
        })
        AsyncStorage.setItem('ToktokMallMyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};

      } else if (action.action == 'DeleteSingle') {

        let myCartArr = state.myCart
        let index = myCartArr.findIndex( a => a.item_id == action.payload.item_id)
        if(index > -1){
          myCartArr.splice(index, 1)
        }
        AsyncStorage.setItem('ToktokMallMyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};

      } else if (action.action == 'UpdateQuantity') {

        let myCartArr = state.myCart
        let index = myCartArr.findIndex( a => a.item_id == action.payload.item_id)
        if(index > -1){
          myCartArr[index].qty = action.payload.qty
        }
        AsyncStorage.setItem('ToktokMallMyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};
        
      }
    case 'CREATE_NOTIFICATIONS_SESSION':
      if (action.action == 'set') {
        let stringyfiedPayload = JSON.stringify(action.payload);
        AsyncStorage.setItem('ToktokMallNotifications', stringyfiedPayload);
        return {...state, notifications: action.payload};
      } else if (action.action == 'push') {
        let notifArr = state.notifications;
        notifArr.push(action.payload);
        let stringyfiedNotifs = JSON.stringify(notifArr);
        AsyncStorage.setItem('ToktokMallNotifications', stringyfiedNotifs);
        return {...state, notifications: notifArr};
      } else if (action.action == 'read') {
        let notifArr = state.notifications;
        // console.log(action.payload, notifArr)
        // let index = notifArr.findIndex((raw) => raw.id == action.payload);
        // notifArr[index].read = 1;
        notifArr.splice(0, 1)
        let stringyfiedNotifs = JSON.stringify(notifArr);
        AsyncStorage.setItem('ToktokMallNotifications', stringyfiedNotifs);
        return {...state, notifications: notifArr};
      }
    case 'CREATE_SEARCH_HISTORY_SESSION': 
      if(action.action == 'set') {
        let stringyfiedPayload = JSON.stringify(action.payload);
        AsyncStorage.setItem('ToktokMallSearchHistory', stringyfiedPayload);
        return {...state, searchHistory: action.payload};
      } else if (action.action == 'push') {
        let hist = state.searchHistory;
          if(hist.indexOf(action.payload) == -1){
            hist = [ action.payload,...hist]     
          }
        
        let stringyfiedHist = JSON.stringify(hist);
        AsyncStorage.setItem('ToktokMallSearchHistory', stringyfiedHist);
        return {...state, searchHistory: hist};
      } else if(action.action == 'pop') {
        let hist = state.searchHistory;
        hist.splice(action.payload);
        let stringyfiedHist = JSON.stringify(hist);
        AsyncStorage.setItem('ToktokMallSearchHistory', stringyfiedHist);
        return {...state, searchHistory: hist};
      } else if(action.action == 'clear') {
        AsyncStorage.setItem('ToktokMallSearchHistory', JSON.stringify([]));
        return {...state, searchHistory: []};
      }
    case 'CREATE_DEFAULT_ADDRESS_SESSION':
      if(action.action == "set") {
        AsyncStorage.setItem('ToktokMallUserDefaultAddress', JSON.stringify(action.payload))
        return {...state, defaultAddress: action.payload}
      }
    default:
      return state;
  }
};
