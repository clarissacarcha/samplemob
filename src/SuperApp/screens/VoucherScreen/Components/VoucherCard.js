import React from 'react';
import {Text, StyleSheet, Image, View, Modal, Dimensions, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';
import * as Progress from 'react-native-progress';
import voucherPaperDesign from '../../../../assets/toktokgo/voucher-paper-design.png';
import VoucherImage from '../../../../assets/toktokgo/voucher-sedan-image.png';
import moment from 'moment';

const decorHeight = Dimensions.get('window').height * 0.12;

export const VoucherCard = ({data, navigation, onPressActionButton, loading}) => {
  const getComputed = () => {
    return data.discountValue * data.voucherWallet.remaining;
  };

  const getPercentage = () => {
    return data.voucherWallet.remaining / data.voucherWallet.total;
  };

  const onPress = () => {
    if (data.collectable && !data.voucherWallet) {
      onPressActionButton({voucherId: data.id});
    } else {
      navigation.pop(2);
      navigation.push('ToktokGoLanding');
    }
  };

  return (
    <ThrottledOpacity onPress={() => navigation.navigate('SelectedVoucherScreen', {id: data.id})}>
      <View style={styles.card}>
        <Image source={voucherPaperDesign} resizeMode={'contain'} style={styles.floatingImage} />
        <Image source={VoucherImage} resizeMode={'contain'} style={styles.voucherImage} />
        <View style={styles.voucherText}>
          <Text style={styles.voucherName}>{data.name}</Text>
          <Text style={styles.voucherDescription}>{data.description}</Text>
          {data.endAt && (
            <Text style={styles.voucherDescriptionDate}>Valid unitl {moment(data.endAt).format('MMM DD YYYY')}</Text>
          )}
          {data.voucherWallet?.total > 1 && (
            <>
              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: 10,
                }}>
                <Progress.Bar
                  height={3}
                  progress={getPercentage()}
                  unfilledColor={'#FFF1D2'}
                  color={CONSTANTS.COLOR.ORANGE}
                  borderRadius={0}
                  borderWidth={0}
                  width={null}
                  animationType={'timing'}
                />
              </View>
              <Text style={styles.computed}>₱{getComputed()} remaining</Text>
            </>
          )}
        </View>
        <View style={styles.claimContainer}>
          {loading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : data.collectable && !data.voucherWallet ? (
            <ThrottledOpacity style={styles.claimButton} onPress={onPress} delay={500}>
              <Text style={styles.claimButtonText}>Claim</Text>
            </ThrottledOpacity>
          ) : (
            <ThrottledOpacity style={styles.useButton} onPress={onPress} delay={500}>
              <Text style={styles.useButtonText}>Use</Text>
            </ThrottledOpacity>
          )}
          <ThrottledOpacity onPress={() => navigation.navigate('SelectedVoucherScreen', {id: data.id})} delay={500}>
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
    marginRight: 15,
  },
  computed: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  voucherName: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
  },
  voucherDescription: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    // color: CONSTANTS.COLOR.GRAY,
    fontSize: CONSTANTS.FONT_SIZE.S,
    fontWeight: 'normal',
  },
  voucherDescriptionDate: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.GRAY,
    fontSize: CONSTANTS.FONT_SIZE.S,
    fontWeight: 'normal',
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
