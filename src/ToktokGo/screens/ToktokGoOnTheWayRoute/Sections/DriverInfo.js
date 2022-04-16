import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import constants from '../../../../common/res/constants';
import User from '../../../../assets/images/user-icon.png';
import Vaccinated from '../../../../assets/images/vaccinated.png';
import Star from '../../../../assets/images/star.png';
export const DriverInfo = () => {
  return (
    <View style={styles.Info}>
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 50,
        }}>
        <Image
          source={User}
          style={{height: 50, width: 50, borderRadius: 50, borderWidth: 2, borderColor: constants.COLOR.ORANGE}}
          resizeMode="cover"
        />
      </View>
      <View style={{marginHorizontal: 20, marginBottom: 16}}>
        <Text style={{fontFamily: constants.FONT_FAMILY.BOLD}}>Rick Sanchez</Text>
        <Text>Honda Civic (White) · DA963000</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>5.0</Text>
          <Image
            source={Star}
            style={{height: 15, width: 15, borderRadius: 50, marginRight: 8, marginLeft: 2}}
            resizeMode="contain"
          />
          <Image source={Vaccinated} style={{height: 16, width: 57, borderRadius: 50}} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Info: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#F7F7FA',
  },
});
