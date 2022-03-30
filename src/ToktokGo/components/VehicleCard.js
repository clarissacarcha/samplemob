import React from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import CONSTANTS from '../../common/res/constants';

export const VehicleCard = ({carImage, data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Image source={carImage} resizeMode={'contain'} style={{width: 115, height: 70}} />
          <View style={{marginLeft: 15}}>
            <Text style={styles.carTextStyle}>{data.name}</Text>
            <Text style={styles.descTextStlye}>{data.description}</Text>
          </View>
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.priceTextStyle}>₱{data.price}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selected: {
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 10,
  },
  carTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  descTextStlye: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
});
