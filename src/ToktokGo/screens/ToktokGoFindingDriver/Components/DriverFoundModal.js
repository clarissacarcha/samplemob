import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import User from '../../../../assets/images/user-icon.png';
import Vaccinated from '../../../../assets/images/vaccinated.png';
import Star from '../../../../assets/images/star.png';

const ImageWidth = (Dimensions.get('window').width - 190) / 2;

export const DriverFoundModal = ({
  driverData,
  booking,
  showDriverFoundModal,
  setShowDriverFoundModal,
  navigation,
  route,
}) => {
  const {popTo, decodedPolyline} = route.params;

  const navigateTo = () => {
    setShowDriverFoundModal(false);
    navigation.replace('ToktokGoOnTheWayRoute', {
      popTo: popTo + 1,
      decodedPolyline,
    });
  };

  const imageRender = () => {
    if (driverData?.user?.person?.avatarThumbnail) {
      return {uri: driverData?.user?.person?.avatarThumbnail};
    } else {
      return User;
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={showDriverFoundModal} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Driver Found</Text>
            <Image source={imageRender()} style={styles.profileImage} resizeMode="cover" />
            <Text style={styles.profileName}>{booking.driver?.name}</Text>
            <View style={styles.iconContainer}>
              <Text>{driverData?.overallAverageRating ? driverData.overallAverageRating : 'N/A'}</Text>
              <Image source={Star} style={styles.starStyles} resizeMode="contain" />
              {driverData?.user?.person?.covidVaccinationStatus?.description && (
                <Image source={Vaccinated} style={styles.vacineStyle} resizeMode="contain" />
              )}
            </View>
            <Text>
              {booking.driver?.vehicle?.make} {booking.driver?.vehicle?.model}{' '}
              {booking.driver?.vehicle?.bodyColor ? `(${booking.driver?.vehicle?.bodyColor})` : ''} ·{' '}
              {booking.driver?.vehicle?.plateNumber}
            </Text>
            <TouchableOpacity onPress={navigateTo} style={styles.cancelContainer}>
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  modalTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    marginBottom: 24,
  },
  profileImage: {
    height: ImageWidth,
    width: ImageWidth,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  profileName: {
    textTransform: 'capitalize',
    marginVertical: 8,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
  },
  starStyles: {
    height: 15,
    width: 15,
    marginRight: 8,
    marginLeft: 2,
  },
  vacineStyle: {
    height: 16,
    width: 57,
    borderRadius: 50,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
