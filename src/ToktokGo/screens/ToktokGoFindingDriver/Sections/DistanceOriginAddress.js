import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import EIcon from 'react-native-vector-icons/Entypo';
import DestinationIcon from '../../../../assets/icons/DestinationIcon.png';
import OriginIcon from '../../../../assets/icons/OriginIcon.png';
import moment from 'moment';

export const DistanceOriginAddress = ({booking}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          {/*-------------------- ICONS --------------------*/}
          <View style={styles.iconsContainer}>
            <Image source={OriginIcon} resizeMode={'contain'} style={{width: 15, height: 15, marginBottom: 5}} />
            <View style={{overflow: 'hidden'}}>
              <EIcon name="dots-three-vertical" size={11} color={CONSTANTS.COLOR.MEDIUM} style={{marginLeft: 1}} />
              <EIcon name="dots-three-vertical" size={11} color={CONSTANTS.COLOR.MEDIUM} style={{marginLeft: 1}} />
            </View>
            <Image source={DestinationIcon} resizeMode={'contain'} style={{width: 15, height: 15, marginTop: 5}} />
          </View>
          <View style={{flex: 1}}>
            {/*-------------------- ORIGIN DETAILS --------------------*/}
            <View
              style={{
                flex: 1,
                marginBottom: 10,
              }}>
              <View style={styles.addressContainer}>
                <Text style={styles.landmarkTextStyle}>{booking.route.origin.addressBreakdown.city}</Text>
                <Text style={{fontSize: 11, color: '#525252'}}>{booking.route.origin.formattedAddress}</Text>
              </View>
            </View>
            {/*-------------------- DESTINATION DETAILS --------------------*/}
            <View style={styles.addressContainer}>
              <Text style={styles.landmarkTextStyle}>{booking.route.destinations[0].addressBreakdown.city}</Text>
              <Text style={styles.completeAddressTextStyle}>{booking.route.destinations[0].formattedAddress}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  iconsContainer: {
    justifyContent: 'center',
    paddingRight: 11,
    paddingBottom: 10,
  },
  addressContainer: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.BLACK,
    marginTop: 2,
  },
  landmarkTextStyle: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.BLACK,
  },
  completeAddressTextStyle: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
});
