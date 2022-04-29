/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
// Fonts/Colors/Images
// import {COLORS} from 'res/constants';
import {FONT, FONT_SIZE, COLOR, SIZE} from 'res/variables';
import {no_image, reseller_badge, food_placeholder} from 'toktokfood/assets/images';
// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
import ProgressiveImage from 'toktokfood/components/ProgressiveImage';
// Data
// import {foodData} from 'toktokfood/helper/strings';

const DisplayAddons = ({addOns, itemStatus}) => {
  let addOnsList = addOns.map(item => item.addon_name).join(', ');
  let label = addOns.length > 1 ? 'Add-ons:' : 'Add-on:';

  if (itemStatus === 0) {
    return <Text style={[styles.notes, {color: '#9E9E9E'}]}>{`${label} ${addOnsList}`}</Text>;
  } else {
    return <Text style={styles.notes}>{`${label} ${addOnsList}`}</Text>;
  }
};

const OrderList = ({orderDetails}) => {
  const [validImg, setValidImg] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const data = orderDetails;
  let dataSource = [];
  let remaining = [];
  if (data.length > 5) {
    dataSource = data.slice(0, 5);
    remaining = data.slice(4, -1);
  } else {
    dataSource = data;
  }

  const roundedPercentage = (number, precision) => {
    const rounded = Math.pow(10, precision);
    return (Math.round(number * rounded) / rounded).toFixed(precision);
  };

  const ResellerDiscountBadge = useMemo(
    () =>
      ({item}) => {
        const {amount, basePrice, srpAmount, totalAmountWithAddons, resellerDiscount, resellerRate} = item;
        const percentage = (100 * (Number(basePrice) - resellerDiscount)) / srpAmount;
        const finalPercentage = roundedPercentage(percentage, 1);
        const itemAmount = amount === 1 ? srpAmount : resellerDiscount;
        // const {discRatetype, referralDiscount} = resellerDiscount;
        // const discountText = discRatetype === 'p' ? `-${referralDiscount * 100}%` : referralDiscount;
        return (
          <View style={{alignItems: 'flex-end'}}>
            {amount !== 1 && (
              <ImageBackground resizeMode="contain" source={reseller_badge} style={styles.resellerBadge}>
                <Text style={styles.resellerText}>Reseller -{resellerRate}%</Text>
              </ImageBackground>
            )}

            <Text style={{...styles.seeAll, position: 'absolute', bottom: moderateScale(-20)}}>
              PHP {totalAmountWithAddons.toFixed(2)}
            </Text>
          </View>
        );
      },
    [data],
  );

  const FoodItemImage = ({item, itemStatus}) => {
    return (
      <View style={styles.foodItemImageWrapper}>
        <ProgressiveImage
          style={styles.foodItemImage}
          source={item.productDetails.filename}
          placeholder={food_placeholder}
        />
        {itemStatus === 0 && (
          <View style={{...styles.modifiedFlag, backgroundColor: '#ED3A19'}}>
            <Text style={{fontFamily: FONT.BOLD, color: '#FFFF'}}>Removed</Text>
          </View>
        )}
        {/* {itemStatus === 0 && (
          <View style={{...styles.modifiedFlag, backgroundColor: itemStatus === 0 ? '#ED3A19' : '#F5841F'}}>
            <Text style={{fontFamily: FONT.BOLD, color: '#FFFF'}}>{itemStatus === 0 ? 'Removed' : 'Edited'}</Text>
          </View>
        )} */}
      </View>
    );
  };

  const Item = useMemo(
    () =>
      ({item}) => {
        const {status} = item;
        let {parentProductId, itemname, parentProductName} = item.productDetails;
        let parseAddOns = item.addons.length > 0 ? JSON.parse(item.addons) : item.addons;
        let productName = parentProductId ? parentProductName : itemname;
        const {amount, srpAmount, resellerDiscount} = item;
        // console.log(item);
        return (
          <View style={styles.listContainer}>
            <View style={styles.progressiveImageContainer}>
              {item.productDetails.filename && <FoodItemImage item={item} itemStatus={status} />}
            </View>

            <View style={styles.list}>
              <View style={styles.listInfo}>
                <Text numberOfLines={1} style={[styles.listName, {color: status === 0 ? '#9E9E9E' : '#000000'}]}>
                  {productName}
                </Text>
                {resellerDiscount > 0 ? (
                  <ResellerDiscountBadge item={item} />
                ) : (
                  <Text
                    style={[
                      styles.seeAll,
                      {color: status === 0 ? '#9E9E9E' : '#FF6200'},
                    ]}>{`PHP ${item.totalAmountWithAddons.toFixed(2)}`}</Text>
                )}
              </View>
              <View>
                <Text style={[styles.notes, {color: status === 0 ? '#9E9E9E' : '#000000'}]}>x{item.quantity}</Text>
                {parentProductId && (
                  <Text
                    style={[
                      styles.notes,
                      {color: status === 0 ? '#9E9E9E' : '#000000'},
                    ]}>{`Variation: ${itemname}`}</Text>
                )}
                {!!parseAddOns && parseAddOns.length > 0 && <DisplayAddons addOns={parseAddOns} itemStatus={status} />}
                {!!item.notes && (
                  <Text style={[styles.notes, {color: status === 0 ? '#9E9E9E' : '#000000'}]}>{`Note: ${JSON.parse(
                    item.notes,
                  )}`}</Text>
                )}
              </View>
            </View>
          </View>
        );
      },
    [data, dataSource],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.note}>My Order</Text>
      </View>
      {isCollapsed ? data.map(item => <Item item={item} />) : dataSource.map(item => <Item item={item} />)}
      {data.length > 5 && (
        <TouchableOpacity
          onPress={() => setIsCollapsed(!isCollapsed)}
          activeOpacity={0.9}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: moderateScale(20),
          }}>
          <Text style={{marginRight: moderateScale(12), color: '#FFA700'}}>{isCollapsed ? 'Hide' : 'See More'}</Text>
          <FA5Icon name={isCollapsed ? 'chevron-up' : 'chevron-down'} size={12} color={'#FFA700'} />
        </TouchableOpacity>
      )}

      {/* <FlatList data={orderDetails} renderItem={renderItem} scrollEnabled={false} /> */}
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    flex: 1,
    paddingLeft: moderateScale(10),
  },
  listContainer: {
    flexDirection: 'row',
    marginVertical: verticalScale(5),
  },
  listImg: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: 5,
    resizeMode: 'cover',
  },
  listInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listName: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    flexShrink: 1,
    marginEnd: 5,
  },
  note: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    paddingBottom: moderateScale(10),
  },
  notes: {
    fontSize: FONT_SIZE.S,
    marginTop: verticalScale(5),
    flexShrink: 1,
  },
  seeAll: {
    color: '#FF6200',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
  },
  resellerBadge: {
    // alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: 25,
    // width: 90,
    // borderWidth: 1,
    // backgroundColor: TOKFOODCOLOR.YELLOWBG,
    // borderRadius: 5,
    // padding: 3,
  },
  resellerText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.XS,
    fontWeight: '700',
  },
  foodItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  progressiveImageContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    marginRight: moderateScale(10),
  },
  foodItemImageWrapper: {
    width: '100%',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  modifiedFlag: {
    width: '100%',
    height: 25,
    position: 'absolute',
    bottom: 0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
