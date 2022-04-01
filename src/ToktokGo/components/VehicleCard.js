import React from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';
import CONSTANTS from '../../common/res/constants';
import {numberFormat} from '../../helper';

import SedanIMG from '../../assets/images/Sedan.png';
import SuvIMG from '../../assets/images/SUV.png';
import MpvIMG from '../../assets/images/MPV2.png';
import VanIMG from '../../assets/images/Van.png';

export const VehicleCard = ({carImage, data}) => {
  const render_image = type => {
    switch (type) {
      case 1: {
        return SedanIMG;
      }
      case 2: {
        return SuvIMG;
      }
      case 3: {
        return MpvIMG;
      }
      case 4: {
        return VanIMG;
      }
    }
  };

  console.log(render_image(data.typeId));

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Image source={render_image(data.typeId)} resizeMode={'contain'} style={{width: 115, height: 70}} />
          <View style={{marginLeft: 15}}>
            <Text style={styles.carTextStyle}>{data.name}</Text>
            <Text style={styles.descTextStlye}>{data.description}</Text>
          </View>
        </View>
        <View style={styles.elementWrapper}>
          <Text style={styles.priceTextStyle}>₱{numberFormat(data.price)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
