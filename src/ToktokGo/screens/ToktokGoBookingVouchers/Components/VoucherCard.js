import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, Dimensions, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import voucherSedanImage from '../../../../assets/toktokgo/voucher-sedan-image.png';
import voucherPaperDesign from '../../../../assets/toktokgo/voucher-paper-design.png';
const ImageWidth = (Dimensions.get('window').width - 230) / 2;
const decorWidth = (Dimensions.get('window').width - 195) / 2;

export const VoucherCard = ({item, onApply, lastItem}) => {
  return (
    <View style={styles.card}>
      <Image source={voucherPaperDesign} resizeMode={'contain'} style={styles.floatingImage} />
      <View style={{paddingHorizontal: 16, flex: 1}}>
        <View style={styles.container}>
          <View style={styles.elementWrapper}>
            <Image source={voucherSedanImage} resizeMode={'contain'} style={{width: ImageWidth, height: ImageWidth}} />
            <View style={{marginLeft: 15}}>
              <Text style={styles.carTextStyle}>{item.name}</Text>
              <Text style={styles.descTextStlye}>Valid till May 18, 2022</Text>
            </View>
          </View>
          <View style={styles.rightGroup}>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TCButton}>
              <Text style={styles.TCText}>T&C</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginVertical: 8,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  elementWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  carTextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  descTextStlye: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  floatingImage: {
    position: 'absolute',
    height: decorWidth,
    left: -19,
  },
  rightGroup: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
  },
  applyText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.WHITE,
  },
  TCButton: {
    marginTop: 8,
  },
  TCText: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.ORANGE,
  },
});
