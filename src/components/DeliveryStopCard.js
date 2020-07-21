/**
 * Displayed in Selected Delivery Details
 * Used to display Sender Details and Recipient Details
 */
import React from 'react';
import {View, Text, StyleSheet, Platform, Linking} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT} from '../res/constants';
import {YellowIcon, BlackIcon} from '../components/ui';

import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DeliveryStopCard = ({stop, index}) => {
  const labels = [['Sender', 'Details'], ['Recipient', 'Details']];

  const icons = [
    <YellowIcon set="FontAwesome5" name="map-pin" size={16} darkIcon />,
    <YellowIcon set="FontAwesome5" name="map-marker-alt" size={16} darkIcon />,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardShadow}>
        {/*------------------- STOP LABEL-------------------*/}
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
          {icons[index]}
          <Text style={{marginLeft: 10, color: DARK, fontWeight: 'bold'}}>
            {labels[index][0]} <Text style={{color: ORANGE}}>{labels[index][1]}</Text>
          </Text>
        </View>
        {/*------------------- ADDRESS -------------------*/}
        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: MEDIUM,
            padding: 20,
            paddingBottom: 0,
          }}>
          <Text style={{color: MEDIUM, fontSize: 14, flex: 1}}>{stop.formattedAddress}</Text>
          {/*------------------- ROUTE BUTTON -------------------*/}

          <View style={styles.actionIconBox}>
            <MCIcon
              name="directions"
              size={24}
              color={COLOR}
              onPress={() => {
                const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
                const latLng = `${stop.latitude},${stop.longitude}`;
                const label = stop.name;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                Linking.openURL(url);
              }}
            />
          </View>
        </View>
        {/*------------------- NAME -------------------*/}
        <View style={{flexDirection: 'row', padding: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold'}}>{stop.name}</Text>
            <Text style={{fontSize: 12, color: MEDIUM}}>{stop.mobile}</Text>
          </View>
          {/*------------------- DIALER BUTTON -------------------*/}
          <View style={styles.actionIconBox}>
            <MIcon
              name="call"
              size={24}
              color={COLOR}
              onPress={() => {
                const link = Platform.OS === 'android' ? `tel:${stop.mobile}` : `telprompt:${stop.mobile}`;
                Linking.openURL(link);
              }}
            />
          </View>
          <View style={{width: 20}} />
          <View style={styles.actionIconBox}>
            <MIcon
              name="sms"
              size={22}
              color={COLOR}
              onPress={() => {
                Linking.openURL(`sms:${stop.mobile}`);
              }}
            />
          </View>
        </View>
        {stop.landmark && (
          <View style={[styles.rowFlexibleHeight, {borderTopWidth: StyleSheet.hairlineWidth, borderColor: LIGHT}]}>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
              <YellowIcon set="FontAwesome5" name="landmark" size={16} containerStyle={{marginTop: 4}} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontWeight: 'bold'}}>Landmark</Text>
                <Text style={{paddingRight: 10, color: MEDIUM, fontSize: 11}}>
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>{stop.landmark}</Text>
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 20,
  },
  cardShadow: {
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
  actionIconBox: {
    backgroundColor: DARK,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // textAlign: 'center',
    // textAlignVertical: 'center',
  },

  rowFlexibleHeight: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
});
