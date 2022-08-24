import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View, Modal, Dimensions, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';
import * as Progress from 'react-native-progress';
import voucherPaperDesign from '../../../../assets/toktokgo/voucher-paper-design.png';
import VoucherImage from '../../../../assets/toktokgo/voucher-sedan-image.png';
import voucherPaperDesignDisabled from '../../../../assets/toktokgo/voucher-paper-design-disabled.png';
import VoucherImageDisabled from '../../../../assets/toktokgo/voucher-sedan-image-disabled.png';
import moment from 'moment';

const decorHeight = Dimensions.get('window').height * 0.12;

export const VoucherCard = ({details, data, navigation, onPressActionButton, loading, postCollectVoucher}) => {
  const [isApplicable, setIsApplicable] = useState(true);

  const getComputed = () => {
    return data.discountValue * data.voucherWallet.remaining;
  };

  const getPercentage = () => {
    return data.voucherWallet.remaining / data.voucherWallet.total;
  };

  const onPress = () => {
    if (data.collectable && !data.voucherWallet) {
      postCollectVoucher({
        variables: {
          input: {
            voucherId: data.id,
          },
        },
      });
    } else {
      onPressActionButton(data);
    }
  };

  const checkPaymentMethod = () => {
    if (details.paymentMethod == 'TOKTOKWALLET') {
      if (data.isTokwa) setIsApplicable(false);
    } else {
      if (data.isCash || data.isCod) setIsApplicable(false);
    }
  };

  useEffect(() => {
    checkPaymentMethod();
  }, []);
  return (
    <>
      <View style={styles.card}>
        <Image
          source={isApplicable ? voucherPaperDesignDisabled : voucherPaperDesign}
          resizeMode={'contain'}
          style={styles.floatingImage}
        />
        <Image
          source={isApplicable ? VoucherImageDisabled : VoucherImage}
          resizeMode={'contain'}
          style={styles.voucherImage}
        />
        <View style={styles.voucherText}>
          <Text style={styles.voucherName}>{data.name}</Text>
          <Text style={styles.voucherDescription}>
            {data?.description?.length < 30 ? `${data?.description}` : `${data?.description.substring(0, 30)}...`}
          </Text>
          {data.endAt && <Text style={styles.voucherDescription}>Valid unitl {moment(data.endAt).format('LL')}</Text>}
          {data.voucherWallet?.total > 1 && (
            <>
              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: 10,
                  marginVertical: 8,
                  marginRight: 15,
                }}>
                <Progress.Bar
                  height={3}
                  progress={getPercentage()}
                  unfilledColor={'#FFF1D2'}
                  color={isApplicable ? CONSTANTS.COLOR.GRAY : CONSTANTS.COLOR.ORANGE}
                  borderRadius={0}
                  borderWidth={0}
                  width={null}
                  animationType={'timing'}
                />
              </View>
              <Text style={isApplicable ? {color: CONSTANTS.COLOR.GRAY} : styles.computed}>
                ₱{getComputed()} remaining
              </Text>
            </>
          )}
        </View>
        <View style={styles.claimContainer}>
          {loading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : data.collectable && !data.voucherWallet ? (
            <ThrottledOpacity
              style={isApplicable ? [styles.claimButton, {backgroundColor: CONSTANTS.COLOR.GRAY}] : styles.claimButton}
              onPress={onPress}
              delay={500}
              disabled={isApplicable}>
              <Text style={styles.claimButtonText}>Claim</Text>
            </ThrottledOpacity>
          ) : (
            <ThrottledOpacity
              style={isApplicable ? [styles.useButton, {borderColor: CONSTANTS.COLOR.GRAY}] : styles.useButton}
              onPress={onPress}
              delay={500}
              disabled={isApplicable}>
              <Text style={isApplicable ? [styles.useButtonText, {color: CONSTANTS.COLOR.GRAY}] : styles.useButtonText}>
                Use
              </Text>
            </ThrottledOpacity>
          )}
          <ThrottledOpacity
            onPress={() => navigation.navigate('ToktokGoBookingSelectedVoucher', {id: data.id, onPress})}
            disabled={isApplicable}>
            <Text style={isApplicable ? [styles.TandC, {color: CONSTANTS.COLOR.GRAY}] : styles.TandC}>T&C</Text>
          </ThrottledOpacity>
        </View>
      </View>
      {isApplicable && (
        <View
          style={{
            backgroundColor: '#fff3e8',
            flex: 1,
            marginHorizontal: 16,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}>
          <Text style={{color: CONSTANTS.COLOR.RED, margin: 8, fontSize: CONSTANTS.FONT_SIZE.S}}>
            Not applicable to selected payment method
          </Text>
        </View>
      )}
    </>
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
  computed: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  voucherName: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
  },
  voucherDescription: {
    color: '#000',
    fontSize: CONSTANTS.FONT_SIZE.S,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
