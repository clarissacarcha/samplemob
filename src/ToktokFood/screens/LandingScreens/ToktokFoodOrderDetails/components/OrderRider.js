import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Rating} from 'react-native-ratings';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Images
import {chat, phoneBlack, rider1, star} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderRider = () => {
  const onMessage = () => {
    const url = `sms:+639100593229`;
    Linking.openURL(url);
  };

  const onCall = () => {
    const url = `tel:+639100593229`;
    Linking.openURL(url);
  };

  const renderAvatar = (rating = 4) => (
    <View style={styles.avatarContainer}>
      <Image resizeMode="cover" style={styles.avatar} source={rider1} />
      <View style={styles.leftContainer}>
        <Text style={styles.riderName}>Edward Nolasco Rosario</Text>
        <Text style={styles.orderNumber}>0999000000</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.notes}>{parseFloat(rating).toFixed(1)}</Text>
          <Rating startingValue={parseFloat(rating).toFixed(1)} imageSize={13} readonly style={styles.ratings} ratingColor={"#FFA700"} />
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionContainer}>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onMessage}>
          <Image resizeMode="contain" style={styles.phone} source={chat} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCall}>
          <Image resizeMode="contain" style={styles.phone} source={phoneBlack} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderAvatar()}
        {renderActions()}
      </View>
      <View style={styles.riderInfo}>
        <Text style={styles.notes}>0909-7570947</Text>
        <Text style={styles.notes}>Yamaha Sniper 150</Text>
      </View>
    </View>
  );
};

export default OrderRider;

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionContainer: {
    justifyContent: 'space-between',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  avatarContainer: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  leftContainer: {
    paddingHorizontal: 15
  },
  orderNumber: {
    fontWeight: '400',
  },
  phone: {
    width: 20,
    height: 20,
    marginLeft: 20,
    tintColor: COLORS.YELLOWTEXT,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: "center"
  },
  riderInfo: {
    borderTopWidth: 1,
    borderColor: '#DDDDDD',
    marginTop: verticalScale(5),
    paddingTop: moderateScale(5),
  },
  riderName: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  star: {
    width: 10,
    height: 10,
    marginLeft: 3,
    alignSelf: 'center',
  },
  notes: {
    fontWeight: '300',
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    padding: moderateScale(20),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },
});
