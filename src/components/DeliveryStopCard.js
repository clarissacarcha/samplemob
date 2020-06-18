/**
 * Displayed in Selected Delivery Details
 * Used to display Sender Details and Recipient Details
 */
import React from 'react';
import {View, Text, StyleSheet, Platform, Linking} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE, LIGHT} from '../res/constants';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DeliveryStopCard = ({stop, index}) => {
  const labels = [['Sender', 'Details'], ['Recipient', 'Details']];

  const icons = [
    <FA5Icon name="map-pin" size={16} color={DARK} style={styles.iconBox} />,
    <FA5Icon name="map-marker-alt" size={16} color={DARK} style={styles.iconBox} />,
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
          <MCIcon
            name="directions"
            size={24}
            color={COLOR}
            style={styles.actionIconBox}
            onPress={() => {
              const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
              const latLng = `14.560668065523032,121.055769827216860`;
              const label = stop.name;
              const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
              });

              Linking.openURL(
                'https://www.waze.com/ul?ll=14.560668065523032%2C121.055769827216860&navigate=yes&zoom=17',
              );
            }}
          />
        </View>
        {/*------------------- NAME -------------------*/}
        <View style={{flexDirection: 'row', padding: 20}}>
          <Text style={{fontWeight: 'bold', flex: 1}}>{stop.name}</Text>
          {/*------------------- DIALER BUTTON -------------------*/}
          <MIcon
            name="call"
            size={24}
            color={COLOR}
            style={[styles.actionIconBox, {marginHorizontal: 20}]}
            onPress={() => {
              const link = Platform.OS === 'android' ? `tel:${stop.mobile}` : `telprompt:${stop.mobile}`;
              Linking.openURL(link);
            }}
          />
          <MIcon
            name="sms"
            size={22}
            color={COLOR}
            style={styles.actionIconBox}
            onPress={() => {
              Linking.openURL(`sms:${stop.mobile}`);
            }}
          />
        </View>
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
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
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
});
