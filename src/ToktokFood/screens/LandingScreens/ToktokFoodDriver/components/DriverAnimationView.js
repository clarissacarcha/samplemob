import React from 'react';
import {Image, Platform, StyleSheet, View, Text} from 'react-native';

// Components
import DriverDetailsView from './DriverDetailsView';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {driver} from 'toktokfood/assets/images';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const DriverAnimationView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.contactSupportText}>Contact Support</Text>
      <View style={styles.imgContainer}>
        <Image style={styles.img} source={driver} resizeMode="contain" />
      </View>

      <DriverDetailsView />
    </View>
  );
};

export default DriverAnimationView;

const styles = StyleSheet.create({
  container: {
    // flex: 3,
    // borderWidth: 1,
  },
  contactSupportText: {
    color: COLORS.YELLOWTEXT,
    fontSize: 15,
    paddingRight: moderateScale(20),
    textAlign: 'right',
  },
  img: {
    height: 190,
    width: 220,
    marginLeft: moderateScale(30),
  },
  imgContainer: {
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(20),
  },
});
