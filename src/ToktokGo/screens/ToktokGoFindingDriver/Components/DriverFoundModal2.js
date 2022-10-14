import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import User from '../../../../assets/images/user-icon.png';
import Vaccinated from '../../../../assets/images/vaccinated.png';
import Star from '../../../../assets/images/star.png';
import driverProfile from '../../../../assets/toktokgo/driverProfile.png';
import normalize from 'react-native-normalize';
import {ProgressBar} from './ProgressBar';

const ImageWidth = (Dimensions.get('window').width - 190) / 2;
const windowWidth = Dimensions.get('window').width;

export const DriverFoundModal2 = ({driverFoundModal, findAnotherDriver}) => {
  //   const {popTo, decodedPolyline} = route.params;

  //   const navigateTo = () => {
  //     setShowDriverFoundModal(false);
  //     navigation.replace('ToktokGoOnTheWayRoute', {
  //       popTo: popTo + 1,
  //       decodedPolyline,
  //     });
  //   };

  //   const imageRender = () => {
  //     if (driverData?.user?.person?.avatarThumbnail) {
  //       return {uri: driverData?.user?.person?.avatarThumbnail};
  //     } else {
  //       return User;
  //     }
  //   };

  return (
    <Modal animationType="fade" transparent={true} visible={driverFoundModal} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                marginTop: -14,
                marginHorizontal: -9.5,
                position: 'absolute',
                width: windowWidth * 0.745,
              }}>
              <ProgressBar />
            </View>
            <Image source={driverProfile} style={styles.profileImage} resizeMode="cover" />
            <Text style={styles.modalTitle}>Driver Found</Text>
            <View style={{marginTop: 15, width: windowWidth * 0.65}}>
              <Text style={{textAlign: 'center', fontSize: normalize(14)}}>
                Your toktok driver may take some time to arrive at pick-up location. Estimated waiting time is{' '}
                <Text style={{fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD, fontSize: normalize(14)}}>15 minutes.</Text>{' '}
                Willing to wait po?
              </Text>
            </View>
            <TouchableOpacity style={styles.yesContainer}>
              <Text style={styles.textStyle}>Yes, I’m willing</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={findAnotherDriver} style={styles.findAnotherContainer}>
              <Text style={styles.textStyle2}>Find Another Driver</Text>
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
    marginTop: 15,
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
  yesContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  findAnotherContainer: {
    width: '100%',
    marginTop: 10,
    backgroundColor: CONSTANTS.COLOR.WHITE,
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
  textStyle2: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
});
