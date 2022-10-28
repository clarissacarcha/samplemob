import React from 'react';
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';

const windowWidth = Dimensions.get('window').width;

const LocationCard = ({item, label, formattedAddress, onSelect, actionIcon, onActionPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        {/* {image && <Image source={image} resizeMode={'contain'} style={{height: 15, width: 15, marginRight: 10}} />} */}
        <TouchableOpacity onPress={() => onSelect(item)}>
          <Text style={styles.addressLabel}>{label}</Text>
          <Text style={styles.formattedAddress}>{formattedAddress}</Text>
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
});
