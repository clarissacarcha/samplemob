import React, {useEffect, useContext, useState, useCallback} from 'react';
import Toast from 'react-native-simple-toast';
import {useNavigation, useRoute} from '@react-navigation/native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {VerifyContext} from './VerifyContextProvider';
import uuid from 'react-native-uuid';
import _ from 'lodash';

// Utils
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import { storeTemporaryCart, getTemporaryCart } from 'toktokfood/helper/TemporaryCart';
import {
  POST_TEMPORARY_CART,
  PATCH_TEMPORARY_CART_ITEM,
  DELETE_TEMPORARY_CART_ITEM,
  GET_TEMPORARY_CART,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_HAS_TEMPORARY_CART
} from 'toktokfood/graphql/toktokfood';
import {useMutation, useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useDispatch, useSelector} from 'react-redux';
import Loader from 'toktokfood/components/Loader';

export const FoodCart = ({basePrice = 0.0, loading}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routes = useRoute();
  const [loader, setLoader] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);
  const [disabledMaxQty, setDisableMaxQty] = useState(false);
  const { Id, selectedAddons, selectedItemId, selectedPrice, selectedQty, selectedNotes } = routes.params;
  const {
    totalPrice,
    setTotalPrice,
    optionsAmount,
    count,
    setCount,
    selected,
    notes,
    productDetails,
    requiredOptions,
    temporaryCart,
  } = useContext(VerifyContext);
  const {customerInfo} = useSelector((state) => state.toktokFood);

  const [postTemporaryCart, {loading: postLoading, error: postError}] = useMutation(POST_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: (err) => {
      setLoader(false)
      setTimeout(() => { Alert.alert('', 'Something went wrong.') }, 100)
    },
    onCompleted: ({postTemporaryCart}) => {
      // console.log(postTemporaryCart)
    },
  });

  const [patchTemporaryCartItem, {loading: patchLoading, error: patchError}] = useMutation(PATCH_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: (err) => {
      setLoader(false)
      setTimeout(() => { Alert.alert('', 'Something went wrong.') }, 100)
    },
    onCompleted: ({patchTemporaryCartItem}) => {
      // console.log(patchTemporaryCartItem)
    },
  });

  const [deleteTemporaryCartItem, {loading: deleteItemLoading, error: deleteItemError}] = useMutation(DELETE_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: (err) => {
      setLoader(false)
      setTimeout(() => { Alert.alert('', 'Something went wrong.') }, 100)
    },
    onCompleted: ({deleteTemporaryCartItem}) => {
      // console.log(patchTemporaryCartItem)
    },
  });

  const [deleteShopTemporaryCart, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_SHOP_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: (err) => {
      setLoader(false)
      setTimeout(() => { Alert.alert('', 'Something went wrong.') }, 100)
    },
    onCompleted: ({deleteShopTemporaryCart}) => {
      // console.log(patchTemporaryCartItem)
    },
  });

  const [checkHasTemporaryCart, {data: hasTemporaryCart, loading: hasCartLoading, error: hasCartError}] = useLazyQuery(CHECK_HAS_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: (err) => {
      setLoader(false)
      setTimeout(() => { Alert.alert('', 'Something went wrong.') }, 100)
    }
  });

  useEffect(() => {
    if(customerInfo){
      checkHasTemporaryCart({ variables: { input: { userId: customerInfo.userId } } })
    }
  }, [customerInfo])

  useEffect(() => {
    if(productDetails && Object.keys(productDetails).length > 0){
      if(productDetails.maxQtyIsset == 1){
        if(temporaryCart.items.length > 0){
          const hasItem = temporaryCart.items.filter((item) => { return item.productid == productDetails.Id });
          if(hasItem.length > 0){
            let currentQty = 0;
            hasItem.map((item) => {
              currentQty += item.quantity
            })
            let isEditQtty = selectedItemId == undefined ? (count.quantity + currentQty) : count.quantity 
            let exceededQty = currentQty == productDetails.maxQty ? currentQty : isEditQtty
            let disableMaxQtyCondition = selectedItemId == undefined ? exceededQty > productDetails.maxQty : selectedQty + (productDetails.maxQty - currentQty) == count.quantity 
            let disableAddCondition = selectedItemId == undefined ? exceededQty > productDetails.maxQty - 1 : selectedQty + (productDetails.maxQty - currentQty) == count.quantity 
            
            setDisableMaxQty((currentQty == productDetails.maxQty && selectedItemId == undefined) || selectedItemId == undefined && disableMaxQtyCondition)
            setDisableAdd(disableAddCondition)
            return
          }
        }
        setDisableMaxQty(count.quantity > productDetails.maxQty)
        setDisableAdd(count.quantity > productDetails.maxQty - 1)
      } else {
        setDisableAdd(productDetails.stocks == count.quantity)
      }
    } 
  }, [productDetails, temporaryCart, count])
 
  const computeTotalPrice = async (items) => {
    let amount = 0;
    await Object.values(items).map((val) => {
      amount += val.srp_totalamount;
    });
    return amount + totalPrice;
  };

  const isEqual = (obj1, obj2) => {
    let data = []
    let filter = obj1.filter((b1) => { return obj2.includes(b1.id) });

    return obj2.length == filter.length
  }

  const onRestaurantNavigate = async() => {
    let required = await Object.keys(requiredOptions).filter((val) => { return selected[val] == undefined });
    if(required.length > 0){
      Alert.alert(`${required[0]} is required.`, )
    } else {
      processAddToCart()
    }
  };

  const extractAddons = () => {
    let addons = []
    if(Object.values(selected).length > 0){
      Object.values(selected).map((item) => {
        item.map((val) => {
          addons.push(val.addon_id)
        })
      })
    }
    return addons
  }

  //PROCESS ADD TO CART
  const processAddToCart = async() => {
    
    let items = {
      userid: customerInfo.userId,
      shopid: +productDetails.sysShop,
      branchid: 0,
      productid: productDetails.Id,
      quantity: count.quantity,
      addons: extractAddons(),
      notes: notes
    }
    let filterItemByProductId = await temporaryCart.items.filter((item) => { 
      return item.productid == productDetails.Id
    })
    let duplicateItem = await filterItemByProductId.filter((item) => { 
      return isEqual(item.addonsDetails, items.addons)
    })
  
    let editedItem = await temporaryCart.items.filter((item) => { return item.id == selectedItemId })

    if(duplicateItem.length == 0){
      if(selectedItemId){
        setLoader(true)
        items['updateid'] = selectedItemId
        return patchCartItem(items)
      }
      if(temporaryCart.items.length > 0){
        setLoader(true)
        return addToCart(items)
      }
      if(hasTemporaryCart.checkHasTemporaryCart.shopid){
        Alert.alert(
          '',
          'You have existing items on your cart. If you add this to cart, the current cart will be empty. Would you like to proceed?',
        [
          { text: 'No', onPress: () => {} },
          { text: "Yes", onPress: () => {
            setLoader(true)
            deleteShopTemporaryCart({ variables: { 
              input: { 
                userid: customerInfo.userId,
                shopid: hasTemporaryCart.checkHasTemporaryCart.shopid,
                branchid: 0,
              } 
            }}).then(({ data }) => {
              let {status, message} = data.deleteShopTemporaryCart;
              if(status == 200){
                addToCart(items)
              } else {
                setLoader(false)
                setTimeout(() => { Alert.alert('', message) }, 100)
              }
            })
          }},
        ]);
      } else {
        setLoader(true)
        addToCart(items)
      }
    } else {
      let sameAsDuplicateItem = duplicateItem[0]?.id == selectedItemId 
      let editedId = sameAsDuplicateItem ? selectedItemId : duplicateItem[0].id
      items['updateid'] = editedId
    
      setLoader(true)
      if((duplicateItem.length > 0 || items.quantity != duplicateItem[0].quantity) && !selectedItemId){
        items.quantity += duplicateItem[0].quantity
      }
      if(((!sameAsDuplicateItem) && selectedItemId != undefined)){
        items.quantity += duplicateItem[0].quantity
        return deleteCartItem(selectedItemId, items, 'edit')
      }
      patchCartItem(items)
    }
  }

  const deleteCartItem = (editedId, items, action) => {
    deleteTemporaryCartItem({ variables: { input: { deleteid: editedId }}})
      .then(({ data }) => {
        let {status, message} = data.deleteTemporaryCartItem;
        if(status == 200){
          patchCartItem(items);
        } else {
          setLoader(false)
          setTimeout(() => { Alert.alert('', message) }, 100)
        }
      });
  }

  const patchCartItem = (items) => {
    patchTemporaryCartItem({ variables: { input: items } })
      .then(({ data }) => {
        let {status, message} = data.patchTemporaryCartItem;
        if(status == 200){
          setTimeout(() => {
            setLoader(false)
            Toast.show('Added to cart', Toast.SHORT);
            navigation.navigate('ToktokFoodRestaurantOverview');
          }, 1000)
        } else {
          setLoader(false)
          setTimeout(() => { Alert.alert('', message) }, 100)
        }
      });
  }

  const addToCart = (items) => {
    postTemporaryCart({ variables: { input: items } })
      .then(({data}) => {
        let { status, message } = data.postTemporaryCart;
        if(status == 200){
          setTimeout(() => {
            setLoader(false)
            Toast.show('Added to cart', Toast.SHORT);
            navigation.navigate('ToktokFoodRestaurantOverview');
          }, 1000)
        } else {
          setLoader(false)
          setTimeout(() => { Alert.alert('', message) }, 100)
        }
      })
  }

  const updateCartTotal = (type = 'ADD') => {
    let quantity = 1;
    if (type === 'ADD') {
      quantity = count.quantity + 1;
    } else {
      quantity = count.quantity - 1;
    }
    setCount({type, quantity});
  };

  const updateCartStates = () => {
    if (count.type) {
      let amount = basePrice + optionsAmount;
      if (count.type == 'ADD') {
        setTotalPrice(totalPrice + amount);
      } else {
        setTotalPrice(totalPrice - amount);
      }
    }
  };

  useEffect(() => {
    updateCartStates();
  }, [count]);

 
  return (
    <>
      <Loader
        visibility={loader}
        message="Adding to cart..."
        hasImage={false}
        loadingIndicator
      />
      <View style={[styles.container, styles.cartBorder]}>
        {productDetails.maxQtyIsset == 1 && (
          <Text style={{ color: '#FFA700', fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD }}>{`Max quantity per checkout: ${productDetails.maxQty}`}</Text>
        )}
        <View style={styles.foodItemTotalWrapper}>
          <View style={styles.countWrapper}>
            <TouchableOpacity
              disabled={count.quantity < 2}
              style={[styles.countButtons, {backgroundColor: count.quantity < 2 ? COLOR.LIGHT : COLOR.MEDIUM}]}
              onPress={() => updateCartTotal('REMOVE')}>
              <MIcon name="remove" color={COLOR.BLACK} size={25} />
            </TouchableOpacity>
            <Text style={styles.countText}>{count.quantity}</Text>
            <TouchableOpacity
              disabled={disableAdd}
              style={[styles.countButtons, {backgroundColor: COLOR.ORANGE, opacity: disableAdd ? 0.5 : 1}]}
              onPress={() => updateCartTotal()}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Subtotal: {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={loading || postLoading || patchLoading || deleteLoading || hasCartLoading || disabledMaxQty}
          style={[styles.cartButton, {backgroundColor: disabledMaxQty || loading || postLoading || patchLoading || deleteLoading || hasCartLoading ? COLOR.LIGHT : COLOR.YELLOW}]}
          onPress={() => onRestaurantNavigate()}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // height: scale(130),
    alignItems: 'center',
    backgroundColor: COLOR.WHITE,
    paddingVertical: verticalScale(15),
  },
  cartBorder: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
  },
  cartButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: COLOR.YELLOW,
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  foodItemTotalWrapper: {
    display: 'flex',
    marginBottom: 6,
    height: scale(50),
    flexDirection: 'row',
    alignItems: 'center',
    width: getDeviceWidth - 28,
    justifyContent: 'space-between',
  },
  total: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  countWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countButtons: {
    height: 32,
    width: 32,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: COLOR.BLACK,
    marginHorizontal: 9,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});

// export default React.memo(FoodCart);
