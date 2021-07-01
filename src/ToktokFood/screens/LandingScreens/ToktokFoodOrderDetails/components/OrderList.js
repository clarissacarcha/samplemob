import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

// Data
import {foodData} from 'toktokfood/helper/strings';

const OrderList = () => {
  const listData = foodData.splice(0, 2);
  //   console.log(listData)
  const renderItem = ({item}) => (
    <View style={styles.listContainer}>
      <Image style={styles.listImg} source={item.image} resizeMode="contain" />

      <View style={styles.list}>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.seeAll}>{item.price}</Text>
        </View>
        <View>
          <Text style={styles.notes}>{item.qty}x</Text>
          <Text style={styles.notes}>Size: Venti</Text>
          <Text style={styles.notes}>Add on: Extra Cream</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.note}>My Order</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>

      <FlatList data={listData} renderItem={renderItem} scrollEnabled={false} />
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
  },
  note: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  notes: {
    fontWeight: '300',
    fontSize: FONT_SIZE.S,
    marginTop: verticalScale(5),
  },
  seeAll: {
    color: COLORS.ORANGE,
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
    marginTop: verticalScale(8),
  },
});
