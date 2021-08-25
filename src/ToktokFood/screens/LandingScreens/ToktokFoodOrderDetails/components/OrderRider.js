import React from 'react';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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

  const renderAvatar = () => (
    <View style={styles.avatarContainer}>
      <Image resizeMode="cover" style={styles.avatar} source={rider1} />

      <View style={styles.leftContainer}>
        <Text style={styles.riderName}>Edward Nolasco Rosario</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.notes}>4</Text>
          <Image resizeMode="contain" style={styles.star} source={star} />
          <Image resizeMode="contain" style={styles.star} source={star} />
          <Image resizeMode="contain" style={styles.star} source={star} />
          <Image resizeMode="contain" style={styles.star} source={star} />
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionContainer}>
      <Text style={styles.orderNumber}>0999000000</Text>
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
    // borderWidth: 1,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  avatarContainer: {
    flexDirection: 'row',
  },
  leftContainer: {
    // borderWidth: 1,
    padding: 15,
  },
  orderNumber: {
    fontWeight: '400',
  },
  phone: {
    width: 17,
    height: 17,
    marginHorizontal: 10,
    tintColor: COLORS.YELLOWTEXT,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(2),
  },
  riderInfo: {
    // borderWidth: 1,
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
    marginTop: verticalScale(8),
    padding: moderateScale(20),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
