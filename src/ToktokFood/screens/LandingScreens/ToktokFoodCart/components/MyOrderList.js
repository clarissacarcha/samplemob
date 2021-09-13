import React, {useEffect, useState} from 'react';
import {Image, View, Text, TouchableHighlight, TouchableOpacity, FlatList, Dimensions, Animated} from 'react-native';
import _ from 'lodash';
import styles from '../styles';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import { getTemporaryCart, saveAddOns } from 'toktokfood/helper/TemporaryCart';
import { SwipeListView } from 'react-native-swipe-list-view';
import { delete_ic } from 'toktokfood/assets/images';

const OrderList = () => {
  const route = useRoute();
  // const { cart } = route.params;
  const navigation = useNavigation();
  const {location, customerInfo, shopLocation} = useSelector((state) => state.toktokFood, _.isEqual);
  const [tempCart, setTempCart] = useState([])

  useEffect(() => {
    async function handleGetTemporaryCart() {
      let { cart, totalAmount } = await getTemporaryCart()
      setTempCart(cart)
    }
    handleGetTemporaryCart()
  }, [])

  const displayAddOns = (addons) => {
    return Object.entries(addons).map((item) => {
      if(item.length > 0){
        let addonName = [], optionName = item[0];
        item[1].map((val) => {
          addonName = addonName.concat(val.addon_name)
        })
        let lastString = optionName.substring(optionName.length - 1)
        optionName = lastString == 's' ? addonName.length > 1 ? optionName : optionName.slice(0, -1) : optionName
        console.log(optionName)
        return <Text style={styles.orderText}>{`${optionName}: ${addonName.join(', ')}`}</Text>;
      }
    });
  };

  const onPressEdit = async(Id, selectedAddons, selectedItemId, selectedPrice, selectedQty) => {
    navigation.navigate('ToktokFoodItemDetails', { Id, selectedAddons, selectedItemId, selectedPrice, selectedQty })
  };

  const renderFoodItem = ({ item }) => {
    const {quantity, addons, notes, srp_totalamount, productImage, productName, product_id, itemId} = item;
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      buttonWidth: 500,
      // onPress: () => { this.deleteNote(rowData) }
    }];
    return (
      <View style={styles.orderItemContainer}>
        <Image style={styles.foodItemImage} source={{uri: productImage}} />
        <View style={styles.orderInfoWrapper}>
          <Text style={(styles.orderText, {fontWeight: '500'})}>{productName}</Text>
          <Text style={[styles.orderText]}>{`x${quantity}`}</Text>
          {/* {displayAddOns(addons)} */}
          {!!notes && <Text style={styles.orderText}>{`Notes: ${notes}`}</Text>}
        </View>
        <View style={styles.priceWrapper}>
          <Text
            onPress={() => onPressEdit(product_id, addons, itemId, srp_totalamount, quantity)}
            style={styles.actionText}
          >
            Edit
          </Text>
          <Text style={styles.foodPrice}>PHP {srp_totalamount.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Image source={delete_ic} style={{ width: 20, height: 20 }} resizeMode='contain' />
      </TouchableOpacity>
    </View>
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...tempCart[0].items];
    const prevIndex = tempCart[0].items.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setTempCart(newData);
  };

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={[styles.myOrderWrapper]}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          {/* Add Items */}
          <Text style={styles.actionText}>Add Items</Text>
        </View>
        <View>
          <SwipeListView
            useFlatList
            disableRightSwipe
            data={tempCart[0]?.items}
            renderItem={renderFoodItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-80}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => ( <View style={{ borderTopWidth: 1, borderTopColor: '#E6E6E6' }} /> )}
          />
        </View>
      </View>
    </>
  );
};

export default MyOrderList = React.memo(OrderList);