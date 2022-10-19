import React, {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View, Image, Animated} from 'react-native';
import {MEDIUM} from '../../../../res/constants';
import CONSTANTS from '../../../../common/res/constants';
import HomeImg from '../../../../assets/icons/SavedAddress/homeFilled.png';
import OfficeImg from '../../../../assets/icons/SavedAddress/officeFilled.png';
import CustomImg from '../../../../assets/icons/SavedAddress/customFilled.png';
import DeleteImg from '../../../../assets/icons/deleteIcon.png';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ThrottledOpacity} from '../../../../components_section';

export const SavedLocationCard = ({onPressAddress, address, initiateDeleteAddress}) => {
  const getTitle = () => {
    if (address?.isHome) {
      return 'Home';
    } else if (address?.isOffice) {
      return 'Office';
    } else if (address.label) {
      return address?.label;
    } else {
      return null;
    }
  };

  const getImage = () => {
    if (address?.isHome) {
      return HomeImg;
    } else if (address?.isOffice) {
      return OfficeImg;
    } else if (address.label) {
      return CustomImg;
    } else {
      return null;
    }
  };

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 900],
      outputRange: [1, 0],
    });

    console.log('zion', scale);
    return (
      <ThrottledOpacity onPress={() => initiateDeleteAddress(address)} delay={4000}>
        <Animated.View style={[styles.deleteBtn, {transform: [{scale: scale}]}]}>
          {/* <Animated.Text>Delete</Animated.Text> */}
          <Image source={DeleteImg} resizeMode={'contain'} style={{width: 30, height: 30}} />
        </Animated.View>
      </ThrottledOpacity>
    );
  };
  return (
    <Swipeable disabled={true} renderRightActions={rightSwipe} overshootRight={false}>
      <ThrottledOpacity
        onPress={() => onPressAddress(address)}
        underlayColor={CONSTANTS.COLOR.WHITE_UNDERLAY}
        style={styles.container}>
        <View style={styles.cardShadow}>
          <View style={styles.headerContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Image source={getImage()} resizeMode={'contain'} style={{width: 20, height: 20, marginRight: 6}} />
              <Text style={styles.headerText}>{getTitle()}</Text>
            </View>
            <Text style={styles.headerDefaultText}>{address?.isDefault ? 'Default' : null}</Text>
          </View>
          <View style={styles.lineDivider} />
          <View style={styles.contentContainer}>
            {address?.contactDetails?.fullname != '' && (
              <Text style={styles.contactNameText}>{address?.contactDetails?.fullname}</Text>
            )}
            <Text style={styles.addressText}>{address?.place?.formattedAddress}</Text>
            {address?.landmark != '' && <Text style={styles.landmarkText}>{address?.landmark}</Text>}
            {address?.contactDetails?.mobile_no != '' && (
              <Text style={styles.mobNumberText}>+63{address?.contactDetails?.mobile_no}</Text>
            )}
          </View>
        </View>
      </ThrottledOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardShadow: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginBottom: 8,
  },
  headerDefaultText: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ORANGE,
  },
  lineDivider: {
    marginHorizontal: -16,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  contentContainer: {
    alignContent: 'center',
    marginTop: 16,
  },
  contactNameText: {
    textTransform: 'capitalize',
    marginBottom: 8,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  mobNumberText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 8,
  },
  landmarkText: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.GRAY,
    marginBottom: 8,
  },
  addressText: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    marginBottom: 8,
  },
  deleteBtn: {
    backgroundColor: 'red',
    marginTop: '25%',
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: 16,
    height: '60%',
    paddingHorizontal: 16,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
