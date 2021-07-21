import React from 'react';
import {View, FlatList, Text, TouchableWithoutFeedback, Image, StyleSheet} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Fonts & Colors
import {COLOR, FONT} from 'res/variables';

// Strings
import {transactions} from 'toktokfood/helper/strings';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';

// Utils
import {verticalScale, scale} from 'toktokfood/helper/scale';

const ToktokFoodOrderTransactions = () => {
  const getSubMessageStatus = (item) =>
    `${item.statusMessage} ${item.statusCode === 's' || item.statusCode === 'c' ? 'at ' + item.statusTime : ''}`;

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback key={item.orderId}>
        <View style={styles.itemContainer}>
          <View style={styles.imgWrapper}>
            <Image resizeMode="contain" source={item.image} style={styles.img} />
          </View>
          <View style={styles.restaurantInfo}>
            <View style={styles.infoWrapper}>
              <Text numberOfLines={1} style={styles.restaurantDetails}>
                {`${item.shop} • ${item.shopAddress}`}
              </Text>
              <Text numberOfLines={1} style={styles.destinationDetails}>
                {item.quantity + ' items • ' + item.destinationAddress}
              </Text>
              <View>
                <Text numberOfLines={1} style={styles.statusMessage}>
                  {getSubMessageStatus(item)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground>
          <HeaderTitle />
        </HeaderImageBackground>
        <View style={styles.filterWrapper}></View>
        <View style={styles.listContainer}>
          <FlatList data={transactions} renderItem={renderItem} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  itemContainer: {
    width: scale(350),
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: verticalScale(8),
  },
  imgWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    height: 75,
    width: 78,
    borderRadius: 12,
  },
  restaurantInfo: {
    paddingEnd: 8,
    paddingStart: 10,
    color: COLOR.BLACK,
  },
  infoWrapper: {
    paddingEnd: 10,
    width: scale(250),
  },
  restaurantDetails: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
  },
  destinationDetails: {
    marginVertical: 3,
    color: COLOR.DARK,
    fontFamily: FONT.REGULAR,
  },
  statusWrapper: {},
  statusMessage: {
    color: COLOR.DARK,
    fontFamily: FONT.BOLD,
  },
  filterWrapper: {
    height: 49,
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
  },
});

export default ToktokFoodOrderTransactions;
