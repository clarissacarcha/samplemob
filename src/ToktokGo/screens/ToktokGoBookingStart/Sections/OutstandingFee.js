import React, {useState} from 'react';
import {Text, View, Image, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import InfoIcon from '../../../../assets/icons/InfoIcon.png';
import CarFee from '../../../../assets/images/CarFee.png';
import TokWaIMG from '../../../../assets/images/wallet-whiteOutline.png';
import {ThrottledOpacity} from '../../../../components_section';
import {Card} from './Card';
import {numberFormat} from '../../../../helper';
import moment from 'moment';
import {UnpaidModal, NotEnoughBalanceModal} from '../Components';

const windowWidth = Dimensions.get('window').width;

export const OutstandingFee = ({
  navigation,
  tripChargeInitializePaymentFunction,
  tripConsumerPending,
  showNotEnoughBalanceModal,
  setShowNotEnoughBalanceModal,
}) => {
  const [unpaid, setUnpaid] = useState(false);
  const {logs, cancellation} = tripConsumerPending[0];
  const lastItem = logs[logs.length - 1];

  const onPressLocation = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: 1,
    });
  };
  const getDateFee = () => {
    const lastItemDateFormatted = moment(lastItem.createdAt).format('MMM D, YYYY');
    if (cancellation.initiatedBy == 'CONSUMER') return `Cancellation Fee last ${lastItemDateFormatted}`;
    else return `No Show Fee last ${lastItemDateFormatted}`;
  };

  return (
    <View style={{marginBottom: 24}}>
      <UnpaidModal visible={unpaid} setVisible={setUnpaid} />
      <NotEnoughBalanceModal
        visible={showNotEnoughBalanceModal}
        setVisible={setShowNotEnoughBalanceModal}
        navigation={navigation}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 13,
          backgroundColor: CONSTANTS.COLOR.WHITE,
          // paddingVertical: 10,
        }}>
        <Text
          style={{
            fontSize: CONSTANTS.FONT_SIZE.M,
            color: CONSTANTS.COLOR.ALMOST_BLACK,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
            marginLeft: 7,
          }}>
          Outstanding Fee
        </Text>
        <ThrottledOpacity
          delay={500}
          onPress={() => {
            setUnpaid(true);
          }}>
          <Image source={InfoIcon} resizeMode="contain" style={{height: 12, width: 12, marginLeft: 10}} />
        </ThrottledOpacity>
      </View>
      <Card
        containerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          marginHorizontal: 20,
          marginTop: 8,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Image source={CarFee} resizeMode="contain" style={{height: 45, width: 45}} />
            <View
              style={{
                marginHorizontal: 8,
                width: windowWidth <= 380 ? windowWidth * 0.35 : windowWidth * 0.5,
              }}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.M}}>{getDateFee()}</Text>
              <ThrottledOpacity
                delay={500}
                onPress={() => {
                  navigation.push('SelectedBookingDetails', {booking: tripConsumerPending[0]});
                }}>
                <Text style={{fontSize: CONSTANTS.FONT_SIZE.M, color: CONSTANTS.COLOR.ORANGE}}>
                  See Booking Details
                </Text>
              </ThrottledOpacity>
            </View>
          </View>
          <Text
            style={{
              fontSize: CONSTANTS.FONT_SIZE.XL + 1,
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              color: CONSTANTS.COLOR.ORANGE,
              marginTop: 5,
            }}>
            ₱{numberFormat(tripConsumerPending[0].cancellation.charge.amount)}
          </Text>
        </View>
        <ThrottledOpacity
          delay={500}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: CONSTANTS.COLOR.ORANGE,
            borderWidth: 1,
            // marginHorizontal: 10,
            borderColor: CONSTANTS.COLOR.ORANGE,
          }}
          onPress={tripChargeInitializePaymentFunction}>
          <Image source={TokWaIMG} style={{width: 24, height: 24, marginRight: 8}} resizeMode={'contain'} />
          <Text
            style={{
              fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
              fontSize: CONSTANTS.FONT_SIZE.XL,
              color: CONSTANTS.COLOR.WHITE,
            }}>
            Pay via toktokwallet
          </Text>
        </ThrottledOpacity>
      </Card>
    </View>
  );
};
