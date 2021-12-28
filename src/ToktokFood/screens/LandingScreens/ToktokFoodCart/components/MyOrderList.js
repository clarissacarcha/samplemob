import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import {Image, View, Text, TouchableHighlight, TouchableOpacity, FlatList, Dimensions, Animated, Alert} from 'react-native';
import _ from 'lodash';
import styles from '../styles';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { delete_ic } from 'toktokfood/assets/images';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';
import { VerifyContext } from '../components';
import { arrangeAddons } from '../functions';

import {DELETE_TEMPORARY_CART_ITEM} from 'toktokfood/graphql/toktokfood';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import Loader from 'toktokfood/components/Loader';
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

const MyOrderList = () => {
  const route = useRoute();
  // const { cart } = route.params;
  const navigation = useNavigation();
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood, _.isEqual);
  const {totalAmount, setTotalAmount, temporaryCart, setTemporaryCart} = useContext(VerifyContext);
  
  const swipeListViewRef = useRef(null)

  const [deleteTemporaryCartItem, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_TEMPORARY_CART_ITEM, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onError: (err) => {
      // console.log(err)
    },
    onCompleted: ({deleteTemporaryCartItem}) => {
      // console.log(postTemporaryCart)
    },
  });

  const displayAddOns = (addons) => {
    return Object.entries(addons).map((item) => {
      if(item.length > 0){
        let addonName = [], optionName = item[0];
        item[1].map((val) => {
          addonName = addonName.concat(val.addon_name)
        })
        let lastString = optionName.substring(optionName.length - 1)
        optionName = lastString == 's' ? addonName.length > 1 ? optionName : optionName.slice(0, -1) : optionName
        return <Text style={styles.orderText}>{`${optionName}: ${addonName.join(', ')}`}</Text>;
      }
    });
  };

  const onPressEdit = async(Id, parentProductId, selectedAddons, selectedItemId, selectedPrice, selectedQty, selectedNotes) => {
    navigation.navigate('ToktokFoodItemDetails', {
      Id,
      parentProductId,
      selectedAddons,
      selectedItemId,
      selectedPrice,
      selectedQty,
      selectedNotes,
      action: 'edit',
    });
  };


  const renderFoodItem = ({ item }) => {
    const {
      productid,
      id,
      parentProductId,
      quantity,
      totalAmount,
      productLogo,
      productName,
      addonsDetails,
      notes,
      parentProductName
    } = item;
    const addons = arrangeAddons(addonsDetails);
   
    return (
      <View style={styles.orderItemContainer}>
        { productLogo && (
          <Image style={styles.foodItemImage} source={{uri: productLogo}} />
        )}
        <View style={styles.orderInfoWrapper}>
          <Text style={(styles.orderText, {fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L})}>
            {parentProductId ? parentProductName : productName}
          </Text>
          <Text style={[styles.orderText]}>{`x${quantity}`}</Text>
          {parentProductId && <Text style={styles.orderText}>{`Variant: ${productName}`}</Text>}
          { addonsDetails.length > 0 && displayAddOns(addons)}
          {!!notes && <Text style={styles.orderText}>{`Notes: ${notes}`}</Text>}
        </View>
        <View style={styles.priceWrapper}>
          <Text
            onPress={() => {onPressEdit(productid, parentProductId, addons, id, totalAmount, quantity, notes)}}
            style={styles.actionText}
          >
            Edit
          </Text>
          <Text style={styles.foodPrice}>PHP {totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(data.item)}
        >
          <Image source={delete_ic} style={{ width: 20, height: 20 }} resizeMode='contain' />
        </TouchableOpacity>
      </View>
    )
  }

  const closeRow = () => {
    swipeListViewRef.current.closeAllOpenRows()
  };

  const deleteRow = useCallback(async(item) => {
    const { id, shopid, totalAmount } = item;
    deleteTemporaryCartItem({
      variables: {
        input: {
          deleteid: id
        }
      }
    }).then(({ data }) =>{
      let { status, message } = data.deleteTemporaryCartItem
      if(status == 200){
        const amount = temporaryCart.totalAmount - totalAmount;
        const index = temporaryCart.items.findIndex(val => val.id == item.id);
        temporaryCart.items.splice(index, 1);
        setTemporaryCart({
          totalAmount: amount,
          items: [...temporaryCart.items]
        })
        const isLastItem = temporaryCart.items.length == 0;
        if(isLastItem){ return navigation.goBack() }
      } else {
        setTimeout(() => {
          Alert.alert('', message)
        }, 100)
      }
    })
    closeRow();
  }, [temporaryCart]);

  return (
    <>
      <Loader visibility={deleteLoading} message="Removing from Cart" hasImage={false} loadingIndicator />
      <View style={styles.sectionContainer}>
        <View style={[styles.myOrderWrapper]}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {/* Add Items */}
          <Text onPress={() => navigation.goBack()} style={styles.actionText}>
            Add Items
          </Text>
        </View>
        <View>
          {temporaryCart.items.length == 0 ? (
            <LoadingIndicator isLoading={true} size="small" style={{paddingVertical: 20}} />
          ) : (
            <SwipeListView
              useFlatList
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
          )}
        </View>
      </View>
    </>
  );
};

export default MyOrderList;