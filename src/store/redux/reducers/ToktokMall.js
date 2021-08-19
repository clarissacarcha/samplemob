import AsyncStorage from '@react-native-community/async-storage';
const INITIAL_STATE = {
  user_address: [],
  myFavorites: [
    {
      items: [
        {
          Id: 'ffed399d0ae94dd2852a62fb753130ff',
          compareAtPrice: '0.00',
          itemname: 'Pusheen the Cat Dragon Pip 6-Inch Plush',
          noOfStocks: 1,
          otherinfo: 'Pusheen the Cat',
          price: '1099.00',
          relevantProducts: [],
          shop: {
            address: '924 El Cano Street Tondo Manila 1013',
            id: 9,
            profileImages: [],
            shopcode: 'NOOK',
            shopname: "Alyanna's Nook Marketing",
            totalProducts: 286,
          },
          summary: `\"Pusheen the Cat Dragon Pip 6-Inch Plush

      Dragon Pip is purple… very purple! Fiercely adorable, the Pusheen the Cat Dragon Pip 6-Inch Plush features Pusheen's little brother as his dragon persona, complete with green-and-purple wings, tiny horns, and an mischievous expression.
      
      Surface-washable for easy cleaning. Ages 1 and up.\"`,
          tags: 'Plushie, Pusheen',
          variantSummary: [],
        },
        {
          Id: '01cbdbb28b5649f1b53a6399e68964d6',
          compareAtPrice: '0.00',
          itemname: "Donald Duck Ufufy Plush - Medium - 12''",
          noOfStocks: null,
          otherinfo: '',
          price: '1449.00',
          relevantProducts: [],
          shop: {
            address: '924 El Cano Street Tondo Manila 1013',
            id: 9,
            profileImages: [],
            shopcode: 'NOOK',
            shopname: "Alyanna's Nook Marketing",
            totalProducts: 286,
          },
          summary: "Donald Duck Ufufy Plush - Medium - 12''",
          tags: 'donald duck, mini, plushies, scented, Ufufy',
          variantSummary: [],
        },
      ],
      shop: {
        address: '924 El Cano Street Tondo Manila 1013',
        id: 9,
        profileImages: [],
        shopcode: 'NOOK',
        shopname: "Alyanna's Nook Marketing",
        totalProducts: 286,
      },
    },
    {
      items: [
        {
          Id: 'ffea9cc21dde4c5e9a6c269a02ad7f7b',
          compareAtPrice: '0.00',
          images: [],
          itemname: 'DEVON MICROFIBER HAND TOWEL GREEN 70*35CM',
          noOfStocks: 10,
          otherinfo: '',
          price: '169.00',
          relevantProducts: [],
          shop: {
            address: '59B Data Street, Santa Mesa Height, Galas, QC',
            id: 29,
            profileImages: [],
            shopcode: 'DEVO',
            shopname: 'Devon Home and Living',
            totalProducts: 82,
          },
          summary: `\"Microfiber hand towel 70*35cm absorbs water fast, capacity to absorb seven (7) times its weight;
      light weight, compact and thin, easy to carry;
      quick dry, dries three (3) times faster than cotton towels, thus preventing mildew formation and odors;\"`,
          tags: 'microfiber, towel, quick dry, lightweight',
          variantSummary: [],
        },
      ],
      shop: {
        address: '59B Data Street, Santa Mesa Height, Galas, QC',
        id: 29,
        profileImages: [],
        shopcode: 'DEVO',
        shopname: 'Devon Home and Living',
        totalProducts: 82,
      },
    },
  ],
  myCart: [],
  notifications: [],
  myFollowing: [
    {
      address: '59B Data Street, Santa Mesa Height, Galas, QC',
      id: 29,
      profileImages: [],
      shopcode: 'DEVO',
      shopname: 'Devon Home and Living',
      totalProducts: 82,
    },
    {
      address: '924 El Cano Street Tondo Manila 1013',
      id: 9,
      profileImages: [],
      shopcode: 'NOOK',
      shopname: "Alyanna's Nook Marketing",
      totalProducts: 286,
    },
  ],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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

      AsyncStorage.setItem('TOKTOK_MY_FOLLOWING', JSON.stringify(newMyFollowing));
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

      AsyncStorage.setItem('TOKTOK_MY_FAVORITES', JSON.stringify(newMyFavorites));
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
      AsyncStorage.setItem('TOKTOKMALL_USER_ADDRESS', JSON.stringify(new_user_address));
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
        myCartArr.push(action.payload)
        let stringyfiedCart = JSON.stringify(myCartArr);
        AsyncStorage.setItem('MyCart', stringyfiedCart);
        return {...state, myCart: myCartArr};
      } else if (action.action == 'removeItems') {
        return {...state, myCart: action.payload};
      } else if (action.action == 'clearAll') {
        
        AsyncStorage.setItem('MyCart', '[]');
        return {...state, myCart: []};

      } else if (action.action == 'DeleteMultiple') {

        let myCartArr = state.myCart
        action.payload.map((item, i) => {
          let index = myCartArr.findIndex( a => a.item_id == item.item_id)
          if(index > -1){
            myCartArr.splice(index, 1)
          }
        })
        AsyncStorage.setItem('MyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};

      } else if (action.action == 'DeleteSingle') {

        let myCartArr = state.myCart
        let index = myCartArr.findIndex( a => a.item_id == action.payload.item_id)
        if(index > -1){
          myCartArr.splice(index, 1)
        }
        AsyncStorage.setItem('MyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};

      } else if (action.action == 'UpdateQuantity') {

        let myCartArr = state.myCart
        let index = myCartArr.findIndex( a => a.item_id == action.payload.item_id)
        if(index > -1){
          myCartArr[index].qty += action.payload.qty
        }
        AsyncStorage.setItem('MyCart', JSON.stringify(myCartArr));
        return {...state, myCart: myCartArr};
        
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
