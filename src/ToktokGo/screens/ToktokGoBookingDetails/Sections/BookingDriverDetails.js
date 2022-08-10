import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text, Linking} from 'react-native';
import EIcons from 'react-native-vector-icons/Entypo';
import CONSTANTS from '../../../../common/res/constants';

import PhoneIcon from '../../../../assets/images/phoneIcon.png';
import MessageIcon from '../../../../assets/images/messageIcon.png';
import NavigateIcon from '../../../../assets/images/navigateIcon.png';
import User from '../../../../assets/images/user-icon.png';
import VaccinatedIcon from '../../../../assets/images/vaccinated.png';
import StarIcon from '../../../../assets/images/star.png';
import {ThrottledOpacity} from '../../../../components_section';

export const BookingDriverDetails = ({booking, driverData}) => {
  // const navigateToStop = () => {
  //   const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  //   const latLng = `${stop.latitude},${stop.longitude}`;
  //   const label = stop.name;
  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });

  //   Linking.openURL(url);
  // };

  const callStop = () => {
    // const link = Platform.OS === 'android' ? `tel:${stop.mobile}` : `telprompt:${stop.mobile}`;
    const link =
      Platform.OS === 'android' ? `tel:${booking.driver.mobileNumber}` : `telprompt:${booking.driver.mobileNumber}`;
    Linking.openURL(link);
  };

  const messageStop = () => {
    // Linking.openURL(`sms:${stop.mobile}`);
    Linking.openURL(`sms:${booking.driver.mobileNumber}`);
  };

  const imageRender = () => {
    if (driverData?.user?.person?.avatarThumbnail) {
      return {uri: driverData?.user?.person?.avatarThumbnail};
    } else {
      return User;
    }
  };

  return (
    <>
      <Text style={styles.titleCard}>Driver Details</Text>
      <View style={styles.contentCard}>
        <View style={styles.imageContainer}>
          <Image source={imageRender()} resizeMode={'cover'} style={styles.middleImageContent} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailName}>{booking.driver.name}</Text>
          <Text style={styles.detailVehicle}>
            {booking.driver?.vehicle?.make} {booking.driver?.vehicle?.model}{' '}
            {booking.driver?.vehicle?.bodyColor ? `(${booking.driver?.vehicle?.bodyColor})` : ''} ·{' '}
            {booking.driver?.vehicle?.plateNumber}
          </Text>
          <View style={styles.ratingContainer}>
            <Text>{driverData?.overallAverageRating ? driverData.overallAverageRating : 'N/A'}</Text>
            <Image source={StarIcon} resizeMode={'contain'} style={styles.starIconDetail} />
            {driverData?.user?.person?.covidVaccinationStatus?.description && (
              <Image source={VaccinatedIcon} resizeMode={'contain'} style={styles.vaccinatedIconDetail} />
            )}
          </View>
        </View>
        <View style={styles.iconsContainer}>
          <ThrottledOpacity delay={500} onPress={messageStop} style={[styles.iconContainer, {marginRight: 8}]}>
            <Image source={MessageIcon} resizeMode={'contain'} style={styles.iconDimensions} />
          </ThrottledOpacity>
          <ThrottledOpacity delay={500} onPress={callStop} style={styles.iconContainer}>
            <Image source={PhoneIcon} resizeMode={'contain'} style={styles.iconDimensions} />
          </ThrottledOpacity>
          {/* <TouchableOpacity onPress={navigateToStop} style={styles.iconContainer}>
            <Image source={NavigateIcon} resizeMode={'contain'} style={styles.iconDimensions} />
          </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleCard: {
    marginTop: 16,
    marginLeft: 16,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  contentCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: '17%',
  },
  detailsContainer: {
    flexDirection: 'column',
    width: '53%',
  },
  detailName: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    textTransform: 'capitalize',
  },
  detailVehicle: {
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  starIconDetail: {
    width: 15,
    height: 15,
    marginHorizontal: 3,
  },
  vaccinatedIconDetail: {
    marginLeft: 5,
    width: 54,
    height: 15,
  },
  middleImageContent: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '30%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    padding: 0,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 4,
  },
  iconDimensions: {
    width: 15,
    height: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
});
