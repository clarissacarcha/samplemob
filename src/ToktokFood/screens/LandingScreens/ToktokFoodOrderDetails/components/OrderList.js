import React from 'react';
import {addons, FlatList, Image, StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

// Data
import {foodData} from 'toktokfood/helper/strings';


const DisplayAddons = ({ addOns }) => {
  let addOnsList = addOns.map(item => item.addon_name).join(', ');
  let label = addOns.length > 1 ? 'Add ons:' : 'Add on:'
 
  return (
    <Text style={styles.notes} >{`${label} ${addOnsList}`}</Text>
  )
}

const OrderList = ({ orderDetails }) => {

  const renderItem = ({item}) => {
    let parseAddOns = item.addons.length > 0 ? JSON.parse(item.addons) : item.addons;
    return(
      <View style={styles.listContainer}>
        <Image style={styles.listImg} source={{ uri: item.productDetails.filename }} resizeMode="cover" />
        <View style={styles.list}>
          <View style={styles.listInfo}>
            <Text style={styles.listName}>{item.productDetails.itemname}</Text>
            <Text style={styles.seeAll}>{`PHP ${item.amount.toFixed(2)}`}</Text>
          </View>
          <View>
            <Text style={styles.notes}>{item.quantity}x</Text>
            {/* { parseAddOns && parseAddOns.length > 0 && <DisplayAddons addOns={parseAddOns} /> } */}
            { !!item.notes && <Text style={styles.notes}>{`Notes: ${JSON.parse(item.notes)}`}</Text> }
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.note}>My Order</Text>
        {/* <Text style={styles.seeAll}>See All</Text> */}
      </View>

      <FlatList data={orderDetails} renderItem={renderItem} scrollEnabled={false} />
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
    width: 90,
    height: 90,
  },
  listInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: verticalScale(3),
  },
  listName: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
    flexShrink: 1
  },
  note: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  notes: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
    marginTop: verticalScale(5),
    flexShrink: 1
  },
  seeAll: {
    color: COLORS.ORANGE,
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
  },
});
