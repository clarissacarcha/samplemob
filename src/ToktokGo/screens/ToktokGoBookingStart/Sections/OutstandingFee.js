import React from 'react';
import {Text, View, Image} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import InfoIcon from '../../../../assets/icons/InfoIcon.png';
import CarFee from '../../../../assets/images/CarFee.png';
import TokWaIMG from '../../../../assets/images/wallet-whiteOutline.png';
import {ThrottledOpacity} from '../../../../components_section';
import {Card} from './Card';
export const OutstandingFee = ({navigation}) => {
  const onPressLocation = () => {
    navigation.push('ToktokGoBookingConfirmPickup', {
      popTo: 1,
    });
  };

  return (
    <View>
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
            color: CONSTANTS.COLOR.BLACK,
            fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
            marginLeft: 7,
          }}>
          Outstanding Fee
        </Text>
        <ThrottledOpacity delay={500} onPress={() => {}}>
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
            <View style={{marginHorizontal: 8}}>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.M}}>Cancellation Fee last Jan 7, 2022</Text>
              <ThrottledOpacity delay={500} onPress={() => {}}>
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
            }}>
            ₱50.00
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
          onPress={() => {}}>
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
