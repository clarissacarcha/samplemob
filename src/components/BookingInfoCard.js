import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {COLOR, DARK, MEDIUM, LIGHT} from '../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const BookingInfoCard = ({delivery, onPress}) => {
  return (
    <View style={styles.pad}>
      <TouchableHighlight onPress={onPress} underlayColor={COLOR} style={styles.card}>
        <View style={styles.taskBox}>
          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            {/*-------------------- ICONS --------------------*/}
            <View style={{width: 40, justifyContent: 'center'}}>
              <FA5Icon name="map-pin" size={16} color={DARK} style={styles.iconBox} />
              <EIcon name="flow-line" size={26} color={DARK} />
              <FA5Icon name="map-marker-alt" size={16} color={COLOR} style={styles.iconBoxDark} />
            </View>
            <View style={{flex: 1}}>
              {/*-------------------- SENDER DETAILS --------------------*/}
              <View
                style={{
                  height: 50,
                  justifyContent: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{delivery.senderStop.name}</Text>
                <Text numberOfLines={1} style={{color: MEDIUM, fontSize: 10}}>
                  {delivery.senderStop.formattedAddress}
                </Text>
              </View>
              <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />
              {/*-------------------- RECIPIENT DETAILS --------------------*/}
              <View style={{height: 50, justifyContent: 'center'}}>
                {delivery.recipientStop.name ? (
                  <>
                    <Text style={{fontWeight: 'bold'}}>{delivery.recipientStop.name}</Text>
                    <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                      {delivery.recipientStop.formattedAddress}
                    </Text>
                  </>
                ) : (
                  <Text style={{fontWeight: 'bold'}}>Recipient</Text>
                )}
              </View>
            </View>
          </View>
          {/*---------------------------------------- ROUTE DETAILS ----------------------------------------*/}
          <View style={styles.directionsBox}>
            {/*-------------------- DISTANCE --------------------*/}
            <View style={styles.directionDetail}>
              <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
              <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                {parseFloat(delivery.distance).toFixed(2)}
                <Text style={{color: MEDIUM}}> km</Text>
              </Text>
            </View>
            {/*-------------------- DURATION --------------------*/}
            <View style={styles.directionDetail}>
              <MCIcon name="timelapse" size={16} color={'white'} style={styles.iconBox} />
              <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                {parseFloat(delivery.duration).toFixed(0)}
                <Text style={{color: MEDIUM}}> min</Text>
              </Text>
            </View>
            {/*-------------------- PRICE --------------------*/}
            <View style={styles.directionDetail}>
              <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />
              <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱{delivery.price}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  pad: {
    padding: 10,
  },
  card: {
    borderRadius: 10,
  },
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  directionsBox: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
