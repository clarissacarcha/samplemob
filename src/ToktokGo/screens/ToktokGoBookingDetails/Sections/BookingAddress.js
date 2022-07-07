import React from 'react';
import {Platform, Text, Image, View, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {YellowIcon} from '../../../components/ui';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Fontisto';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {APP_FLAVOR, DARK, LIGHT, MEDIUM} from '../../../../res/constants';
import {FONT} from '../../../../res/variables';
import constants from '../../../../common/res/constants';
import PhoneIcon from '../../../../assets/images/phoneIcon.png';
import MessageIcon from '../../../../assets/images/messageIcon.png';
import NavigateIcon from '../../../../assets/images/navigateIcon.png';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import OriginIcon from '../../../../assets/icons/OriginIcon.png';

const LocationDots = () => (
  <>
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
    <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}} />
  </>
);

const DeliveryStop = ({booking, stop}) => {
  const getDisplayAddress = ({stop, formatted}) => {
    if (stop.addressBreakdown && !formatted) {
      const {city, province} = stop.addressBreakdown;
      if (city) {
        if (province) {
          return (
            <View style={{width: 340}}>
              <Text>
                {city}, {province}
              </Text>
              <Text style={{color: constants.COLOR.ALMOST_BLACK, fontSize: constants.FONT_SIZE.S}}>
                {stop.formattedAddress}
              </Text>
            </View>
          );
        } else {
          return (
            <View style={{width: 340}}>
              <Text>{city}</Text>
              <Text style={{color: constants.COLOR.ALMOST_BLACK, fontSize: constants.FONT_SIZE.S}}>
                {stop.formattedAddress}
              </Text>
            </View>
          );
        }
      } else {
        return (
          <View style={{width: 340}}>
            <Text>{province}</Text>
            <Text style={{color: constants.COLOR.ALMOST_BLACK, fontSize: constants.FONT_SIZE.S}}>
              {stop.formattedAddress}
            </Text>
          </View>
        );
      }
    } else {
      return stop.formattedAddress;
    }
  };
  const navigateToStop = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${stop.latitude},${stop.longitude}`;
    const label = stop.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };
  const callStop = () => {
    const link = Platform.OS === 'android' ? `tel:${stop.mobile}` : `telprompt:${stop.mobile}`;
    Linking.openURL(link);
  };
  const messageStop = () => {
    Linking.openURL(`sms:${stop.mobile}`);
  };

  //   const displayDriverButtons = () => {
  //     if (delivery.tokPartnerBranchOrderId && sender) {
  //       return false;
  //     }
  //     return (
  //       <>
  //         <TouchableOpacity onPress={() => callStop()} style={styles.iconStyle}>
  //           <Image source={PhoneIcon} resizeMode={'contain'} style={{width: 10, height: 10}} />
  //         </TouchableOpacity>
  //         <TouchableOpacity onPress={() => messageStop()} style={styles.iconStyle}>
  //           <Image source={MessageIcon} resizeMode={'contain'} style={{width: 10, height: 10}} />
  //         </TouchableOpacity>
  //       </>
  //     );
  //   };
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10,
      }}>
      <View style={{marginRight: 5, width: '90%'}}>
        <Text
          style={{
            fontSize: constants.FONT_SIZE.M,
            fontFamily: FONT.REGULAR,
            color: constants.COLOR.BLACK,
          }}>
          {getDisplayAddress({stop: stop})}
        </Text>
        {booking.tag == 'ONGOING' && (
          <Text style={{fontSize: constants.FONT_SIZE.M, fontFamily: FONT.REGULAR, color: constants.COLOR.DARK}}>
            {stop.formattedAddress}
          </Text>
        )}
      </View>
      {/* {![1, 7].includes(delivery.status) && (
            <View style={{flex: 1, marginTop: 11, flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => navigateToStop()} style={styles.iconStyle}>
                    <Image 
                    source={NavigateIcon}
                    resizeMode={'contain'}
                    style={{ width: 10, height: 10}}
                    /> 
                </TouchableOpacity>
                {displayDriverButtons()}
            </View>)} */}
    </View>
  );
};

export const BookingAddress = ({booking}) => {
  return (
    <View style={[styles.card, {marginTop: booking.tag == 'ONGOING' ? 0 : 8}]}>
      {booking.tag == 'COMPLETED' && (
        <View style={{borderBottomWidth: 2, borderColor: constants.COLOR.LIGHT, width: '90%'}} />
      )}
      <View style={styles.lower}>
        {/* <View style={{top: 35, height: "65%", width: 34, alignItems: 'center', justifyContent:'space-between'}}>
                    
                    <FA5Icon name="map-pin" size={18} color={constants.COLOR.YELLOW} style={{marginLeft: 2.5,}} />
                    {delivery.status > 1 && (
                        <>
                            <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}}  />
                            <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}}  />
                            <EIcon name="dots-three-vertical" size={13} color={constants.COLOR.MEDIUM} style={{marginLeft: 1}}  />
                        </>
                    )}
                    <FA5Icon name="map-marker-alt" size={18} color={constants.COLOR.ORANGE} style={{marginLeft: 1.5 }} />
                </View> */}
        <View style={{flex: 1}}>
          {/*-------------------- SENDER DETAILS --------------------*/}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Image source={OriginIcon} resizeMode={'contain'} style={{height: 20, width: 20, marginRight: 10}} />
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  overflow: 'hidden',
                  height: '70%',
                  marginTop: 20,
                  zIndex: -999,
                  width: 20,
                }}>
                <LocationDots />
              </View>
            </View>
            <DeliveryStop stop={booking.route.origin} booking={booking} />
          </View>
          {/* <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} /> */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1}}>
            <Image
              source={DestinationIcon}
              resizeMode={'contain'}
              style={{height: 20, width: 20, marginRight: 10, marginLeft: 1}}
            />
            <DeliveryStop stop={booking.route.destinations[0]} booking={booking} />
          </View>
          {/*-------------------- RECIPIENT DETAILS --------------------*/}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: constants.COLOR.WHITE,
    alignItems: 'center',
  },
  upper: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  distance: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  time: {
    flex: 1,
    marginLeft: 15,
  },
  lower: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  iconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    padding: 0,
    borderWidth: 1,
    borderColor: constants.COLOR.ORANGE,
    borderRadius: 4,
    marginLeft: 5,
  },
});
