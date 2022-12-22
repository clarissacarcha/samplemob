import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image, View, Modal, Dimensions, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';
import * as Progress from 'react-native-progress';
import voucherPaperDesign from '../../../../assets/toktokgo/voucher-paper-design.png';
import voucherPaperDesign2 from '../../../../assets/toktokgo/VectorShadow.png';
import VoucherImage from '../../../../assets/toktokgo/newCarIcon.png';
import voucherPaperDesignDisabled from '../../../../assets/toktokgo/voucher-paper-design-disabled.png';
import VoucherImageDisabled from '../../../../assets/toktokgo/car-grayout.png';
import moment from 'moment';
import normalize from 'react-native-normalize';

const decorHeight = Dimensions.get('window').height * 0.12;

export const VoucherCard = ({
  details,
  data,
  navigation,
  onPressActionButton,
  loading,
  postCollectVoucher,
  setProcessingVisible,
  fromVoucherDetails,
  setFromVoucherDetails,
}) => {
  const [isApplicable, setIsApplicable] = useState(true);
  const [isApplicableDailyLimit, setIsApplicableDailyLimit] = useState(false);
  const [isApplicableMaxLimit, setIsApplicableMaxLimit] = useState('');
  const [isApplicableMinSpent, setIsApplicableMinSpent] = useState(false);
  const [isApplicableMinSpentText, setIsApplicableMinSpentText] = useState('');
  const getComputed = () => {
    return data.discountValue * data.voucherWallet.remaining;
  };

  const getPercentage = () => {
    return data.voucherWallet.remaining / data.voucherWallet.total;
  };

  const onPress = () => {
    if (fromVoucherDetails == false) {
      setProcessingVisible(true);
      setTimeout(() => {
        if (data?.collectable && !data?.voucherWallet) {
          postCollectVoucher({
            variables: {
              input: {
                voucherId: data.id,
              },
            },
          });
        } else {
          onPressActionButton(data);
          setProcessingVisible(false);
        }
      }, 3000);
    } else {
      if (data?.collectable && !data?.voucherWallet) {
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
    }
  };

  const checkPaymentMethod = () => {
    if (details.paymentMethod == 'TOKTOKWALLET' && data.isTokwa) {
      setIsApplicable(false);
    }
    if (details.paymentMethod == 'CASH' && data.isCash) {
      setIsApplicable(false);
    }
  };

  const dailyLimit = () => {
    if(data.remainingVoucher.dailyLimit == 0){
      setIsApplicableDailyLimit(true)
      setIsApplicableMaxLimit('This voucher reached the maximum redemption limit today')
    }else if(data.remainingVoucher.dailyMaxCount == 0){
      setIsApplicableDailyLimit(true)
      setIsApplicableMaxLimit('This voucher reached the maximum redemption limit today')
    }else if(data.remainingVoucher.lifetimeLimit == 0){
      setIsApplicableDailyLimit(true)
      setIsApplicableMaxLimit('This voucher reached the maximum redemption limit')
    }else if(data.remainingVoucher.lifetimeMaxCount == 0){
      setIsApplicableDailyLimit(true)
      setIsApplicableMaxLimit('This voucher reached the maximum redemption limit')
    }
  };

  const minimumSpent = () => {
    if(data?.details?.minAmount > details?.rate?.tripFare?.total){
      setIsApplicableMinSpent(true)
      setIsApplicableMinSpentText('This voucher can only be used if you meet' + ' ' + '₱' + data?.details?.minAmount + '.00' + ' total')
    }
  }

  useEffect(() => {
    checkPaymentMethod();
    dailyLimit();
    minimumSpent();
  }, []);
  return (
    <>
      <View style={styles.card}>
        <Image
          source={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? voucherPaperDesignDisabled : voucherPaperDesign}
          resizeMode={'contain'}
          style={styles.floatingImage}
        />
        <Image source={voucherPaperDesign2} resizeMode={'contain'} style={styles.floatingImage2} />
        <Image
          source={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? VoucherImageDisabled : VoucherImage}
          resizeMode={'contain'}
          style={styles.voucherImage}
        />
        <View style={styles.voucherText}>
          <Text style={styles.voucherName}>{data.name}</Text>
          <View style={{width: normalize(155)}}>
            <Text style={styles.voucherDescription} numberOfLines={1}>
              {data?.description}
            </Text>
          </View>
          {data.endAt && <Text style={styles.voucherDescription}>Valid until {moment(data.endAt).format('LL')}</Text>}
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
              <Text style={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? {color: CONSTANTS.COLOR.GRAY} : styles.computed}>
                ₱{getComputed()} remaining
              </Text>
            </>
          )}
        </View>
        <View style={styles.claimContainer}>
          {data.collectable && !data.voucherWallet ? (
            // loading ? (
            //   <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
            // ) :
            <ThrottledOpacity
              style={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? [styles.claimButton, {backgroundColor: CONSTANTS.COLOR.GRAY}] : styles.claimButton}
              onPress={onPress}
              delay={500}
              disabled={isApplicable || isApplicableDailyLimit || isApplicableMinSpent}>
              <Text style={styles.claimButtonText}>Claim</Text>
            </ThrottledOpacity>
          ) : (
            <ThrottledOpacity
              style={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? [styles.useButton, {borderColor: CONSTANTS.COLOR.GRAY}] : styles.useButton}
              onPress={onPress}
              delay={500}
              disabled={isApplicable|| isApplicableDailyLimit || isApplicableMinSpent}>
              <Text style={isApplicable || isApplicableDailyLimit || isApplicableMinSpent ? [styles.useButtonText, {color: CONSTANTS.COLOR.GRAY}] : styles.useButtonText}>
                Use
              </Text>
            </ThrottledOpacity>
          )}
          <ThrottledOpacity
            onPress={() =>
              navigation.navigate('ToktokGoBookingSelectedVoucher', {
                id: data.id,
                onPress,
                isApplicable,
                isApplicableDailyLimit,
                setFromVoucherDetails,
                onPressActionButton,
                isApplicableMinSpent,
              })
            }>
            <Text style={styles.TandC}>T&C</Text>
          </ThrottledOpacity>
        </View>
      </View>
      {isApplicable &&  (
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
      {isApplicableDailyLimit &&  (
        <View
          style={{
            backgroundColor: '#fff3e8',
            flex: 1,
            marginHorizontal: 16,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}>
          <Text style={{color: CONSTANTS.COLOR.RED, margin: 8, fontSize: CONSTANTS.FONT_SIZE.S}}>
           {isApplicableMaxLimit}
          </Text>
        </View>
      )}
      {isApplicableMinSpent &&  (
        <View
          style={{
            backgroundColor: '#fff3e8',
            flex: 1,
            marginHorizontal: 16,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}>
          <Text style={{color: CONSTANTS.COLOR.RED, margin: 8, fontSize: CONSTANTS.FONT_SIZE.S}}>
           {isApplicableMinSpentText}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    height: normalize(95),
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
    height: normalize(95),
    position: 'absolute',
    left: -20,
  },
  floatingImage2: {
    height: normalize(95),
    position: 'absolute',
    right: -45,
  },
  voucherText: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  computed: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
    fontSize: normalize(11),
  },
  voucherName: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 8,
    fontSize: normalize(13),
  },
  voucherDescription: {
    fontFamily: Platform.OS === 'ios' ? CONSTANTS.FONT_FAMILY.SEMI_BOLD : CONSTANTS.FONT_FAMILY.REGULAR,
    fontSize: CONSTANTS.FONT_SIZE.S,
    fontWeight: 'normal',
    fontSize: normalize(11),
  },
  voucherImage: {
    alignSelf: 'center',
    marginLeft: 18,
    width: normalize(73),
    height: normalize(73),
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
    textAlign: 'center',
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
    textAlign: 'center',
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
    fontSize: normalize(11),
  },
});
