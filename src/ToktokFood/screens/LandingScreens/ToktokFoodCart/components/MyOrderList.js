/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useContext, useCallback, useState, useMemo, useEffect} from 'react';
import {Image, View, Text, TouchableOpacity, Alert, ImageBackground} from 'react-native';
// import _ from 'lodash';
import styles from '../styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import {delete_ic} from 'toktokfood/assets/images';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import {VerifyContext} from '../components';
import {arrangeAddons} from '../functions';

import Loader from 'toktokfood/components/Loader';
import {DELETE_TEMPORARY_CART_ITEM, GET_ALL_TEMPORARY_CART} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {FONT, FONT_SIZE} from 'res/variables';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {reseller_badge, food_placeholder} from 'toktokfood/assets/images';
import ProgressiveImage from 'toktokfood/components/ProgressiveImage';

const MyOrderList = props => {
  const {shopDetails, hasUnavailableItem} = props;
  // const route = useRoute();
  const dispatch = useDispatch();
  // const { cart } = route.params;
  const navigation = useNavigation();
  // const {location, customerInfo, shopLocation} = useSelector(state => state.toktokFood, _.isEqual);
  const {customerInfo} = useSelector(state => state.toktokFood);
  const {temporaryCart, setTemporaryCart} = useContext(VerifyContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const swipeListViewRef = useRef(null);

  const [deleteTemporaryCartItem, {loading: deleteLoading}] = useMutation(DELETE_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
  });

  const [getAllTemporaryCart] = useLazyQuery(GET_ALL_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAllTemporaryCart}) => {
      let {items, srpTotalAmount, totalAmount, totalAmountWithAddons, addonsTotalAmount} = getAllTemporaryCart;
      setTemporaryCart({
        cartItemsLength: items.length,
        srpTotalAmount,
        totalAmount,
        totalAmountWithAddons,
        addonsTotalAmount,
        items: items,
      });
    },
  });

  const displayAddOns = addons => {
    return Object.entries(addons).map(item => {
      if (item.length > 0) {
        let addonName = [],
          optionName = item[0];
        item[1].map(val => {
          addonName = addonName.concat(val.addon_name);
        });
        let lastString = optionName.substring(optionName.length - 1);
        // optionName = lastString == 's' ? (addonName.length > 1 ? optionName : optionName.slice(0, -1)) : optionName;
        return <Text style={styles.orderText}>{`${optionName}: ${addonName.join(', ')}`}</Text>;
      }
    });
  };

  useEffect(() => {
    getAllTemporaryCart({
      variables: {
        input: {
          userId: customerInfo.userId,
        },
      },
    });
  }, [hasUnavailableItem]);

  const onPressEdit = async (
    Id,
    parentProductId,
    selectedAddons,
    selectedItemId,
    selectedPrice,
    selectedQty,
    selectedNotes,
    hasOrderInstruction,
  ) => {
    navigation.navigate('ToktokFoodItemDetails', {
      Id,
      parentProductId,
      selectedAddons,
      selectedItemId,
      selectedPrice,
      selectedQty,
      selectedNotes,
      action: 'edit',
      shopDetails,
      hasOrderInstruction,
    });
  };

  const roundedPercentage = (number, precision) => {
    const rounded = Math.pow(10, precision);
    return (Math.round(number * rounded) / rounded).toFixed(precision);
  };

  const ResellerDiscountBadge = useMemo(
    () =>
      ({resellerDiscount, basePrice, totalAmount}) => {
        const percentage = (100 * (basePrice - resellerDiscount)) / basePrice;
        const finalPercentage = roundedPercentage(percentage, 1);
        // const {discRatetype, referralDiscount} = resellerDiscount;
        // const discountText = discRatetype === 'p' ? `-${referralDiscount * 100}%` : referralDiscount;
        return (
          <React.Fragment>
            <ImageBackground resizeMode="contain" source={reseller_badge} style={styles.resellerBadge}>
              <Text style={styles.resellerText}>Reseller -{finalPercentage}%</Text>
            </ImageBackground>
            <Text style={styles.basePrice}>PHP {totalAmount.toFixed(2)}</Text>
            <Text style={styles.foodPrice}>PHP {resellerDiscount.toFixed(2)}</Text>
          </React.Fragment>
        );
      },
    [temporaryCart?.items?.resellerDiscount],
  );

  const FoodItem = ({item}) => {
    const {
      productid,
      id,
      basePrice,
      parentProductId,
      quantity,
      totalAmount,
      addonsTotalAmount,
      productLogo,
      productName,
      addonsDetails,
      notes,
      parentProductName,
      resellerDiscount,
      orderInstructions,
      isDisabled,
    } = item;
    const addons = arrangeAddons(addonsDetails);
    const totalAmountWithAddons = parseFloat(addonsTotalAmount) + parseFloat(basePrice);

    const removeSpecialCharacters = text => text.replace(/[^a-z0-9 ]/gi, '');

    return (
      <SwipeRow
        disableRightSwipe
        rightOpenValue={-80}
        previewOpenValue={-40}
        previewOpenDelay={1000}
        closeOnRowOpen={true}>
        <View style={styles.rowBack}>
          <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => deleteRow(item)}>
            <Image source={delete_ic} style={{width: 20, height: 20}} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={[styles.orderItemContainer, {paddingBottom: isDisabled ? verticalScale(25) : verticalScale(18)}]}>
          <View style={[styles.progressiveImageContainer, {opacity: isDisabled ? 0.5 : 1}]}>
            <ProgressiveImage style={styles.foodItemImage} source={productLogo} placeholder={food_placeholder} />
          </View>
          {/* {productLogo && <Image style={styles.foodItemImage} source={{uri: productLogo}} />} */}
          <View style={[styles.orderInfoWrapper, {opacity: isDisabled ? 0.5 : 1}]}>
            <Text style={(styles.orderText, {fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L})}>
              {parentProductId ? parentProductName : productName}
            </Text>
            <Text style={[styles.orderText]}>{`x${quantity}`}</Text>
            {parentProductId && <Text style={styles.orderText}>{`Variation: ${productName}`}</Text>}
            {addonsDetails.length > 0 && displayAddOns(addons)}
            {!!notes && <Text style={styles.orderText}>{`Note: ${removeSpecialCharacters(notes)}`}</Text>}
          </View>
          <View style={[styles.priceWrapper, {opacity: isDisabled ? 0.5 : 1}]}>
            <Text
              onPress={() => {
                onPressEdit(
                  productid,
                  parentProductId,
                  addons,
                  id,
                  totalAmountWithAddons,
                  quantity,
                  notes,
                  orderInstructions,
                );
              }}
              style={styles.actionText}>
              {!isDisabled ? 'Edit' : ''}
            </Text>
            {resellerDiscount > 0 ? (
              <ResellerDiscountBadge
                resellerDiscount={resellerDiscount}
                basePrice={basePrice}
                totalAmount={totalAmountWithAddons}
              />
            ) : (
              <Text style={[styles.foodPrice, {color: isDisabled ? '#000' : '#FF6200'}]}>
                PHP {totalAmountWithAddons.toFixed(2)}
              </Text>
            )}
          </View>
          <View style={{borderTopWidth: 1, borderTopColor: '#E6E6E6'}} />
          {isDisabled && (
            <View style={styles.cartItemWrapper}>
              <Text style={styles.unavailableText}>Currently Unavailable</Text>
            </View>
          )}
        </View>
      </SwipeRow>
    );
  };

  // const renderHiddenItem = (data, rowMap) => {
  //   return (
  //     <View style={styles.rowBack}>
  //       <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => deleteRow(data.item)}>
  //         <Image source={delete_ic} style={{width: 20, height: 20}} resizeMode="contain" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const closeRow = () => {
    swipeListViewRef.current.closeAllOpenRows();
  };

  const deleteRow = useCallback(
    async item => {
      const {id, shopid, addonsTotalAmount, totalAmount} = item;
      const itemTotalAmount = parseFloat(addonsTotalAmount) + parseFloat(totalAmount);

      deleteTemporaryCartItem({
        variables: {
          input: {
            deleteid: id,
          },
        },
      }).then(({data}) => {
        let {status, message} = data.deleteTemporaryCartItem;
        if (status == 200) {
          const totalAmountWithAddons = parseFloat(temporaryCart.totalAmountWithAddons) - parseFloat(itemTotalAmount);
          const amount = parseFloat(temporaryCart.totalAmount) - parseFloat(totalAmount);
          const addonsAmount = parseFloat(temporaryCart.addonsTotalAmount) - parseFloat(addonsTotalAmount);
          const index = temporaryCart.items.findIndex(val => val.id == item.id);
          temporaryCart.items.splice(index, 1);

          getAllTemporaryCart({
            variables: {
              input: {
                userId: customerInfo.userId,
              },
            },
          });

          // setTemporaryCart({
          //   totalAmountWithAddons,
          //   totalAmount: amount,
          //   addonsTotalAmount: addonsAmount,
          //   items: [...temporaryCart.items],
          //   // srpTotalAmount,
          // });
          const isLastItem = temporaryCart.items.length == 0;
          if (isLastItem) {
            dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: []});
            return navigation.goBack();
          }
        } else {
          setTimeout(() => {
            Alert.alert('', message);
          }, 100);
        }
      });
      closeRow();
    },
    [temporaryCart],
  );

  const data = temporaryCart.items;
  let dataSource = [];
  let remaining = [];
  if (data.length > 5) {
    dataSource = data.slice(0, 5);
    remaining = data.slice(4, -1);
  } else {
    dataSource = data;
  }

  return (
    <>
      <Loader visibility={deleteLoading} message="Removing from Cart" hasImage={false} loadingIndicator />
      <View style={styles.sectionContainer}>
        <View style={[styles.myOrderWrapper]}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {/* Add Items */}
          <Text
            onPress={() =>
              navigation.navigate('ToktokFoodRestaurantOverview', {item: {id: `${temporaryCart.items[0]?.shopid}`}})
            }
            style={{...styles.actionText, flex: 0}}>
            Add Items
          </Text>
        </View>
        <View>
          {temporaryCart?.items.length === 0 ? (
            <LoadingIndicator isLoading={true} size="small" style={{paddingVertical: 20}} />
          ) : isCollapsed ? (
            data.map(item => <FoodItem item={item} />)
          ) : (
            dataSource.map(item => <FoodItem item={item} />)
          )}
          {data.length > 5 && (
            <TouchableOpacity
              onPress={() => setIsCollapsed(!isCollapsed)}
              activeOpacity={0.9}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: moderateScale(10),
                paddingBottom: moderateScale(20),
                marginBottom: moderateScale(10),
              }}>
              <Text style={{marginRight: moderateScale(12), color: '#FFA700'}}>
                {isCollapsed ? 'Hide' : 'See More'}
              </Text>
              <FA5Icon name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={12} color={'#FFA700'} />
            </TouchableOpacity>
          )}
          {/* {temporaryCart.items.length == 0 ? (
            <LoadingIndicator isLoading={true} size="small" style={{paddingVertical: 20}} />
          ) : (
            <SwipeListView
              scrollEnabled={false}
              nestedscrollEnable={true}
              // horizontal
              disableRightSwipe
              data={temporaryCart?.items}
              renderItem={renderFoodItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-80}
              previewOpenValue={-40}
              previewOpenDelay={1000}
              closeOnRowOpen={true}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{borderTopWidth: 1, borderTopColor: '#E6E6E6'}} />}
              ref={swipeListViewRef}
            />
          )} */}
        </View>
      </View>
    </>
  );
};

export default MyOrderList;
