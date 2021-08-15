import {AsyncStorage} from 'react-native'
const INITIAL_STATE = {

    myCart: [
        {
          store_id: 1,
          store: 'Face Mask PH',
          cart: [
            {
              item_id: 1,
              label: 'Improved Copper Mask 2.0 White or Bronze',
              originalPrice: 380,
              price: 100,
              variation: 'Bronze',
              qty: 1,
              store_id: 1,
              store: 'Face Mask PH',
            },
            {
              item_id: 2,
              label: 'Improved Copper Mask 2.0 White or Bronze',
              originalPrice: 380,
              price: 150,
              variation: 'White',
              qty: 1, 
              store_id: 1,
              store: 'Face Mask PH',
            },
          ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
        },
        {
          store_id: 2,
          store: 'The Apparel',
          cart: [
            {
              item_id: 1,
              label: 'Graphic Tees',
              originalPrice: 380,
              price: 50,
              variation: 'White, L',
              qty: 2,
              store_id: 2,
              store: 'The Apparel',
            },
          ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
        },
        {
          store_id: 3,
          store: 'The Apparel 2',
          cart: [
            {
              item_id: 1,
              label: 'Graphic Tees',
              originalPrice: 380,
              price: 350,
              variation: 'White, L',
              qty: 2,
              store_id: 3,
              store: 'The Apparel 2',
            },
          ],delivery_fee: 80, date_range_from: 'Jul 20', date_range_to: 'Jul 25'
        },
      ],
  notifications: []
};
  
export default (state = INITIAL_STATE, action) => {

  switch (action.type) {
    case 'CREATE_MY_CART_SESSION':
      // let action = action.action
      if (action.action == 'set'){
        
        let stringyfiedPayload = JSON.stringify(action.payload)
        AsyncStorage.setItem('MyCart', stringyfiedPayload)
        return {...state, myCart: action.payload}

      } else if (action.action == 'push') {
        // console.log(action.payload)
        let myCartArr = state.myCart;
        if(myCartArr.length == 0){
          myCartArr.push(action.payload)
        }else {
          let indexOf = myCartArr.findIndex(x => x.store_id == action.payload.store_id)
          if(indexOf >= 0){
            myCartArr[indexOf].cart.push(action.payload.cart[0])
          }else{
            myCartArr.push(action.payload)
          }
        }
        // myCartArr.push(action.payload);
        let stringyfiedCart = JSON.stringify(myCartArr)
        AsyncStorage.setItem('MyCart', stringyfiedCart)
        return {...state, myCart: myCartArr};

      } else if (action.action == 'removeItems'){

        return{...state, myCart: action.payload}

      } else if (action.action == 'clearAll'){

        AsyncStorage.setItem('MyCart', '[]')
        return {...state, myCart: []}

      }
    case 'CREATE_NOTIFICATIONS_SESSION':
      if(action.action == 'set'){
        
        let stringyfiedPayload = JSON.stringify(action.payload)
        AsyncStorage.setItem('Notifications', stringyfiedPayload)
        return {...state, notifications: action.payload}

      }else if(action.action == 'push'){

        let notifArr = state.notifications;
        notifArr.push(action.payload) 
        let stringyfiedNotifs = JSON.stringify(notifArr)
        AsyncStorage.setItem('Notifications', stringyfiedNotifs)
        return {...state, notifications: notifArr};

      }else if(action.action == 'read'){

        let notifArr = state.notifications;
        let index = notifArr.findIndex(raw => raw.id == action.payload)
        notifArr[index].read = 1
        let stringyfiedNotifs = JSON.stringify(notifArr)
        AsyncStorage.setItem('Notifications', stringyfiedNotifs)
        return {...state, notifications: notifArr};

      }

    default:
      return state;
  }
};


  