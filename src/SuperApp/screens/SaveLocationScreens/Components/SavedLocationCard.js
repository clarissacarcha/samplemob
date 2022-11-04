import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {MEDIUM} from '../../../../res/constants';
import CONSTANTS from '../../../../common/res/constants';
import HomeImg from '../../../../assets/icons/SavedAddress/homeFilled.png';
import OfficeImg from '../../../../assets/icons/SavedAddress/officeFilled.png';
import CustomImg from '../../../../assets/icons/SavedAddress/customFilled.png';
import {ThrottledOpacity} from '../../../../components_section';
import normalize from 'react-native-normalize';

export const SavedLocationCard = ({onPressAddress, address, lastItem}) => {
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

  return (
    <ThrottledOpacity
      onPress={() => onPressAddress(address)}
      underlayColor={CONSTANTS.COLOR.WHITE_UNDERLAY}
      style={[styles.container, {marginBottom: lastItem ? 26 : 16}]}>
      <View style={styles.cardShadow}>
        <View style={styles.headerContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              source={getImage()}
              resizeMode={'contain'}
              style={{width: normalize(20), height: normalize(20), marginRight: 6}}
            />
            <Text style={styles.headerText}>{getTitle()}</Text>
          </View>
          <Text style={styles.headerDefaultText}>{address?.isDefault ? 'Default' : null}</Text>
        </View>
        <View style={styles.lineDivider} />
        <View style={styles.contentContainer}>
          {address?.contactDetails?.fullname && (
            <Text style={styles.contactNameText}>{address?.contactDetails?.fullname}</Text>
          )}
          <Text style={styles.addressText}>{address?.place?.formattedAddress}</Text>
          {address?.landmark && <Text style={styles.landmarkText}>{address?.landmark}</Text>}
          {address?.contactDetails?.mobile_no && (
            <Text style={styles.mobNumberText}>+63{address?.contactDetails?.mobile_no}</Text>
          )}
        </View>
      </View>
    </ThrottledOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 16,
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
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
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
});
