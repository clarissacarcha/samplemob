/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  POST_TEMPORARY_CART,
  PATCH_TEMPORARY_CART_ITEM,
  DELETE_TEMPORARY_CART_ITEM,
  GET_TEMPORARY_CART,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_HAS_TEMPORARY_CART,
} from 'toktokfood/graphql/toktokfood';
import {useMutation, useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {useDispatch, useSelector} from 'react-redux';
import Loader from 'toktokfood/components/Loader';
import DialogMessage from 'toktokfood/components/DialogMessage';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';
export const FoodCart = ({loading, action}) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routes = useRoute();
  const [loader, setLoader] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);
  const [disabledMaxQty, setDisableMaxQty] = useState(false);
  const {Id, selectedAddons, selectedItemId, selectedPrice, selectedQty, selectedNotes} = routes.params;
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
    selectedVariants,
    basePrice,
  } = useContext(VerifyContext);
  const {customerInfo} = useSelector(state => state.toktokFood);
  const [showDialogMessage, setShowDialogMessage] = useState({show: false, items: []});
  const [tempData, setTempData] = useState({});
  const required = Object.keys(requiredOptions).filter(val => {
    return selected[val] == undefined;
  });

  const [postTemporaryCart, {loading: postLoading, error: postError}] = useMutation(POST_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => {
      setLoader(false);
      setTimeout(() => {
        onErrorAlert({alert, error});
      }, 100);
    },
    onCompleted: ({postTemporaryCart}) => {
      // console.log(postTemporaryCart)
    },
  });

  const [patchTemporaryCartItem, {loading: patchLoading, error: patchError}] = useMutation(PATCH_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: error => {
      setLoader(false);
      setTimeout(() => {
        onErrorAlert({alert, error});
      }, 100);
    },
    onCompleted: ({patchTemporaryCartItem}) => {
      // console.log(patchTemporaryCartItem)
    },
  });

  const [deleteTemporaryCartItem, {loading: deleteItemLoading, error: deleteItemError}] = useMutation(
    DELETE_TEMPORARY_CART_ITEM,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      onError: () => {
        setLoader(false);
      },
      onCompleted: ({deleteTemporaryCartItem}) => console.log(patchTemporaryCartItem),
    },
  );

  const [deleteShopTemporaryCart, {loading: deleteLoading, error: deleteError}] = useMutation(
    DELETE_SHOP_TEMPORARY_CART,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      onError: () => {
        setLoader(false);
        setTimeout(() => {
          Alert.alert('', 'Something went wrong.');
        }, 100);
      },
      onCompleted: ({deleteShopTemporaryCart}) => {
        // console.log(patchTemporaryCartItem)
      },
    },
  );

  const [checkHasTemporaryCart, {data: hasTemporaryCart, loading: hasCartLoading, error: hasCartError}] = useLazyQuery(
    CHECK_HAS_TEMPORARY_CART,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: err => {
        setLoader(false);
        setTimeout(() => {
          onErrorAlert({alert, err});
        }, 100);
      },
    },
  );

  useEffect(() => {
    if (customerInfo.userId != undefined) {
      checkHasTemporaryCart({variables: {input: {userId: customerInfo.userId}}});
    }
  }, [customerInfo]);

  useEffect(() => {
    if (productDetails && Object.keys(productDetails).length > 0) {
      let data = productDetails.variants.length > 0 ? selectedVariants : productDetails;
      setTempData(data);
      if (data?.maxQtyIsset == 1) {
        if (temporaryCart.items.length > 0) {
          const hasItem = temporaryCart.items.filter(item => {
            return item.productid == data.Id;
          });
          if (hasItem.length > 0) {
            let currentQty = 0;
            hasItem.map(item => {
              currentQty += item.quantity;
            });
            let isEditQtty = selectedItemId == undefined ? count.quantity + currentQty : count.quantity;
            let exceededQty = currentQty == data.maxQty ? currentQty : isEditQtty;
            let disableMaxQtyCondition =
              selectedItemId == undefined
                ? exceededQty > data.maxQty
                : selectedQty + (data.maxQty - currentQty) == count.quantity;
            let disableAddCondition =
              selectedItemId == undefined
                ? exceededQty > data.maxQty - 1
                : selectedQty + (data.maxQty - currentQty) == count.quantity;
            setDisableMaxQty(
              (currentQty == data.maxQty && selectedItemId == undefined) ||
                (selectedItemId == undefined && disableMaxQtyCondition),
            );
            setDisableAdd(disableAddCondition);
            return;
          }
        }
        setDisableMaxQty(count.quantity > data.maxQty);
        setDisableAdd(count.quantity > data.maxQty - 1);
      } else {
        setDisableAdd(data?.stocks == count.quantity);
      }
    }
  }, [productDetails, temporaryCart, count, selectedVariants]);

  const isEqual = (obj1, obj2) => {
    if (obj2.length > 0 && obj1.length > 0) {
      let filter = [];
      for (let x = 0; x < obj1.length; x++) {
        filter.push(obj2[x] == obj1[x].id);
      }

      return !filter.includes(false) && obj1.length == obj2.length;
    } else {
      return obj2.length == obj1.length;
    }
  };

  const onRestaurantNavigate = async () => {
    let required = await Object.keys(requiredOptions).filter(val => {
      return selected[val] == undefined;
    });
    if (required.length > 0) {
      Alert.alert(`${required[0]} is required.`);
    } else {
      processAddToCart();
    }
  };

  const extractAddons = () => {
    let addons = [];
    if (Object.values(selected).length > 0) {
      Object.values(selected).map(item => {
        item.map(val => {
          addons.push(val.addon_id);
        });
      });
    }
    return addons.sort();
  };

  //PROCESS ADD TO CART
  const processAddToCart = async () => {
    let items = {
      userid: customerInfo.userId,
      shopid: +productDetails.sysShop,
      branchid: 0,
      productid: productDetails.variants.length > 0 ? selectedVariants?.Id : productDetails.Id,
      quantity: count.quantity,
      addons: extractAddons(),
      notes: notes,
    };

    let filterItemByProductId = await temporaryCart.items.filter(item => {
      // console.log(item.productid)
      return item.productid == items.productid;
    });
    // return null
    let duplicateItem = await filterItemByProductId.filter(item => {
      let sortedData = item.addonsDetails.sort((a, b) => a.id - b.id);
      return isEqual(sortedData, items.addons);
    });

    let editedItem = await temporaryCart.items.filter(item => {
      return item.id == selectedItemId;
    });

    if (duplicateItem.length == 0) {
      if (selectedItemId) {
        setLoader(true);
        items.updateid = selectedItemId;
        return patchCartItem(items);
      }
      if (temporaryCart.items.length > 0) {
        setLoader(true);
        return addToCart(items);
      }
      if (hasTemporaryCart.checkHasTemporaryCart.shopid != 0) {
        setShowDialogMessage({
          show: true,
          items,
        });
      } else {
        setLoader(true);
        addToCart(items);
      }
    } else {
      let sameAsDuplicateItem = duplicateItem[0]?.id == selectedItemId;
      let editedId = sameAsDuplicateItem ? selectedItemId : duplicateItem[0].id;
      items.updateid = editedId;

      setLoader(true);
      if ((duplicateItem.length > 0 || items.quantity != duplicateItem[0].quantity) && !selectedItemId) {
        items.quantity += duplicateItem[0].quantity;
      }
      if (!sameAsDuplicateItem && selectedItemId != undefined) {
        items.quantity += duplicateItem[0].quantity;
        return deleteCartItem(selectedItemId, items, 'edit');
      }
      patchCartItem(items);
    }
  };

  const onPressProceed = () => {
    setShowDialogMessage(prev => ({...prev, show: false}));
    setLoader(true);
    deleteShopTemporaryCart({
      variables: {
        input: {
          userid: customerInfo.userId,
          shopid: hasTemporaryCart.checkHasTemporaryCart.shopid,
          branchid: 0,
        },
      },
    }).then(({data}) => {
      let {status, message} = data.deleteShopTemporaryCart;
      if (status == 200) {
        addToCart(showDialogMessage.items);
      } else {
        setLoader(false);
        setTimeout(() => {
          Alert.alert('', message);
        }, 100);
      }
    });
  };

  const deleteCartItem = (editedId, items, action) => {
    deleteTemporaryCartItem({variables: {input: {deleteid: editedId}}}).then(({data}) => {
      let {status, message} = data.deleteTemporaryCartItem;
      if (status == 200) {
        patchCartItem(items);
      } else {
        setLoader(false);
        setTimeout(() => {
          Alert.alert('', message);
        }, 100);
      }
    });
  };

  const patchCartItem = items => {
    patchTemporaryCartItem({variables: {input: items}}).then(({data}) => {
      let {status, message} = data.patchTemporaryCartItem;
      if (status == 200) {
        setTimeout(() => {
          setLoader(false);
          Toast.show('Cart Updated', Toast.SHORT);
          navigation.navigate('ToktokFoodRestaurantOverview', {item: {id: productDetails.sysShop}});
        }, 1000);
      } else {
        setLoader(false);
        setTimeout(() => {
          Alert.alert('', message);
        }, 100);
      }
    });
  };

  const addToCart = items => {
    postTemporaryCart({variables: {input: items}}).then(({data}) => {
      let {status, message} = data.postTemporaryCart;
      if (status == 200) {
        setTimeout(() => {
          setLoader(false);
          Toast.show('Added to cart', Toast.SHORT);
          navigation.navigate('ToktokFoodRestaurantOverview', {item: {id: productDetails.sysShop}});
        }, 1000);
      } else {
        setLoader(false);
        setTimeout(() => {
          Alert.alert('', message);
        }, 100);
      }
    });
  };

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

  const isEnabled = () =>
    required.length > 0 || disabledMaxQty || loading || postLoading || patchLoading || deleteLoading || hasCartLoading;

  return (
    <>
      <Loader
        visibility={loader}
        message={action === 'edit' ? 'Updating Cart' : 'Adding to Cart'}
        hasImage={false}
        loadingIndicator
      />
      <DialogMessage
        visibility={showDialogMessage.show}
        title={'OOPS!'}
        messages={
          'You have existing items from a different restaurant in your cart. If you proceed, items will be removed.'
        }
        type="warning"
        btn1Title="Cancel"
        btn2Title="Proceed"
        onCloseBtn1={() => {
          setShowDialogMessage(prev => ({...prev, show: false}));
        }}
        onCloseBtn2={() => {
          onPressProceed();
        }}
        hasTwoButtons
      />
      <View style={[styles.container, styles.cartBorder]}>
        {/* {tempData?.maxQtyIsset == 1 && (
          <Text
            style={{
              color: '#FFA700',
              fontSize: FONT_SIZE.M,
              fontFamily: FONT.BOLD,
            }}>{`Max quantity per checkout: ${tempData?.maxQty}`}</Text>
        )} */}
        <View style={styles.foodItemTotalWrapper}>
          <View style={styles.countWrapper}>
            <TouchableOpacity
              disabled={count.quantity < 2}
              style={[styles.countButtons, {backgroundColor: count.quantity < 2 ? COLOR.LIGHT : COLOR.MEDIUM}]}
              onPress={_.debounce(() => updateCartTotal('REMOVE'), 100, {leading: true, trailing: false})}>
              <MIcon name="remove" color={COLOR.BLACK} size={25} />
            </TouchableOpacity>
            <Text style={styles.countText}>{count.quantity}</Text>
            <TouchableOpacity
              disabled={
                productDetails?.contSellingIsset === 1 ? false : disableAdd || count.quantity >= tempData?.stocks
              }
              style={[
                styles.countButtons,
                {
                  backgroundColor: COLOR.ORANGE,
                  opacity:
                    productDetails?.contSellingIsset === 1
                      ? 1
                      : disableAdd || count.quantity >= tempData?.stocks
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={_.debounce(() => updateCartTotal(), 100, {leading: true, trailing: false})}>
              <MIcon name="add" color={COLOR.WHITE} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Total: PHP {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          disabled={productDetails?.contSellingIsset === 1 ? false : isEnabled()}
          style={[
            styles.cartButton,
            {
              backgroundColor:
                productDetails?.contSellingIsset === 1 ? COLOR.YELLOW : isEnabled() ? COLOR.LIGHT : COLOR.YELLOW,
            },
          ]}
          onPress={() => onRestaurantNavigate()}>
          <Text
            style={[
              styles.buttonText,
              {
                color: productDetails?.contSellingIsset === 1 ? COLOR.WHITE : isEnabled() ? COLOR.DARK : COLOR.WHITE,
              },
            ]}>
            {action === 'edit' ? 'Update' : 'Add to Cart'}
          </Text>
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
    color: COLOR.WHITE,
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
