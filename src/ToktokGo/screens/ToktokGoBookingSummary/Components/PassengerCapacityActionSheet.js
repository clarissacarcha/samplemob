import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import ProtectionIMG from '../../../../assets/images/Protection.png';
import CONSTANTS from '../../../../common/res/constants';

export const PassengerCapacityActionSheet = ({}) => {
  return (
    <ActionSheet id="passenger_capacity" overlayColor="none">
      <View style={styles.container}>
        <Image source={ProtectionIMG} resizeMode={'contain'} style={styles.dimensions} />
        <Text style={styles.title}>Passenger Capacity</Text>
        <Text style={styles.description}>
          To ensure social distancing, we are limiting the number of passengers on each vehicle.
        </Text>
        <Text style={styles.description}>How many of you are taking this ride?</Text>
        <View style={styles.divider} />
        <TouchableOpacity onPress={() => SheetManager.hide('passenger_capacity')}>
          <Text>Just me</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={() => SheetManager.hide('passenger_capacity')}>
          <Text style={{color: CONSTANTS.COLOR.DARK}}>2 of us</Text>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', height: 10, backgroundColor: 'white', position: 'absolute', bottom: 0}} />
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    right: 4,
    width: '102%',
    borderWidth: 3,
    borderTopColor: CONSTANTS.COLOR.ORANGE,
    borderLeftColor: CONSTANTS.COLOR.ORANGE,
    borderRightColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 15,
    // backgroundColor: 'red',
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dimensions: {
    width: 120,
    height: 140,
  },
  title: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    margin: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 2,
    height: 2,
    width: '60%',
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginVertical: 16,
  },
});
