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
        }else {
            let myCartArr = state.myCart;
            myCartArr.push(action.payload);
            let stringyfiedCart = JSON.stringify(myCartArr)
            AsyncStorage.setItem('MyCart', stringyfiedCart)
            alert(JSON.stringify(myCartArr))
            return {...state, myCart: myCartArr};
        }
        // alert(JSON.stringify(action.action))
        // return state
        default:
        return state;
  }
};


  