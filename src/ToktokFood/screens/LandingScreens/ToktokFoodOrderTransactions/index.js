import React, {useState, useEffect} from 'react';
import {View, FlatList, Text, TouchableWithoutFeedback, Image, StyleSheet, Platform} from 'react-native';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

// Strings
import {transactions} from 'toktokfood/helper/strings';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';

// Utils
import {verticalScale, moderateScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(118),
  bgImage: Platform.OS === 'android' ? moderateScale(105 + getStatusbarHeight) : moderateScale(113),
};

const ToktokFoodOrderTransactions = () => {
  const [focusTab, setFocusTab] = useState(1);
  const [transactionsList, setTransactionsList] = useState(transactions);

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
              <View style={styles.activityWrapper}>
                <FA5Icon name="history" color={COLOR.DARK} size={14} style={styles.activityIcon} />
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

  const filterTransactions = () => {
    // Current transactions tab filter
    if (focusTab === 1) {
      setTransactionsList(transactions.filter((item) => item.statusCode === 'po' || item.statusCode === 'f'));
    }
    // Completed transactions tab filter
    else if (focusTab === 2) {
      setTransactionsList(transactions.filter((item) => item.statusCode === 's'));
    }
    // Cancelled transactions tab filter
    else if (focusTab === 3) {
      setTransactionsList(transactions.filter((item) => item.statusCode === 'c'));
    }
  };

  useEffect(() => {
    // To filter transactions list
    filterTransactions();
  }, [focusTab]);

  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground customSize={CUSTOM_HEADER}>
          <HeaderTitle />
        </HeaderImageBackground>
        <View style={styles.filterContainer}>
          <View style={styles.filterWrapper}>
            <TouchableWithoutFeedback onPress={() => setFocusTab(1)}>
              <View style={[styles.filterButton, {borderBottomWidth: focusTab === 1 ? 2 : 0}]}>
                <Text style={styles.filterText}>Current</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setFocusTab(2)}>
              <View
                style={[styles.filterButton, {marginHorizontal: scale(18), borderBottomWidth: focusTab === 2 ? 2 : 0}]}>
                <Text style={styles.filterText}>Completed</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setFocusTab(3)}>
              <View style={[styles.filterButton, {borderBottomWidth: focusTab === 3 ? 2 : 0}]}>
                <Text style={styles.filterText}>Cancelled</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList data={transactionsList} renderItem={renderItem} />
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
    borderRadius: Platform.OS === 'android' ? 3 : 12,
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
  statusMessage: {
    color: COLOR.DARK,
    fontFamily: FONT.BOLD,
  },
  filterContainer: {
    height: 50,
    paddingHorizontal: moderateScale(14),
  },
  filterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
  },
  filterButton: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: COLOR.ORANGE,
  },
  filterText: {
    color: COLOR.BLACK,
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  activityWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginEnd: 4,
  },
});

export default ToktokFoodOrderTransactions;
