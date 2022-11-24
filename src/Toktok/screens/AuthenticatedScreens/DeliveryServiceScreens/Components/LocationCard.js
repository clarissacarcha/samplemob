import React from 'react';
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';

import HomeIcon from '../../../../../assets/icons/SavedAddress/homeFilled.png';
import OfficeIcon from '../../../../../assets/icons/SavedAddress/officeFilled.png';
import CustomIcon from '../../../../../assets/icons/SavedAddress//customFilled.png';

const windowWidth = Dimensions.get('window').width;

const LocationCard = ({item, label, formattedAddress, onSelect, actionIcon, onActionPress}) => {
  const renderImage = () => {
    if (item.isHome) {
      return <Image source={HomeIcon} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />;
    } else if (item.isOffice) {
      return <Image source={OfficeIcon} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />;
    } else if (item.label) {
      return <Image source={CustomIcon} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />;
    } else {
      return;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <TouchableOpacity onPress={() => onSelect(item)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderImage()}
            <Text style={styles.addressLabel}>{label}</Text>
          </View>
          <Text style={[styles.formattedAddress, {marginLeft: renderImage() ? 25 : 0}]}>{formattedAddress}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => onActionPress(item)}>
        <Image source={actionIcon} resizeMode={'contain'} style={styles.dimensions} />
      </TouchableOpacity>
    </View>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressContainer: {
    flexDirection: 'column',
    paddingVertical: 16,
    backgroundColor: 'white',
    width: windowWidth * 0.8,
  },
  addressLabel: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.BLACK,
  },
  formattedAddress: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
  },
  dimensions: {
    width: 20,
    height: 20,
  },
  appliedVoucherClose: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 3,
  },
});
