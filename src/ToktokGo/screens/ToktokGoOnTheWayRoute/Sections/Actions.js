import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import constants from '../../../../common/res/constants';
import Cancel from '../../../../assets/icons/Cancelled.png';
import Message from '../../../../assets/images/messageIcon.png';
import Phone from '../../../../assets/images/phoneIcon.png';
export const Actions = () => {
  return (
    <View style={styles.Info}>
      <View
        style={{
          borderColor: constants.COLOR.ORANGE,
          borderWidth: 1,
          paddingVertical: 8,
          paddingHorizontal: 27,
          flexDirection: 'row',
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Image source={Phone} style={{height: 14, width: 9, marginRight: 10}} resizeMode="contain" />
        <Text style={{color: constants.COLOR.ORANGE}}>Call</Text>
      </View>
      <View
        style={{
          borderColor: constants.COLOR.ORANGE,
          borderWidth: 1,
          paddingVertical: 8,
          paddingHorizontal: 13,
          flexDirection: 'row',
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Image source={Message} style={{height: 12, width: 12, marginRight: 10}} resizeMode="contain" />
        <Text style={{color: constants.COLOR.ORANGE}}>Message</Text>
      </View>
      <View
        style={{
          borderColor: '#ED3A19',
          borderWidth: 1,
          paddingVertical: 8,
          paddingHorizontal: 17,
          flexDirection: 'row',
          borderRadius: 5,
          alignItems: 'center',
        }}>
        <Image source={Cancel} style={{height: 12, width: 12, marginRight: 10}} resizeMode="contain" />
        <Text style={{color: 'red'}}>Cancel</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 40,
  },
});
