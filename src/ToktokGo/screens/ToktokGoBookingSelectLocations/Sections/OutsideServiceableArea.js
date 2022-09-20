import React from 'react';
import {Image, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import constants from '../../../../common/res/constants';
import EmptyImage from '../../../../assets/toktokgo/toktokgoServiceableArea.png';
import normalize from 'react-native-normalize';
import {ThrottledOpacity} from '../../../../components_section';
import {ServiceableArea} from '../Components';

const windowWidth = Dimensions.get('window').width;

export const OutsideServiceableArea = ({setServiceableAreVisible, serviceableAreVisible}) => {
  return (
    <>
      <View style={{alignItems: 'center', marginVertical: 40}}>
        <ServiceableArea isVissible={serviceableAreVisible} setVissible={setServiceableAreVisible} />
        <Image source={EmptyImage} style={{height: normalize(220), width: normalize(220)}} resizeMode={'contain'} />
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              //   marginTop: 20,
              color: constants.COLOR.YELLOW,
              fontSize: constants.FONT_SIZE.XL + 1,
              fontFamily: constants.FONT_FAMILY.BOLD,
            }}>
            toktok
            <Text
              style={{
                marginTop: 20,
                color: constants.COLOR.ORANGE,
                fontSize: constants.FONT_SIZE.XL + 1,
                fontFamily: constants.FONT_FAMILY.BOLD,
              }}>
              go will be driving
            </Text>
          </Text>
        </View>
        <Text
          style={{
            color: constants.COLOR.ORANGE,
            fontSize: constants.FONT_SIZE.XL + 1,
            fontFamily: constants.FONT_FAMILY.BOLD,
          }}>
          soon in this area
        </Text>
        <View style={{width: windowWidth * 0.51, marginTop: 8}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: constants.FONT_SIZE.M,
              color: constants.COLOR.BLACK,
            }}>
            Don’t worry, ka-toktok, we are working on expanding our serviceable area. We will be with you soon! Kapit
            lang.
          </Text>
        </View>
        <ThrottledOpacity
          onPress={() => {
            setServiceableAreVisible(true);
          }}
          style={{width: windowWidth * 0.51, marginTop: 20}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: constants.FONT_SIZE.M,
              color: constants.COLOR.ORANGE,
            }}>
            See Serviceable Areas
          </Text>
        </ThrottledOpacity>
      </View>
    </>
  );
};
