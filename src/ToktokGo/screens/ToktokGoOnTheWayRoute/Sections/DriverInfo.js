import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import constants from '../../../../common/res/constants';
import User from '../../../../assets/images/user-icon.png';
import Vaccinated from '../../../../assets/images/vaccinated.png';
import Star from '../../../../assets/images/star.png';

export const DriverInfo = ({booking, driverData}) => {
  const imageRender = () => {
    if (driverData?.user?.person?.avatarThumbnail) {
      return {uri: driverData?.user?.person?.avatarThumbnail};
    } else {
      return User;
    }
  };

  return (
    <View style={styles.Info}>
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 50,
        }}>
        <Image
          source={imageRender()}
          style={{height: 50, width: 50, borderRadius: 50, borderWidth: 2, borderColor: constants.COLOR.ORANGE}}
          resizeMode="cover"
        />
      </View>
      <View style={{marginHorizontal: 20, marginBottom: 16}}>
        <Text style={{fontFamily: constants.FONT_FAMILY.SEMI_BOLD, textTransform: 'capitalize'}}>
          {booking.driver?.name}
        </Text>
        <Text>
          {booking.driver?.vehicle?.make} {booking.driver?.vehicle?.model}{' '}
          {booking.driver?.vehicle?.bodyColor ? `(${booking.driver?.vehicle?.bodyColor})` : ''} ·{' '}
          {booking.driver?.vehicle?.plateNumber}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{driverData?.overallAverageRating ? driverData.overallAverageRating : 'N/A'}</Text>
          <Image
            source={Star}
            style={{height: 15, width: 15, borderRadius: 50, marginRight: 8, marginLeft: 2}}
            resizeMode="contain"
          />
          {driverData?.user?.person?.covidVaccinationStatus?.description && (
            <Image source={Vaccinated} style={{height: 16, width: 57, borderRadius: 50}} resizeMode="contain" />
          )}
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
