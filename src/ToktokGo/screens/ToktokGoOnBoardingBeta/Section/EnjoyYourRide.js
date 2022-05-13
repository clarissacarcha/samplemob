import React, {useState} from 'react';
import {Image, Text, View, StatusBar, Dimensions} from 'react-native';
import constants from '../../../../common/res/constants';
import ToktokgoIcon from '../../../../assets/images/ToktokgoIconBeta.png';
import EnjoyYourRides from '../../../../assets/images/EnjoyYourRideImage.png';

const ImageDimension = Dimensions.get('screen').height / 2.5;

export const EnjoyYourRide = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{marginTop: StatusBar.currentHeight + 40}}>
        <Image source={ToktokgoIcon} resizeMode={'contain'} style={{height: 45, width: 190}} />
      </View>
      <Image
        source={EnjoyYourRides}
        resizeMode={'contain'}
        style={{height: ImageDimension, width: ImageDimension, marginTop: 20}}
      />
      <View style={{alignItems: 'center', marginHorizontal: 50}}>
        <Text
          style={{
            color: constants.COLOR.ORANGE,
            fontFamily: constants.FONT_FAMILY.BOLD,
            fontSize: constants.FONT_SIZE.XL + 13,
            marginTop: 35,
          }}>
          Enjoy Your Ride
        </Text>
        <Text style={{fontSize: constants.FONT_SIZE.XL + 1, textAlign: 'center'}}>
          Sit back and relax while we bring you to your destination.
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 42}}>
        <View
          style={{
            backgroundColor: '#FBCEA6',
            width: 10,
            height: 10,
            borderRadius: 10,
          }}></View>
        <View style={{backgroundColor: '#FBCEA6', width: 10, height: 10, borderRadius: 10, marginHorizontal: 3}}></View>

        <View
          style={{
            backgroundColor: constants.COLOR.ORANGE,
            width: 20,
            height: 10,
            borderRadius: 10,
          }}></View>
      </View>
    </View>
  );
};
