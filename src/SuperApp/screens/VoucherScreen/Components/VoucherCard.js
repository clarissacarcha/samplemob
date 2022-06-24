import React from 'react';
import {Text, StyleSheet, Image, View, Modal, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';
import voucherPaperDesign from '../../../../assets/toktokgo/voucher-paper-design.png';

const decorHeight = Dimensions.get('window').height * 0.12;

export const VoucherCard = ({data, navigation, setViewSuccesVoucherClaimedModal}) => {
  return (
    <ThrottledOpacity onPress={() => navigation.navigate('SelectedVoucherScreen', {data})}>
      <View style={styles.card}>
        <Image source={voucherPaperDesign} resizeMode={'contain'} style={styles.floatingImage} />
        <Image source={data.image} resizeMode={'contain'} style={styles.voucherImage} />
        <View style={styles.voucherText}>
          <Text style={styles.voucherName}>{data.title}</Text>
          <Text style={styles.voucherDescription}>{data.description}</Text>
        </View>
        <View style={styles.claimContainer}>
          {data.isClaimed ? (
            <ThrottledOpacity style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Claim</Text>
            </ThrottledOpacity>
          ) : (
            <ThrottledOpacity style={styles.useButton}>
              <Text style={styles.useButtonText}>Use</Text>
            </ThrottledOpacity>
          )}
          <ThrottledOpacity>
            <Text style={styles.TandC}>T&C</Text>
          </ThrottledOpacity>
        </View>
      </View>
    </ThrottledOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    height: decorHeight,
    marginHorizontal: 16,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    flexDirection: 'row',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  floatingImage: {
    height: decorHeight,
    position: 'absolute',
    left: -20,
  },
  voucherText: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
  },
  voucherName: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
  },
  voucherDescription: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.GRAY,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  voucherImage: {
    alignSelf: 'center',
    marginLeft: 18,
    width: decorHeight - 20,
    height: decorHeight - 20,
  },
  claimButton: {
    marginTop: 20,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 6,
  },
  claimButtonText: {
    marginHorizontal: 16,
    textAlignL: 'center',
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  useButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 4,
  },
  useButtonText: {
    marginHorizontal: 19,
    textAlignL: 'center',
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  claimContainer: {
    justifyContent: 'center',
    marginRight: 16,
  },
  TandC: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ORANGE,
  },
});
