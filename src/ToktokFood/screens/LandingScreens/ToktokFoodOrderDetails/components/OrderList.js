import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

// Fonts/Colors/Images
// import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';
import {no_image} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

// Data
// import {foodData} from 'toktokfood/helper/strings';

const DisplayAddons = ({addOns}) => {
  let addOnsList = addOns.map(item => item.addon_name).join(', ');
  let label = addOns.length > 1 ? 'Add ons:' : 'Add on:';

  return <Text style={styles.notes}>{`${label} ${addOnsList}`}</Text>;
};

const OrderList = ({orderDetails}) => {
  const [validImg, setValidImg] = useState(true);

  const Item = ({item}) => {
    let {parentProductId, itemname, parentProductName} = item.productDetails;
    let parseAddOns = item.addons.length > 0 ? JSON.parse(item.addons) : item.addons;
    let productName = parentProductId ? parentProductName : itemname;
    return (
      <View style={styles.listContainer}>
        {item.productDetails.filename && (
          <Image
            style={styles.listImg}
            source={validImg ? {uri: item.productDetails.filename} : no_image}
            onError={() => setValidImg(false)}
          />
        )}
        <View style={styles.list}>
          <View style={styles.listInfo}>
            <Text numberOfLines={1} style={styles.listName}>
              {productName}
            </Text>
            <Text style={styles.seeAll}>{`PHP ${item.totalAmountWithAddons.toFixed(2)}`}</Text>
          </View>
          <View>
            <Text style={styles.notes}>x{item.quantity}</Text>
            {parentProductId && <Text style={styles.notes}>{`Variant: ${itemname}`}</Text>}
            {!!parseAddOns && parseAddOns.length > 0 && <DisplayAddons addOns={parseAddOns} />}
            {!!item.notes && <Text style={styles.notes}>{`Note: ${JSON.parse(item.notes)}`}</Text>}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.note}>My Order</Text>
        {/* <Text style={styles.seeAll}>See All</Text> */}
      </View>

      {orderDetails.length > 0 && orderDetails.map(item => <Item item={item} />)}

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
});
