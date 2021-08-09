import {AsyncStorage} from 'react-native'
const INITIAL_STATE = {
    myCart: []
};
  
export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'CREATE_MY_CART_SESSION':
        // let action = action.action
        if (action.action == 'set'){
            let stringyfiedPayload = JSON.stringify(action.payload)
            AsyncStorage.setItem('MyCart', stringyfiedPayload)
            return {...state, myCart: action.payload}
        }else if (action.action == 'push') {
            let myCartArr = state.myCart;
            if(myCartArr.length == 0){
                myCartArr.push({store_id: action.payload.store_id, store: action.payload.store, cart: [action.payload]})
            }else {
                let indexOf = myCartArr.findIndex(x => x.store_id == action.payload.store_id)
                if(indexOf >= 0){
                    myCartArr[indexOf].cart.push(action.payload)
                }else {
                    selectedItemsArr.push({store_id:action.payload.store_id, store: action.payload.store, cart: [action.payload]})
                }
            }
            myCartArr.push(action.payload);
            let stringyfiedCart = JSON.stringify(myCartArr)
            AsyncStorage.setItem('MyCart', stringyfiedCart)
            alert(JSON.stringify(myCartArr))
            return {...state, myCart: myCartArr};
        } else if (action.action == 'removeItems'){
            return{...state, myCart: action.payload}
        }else if (action.action == 'clearAll'){
            AsyncStorage.setItem('MyCart', '[]')
            return {...state, myCart: []}
        } 
        // alert(JSON.stringify(action.action))
        // return state
        default:
        return state;
  }
};


  