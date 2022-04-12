import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';

export const DistanceOriginAddress = ({destination, origin}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          {/*-------------------- ICONS --------------------*/}
          <View style={styles.iconsContainer}>
            <FA5Icon name="map-pin" size={15} color={CONSTANTS.COLOR.YELLOW} style={{marginLeft: 2, marginBottom: 2}} />
            <View style={{overflow: 'hidden'}}>
              <EIcon name="dots-three-vertical" size={11} color={CONSTANTS.COLOR.MEDIUM} style={{marginLeft: 1}} />
              <EIcon name="dots-three-vertical" size={11} color={CONSTANTS.COLOR.MEDIUM} style={{marginLeft: 1}} />
            </View>
            <FA5Icon
              name="map-marker-alt"
              size={15}
              color={CONSTANTS.COLOR.ORANGE}
              style={{marginLeft: 1, paddingTop: 5}}
            />
          </View>
          <View style={{flex: 1}}>
            {/*-------------------- ORIGIN DETAILS --------------------*/}
            <View
              style={{
                flex: 1,
                marginBottom: 10,
              }}>
              <View style={styles.addressContainer}>
                <Text style={styles.landmarkTextStyle}>{origin.place.addressBreakdown.city}</Text>
                <Text style={{fontSize: 11, color: '#525252'}}>{origin.place.formattedAddress}</Text>
              </View>
            </View>
            {/*-------------------- DESTINATION DETAILS --------------------*/}
            <View style={styles.addressContainer}>
              <Text style={styles.landmarkTextStyle}>{destination.place.addressBreakdown.city}</Text>
              <Text style={styles.completeAddressTextStyle}>{destination.place.formattedAddress}</Text>
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
