import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity, Dimensions} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import User from '../../../../assets/images/user-icon.png';
import Vaccinated from '../../../../assets/images/vaccinated.png';
import Star from '../../../../assets/images/star.png';

const ImageWidth = (Dimensions.get('window').width - 210) / 2;

export const DriverFoundModal = ({showDriverFoundModal, setShowDriverFoundModal, navigation, route}) => {
  const {popTo, decodedPolyline} = route.params;
  const navigateTo = () => {
    setShowDriverFoundModal(false);
    navigation.push('ToktokGoOnTheWayRoute', {
      popTo: popTo + 1,
      decodedPolyline,
    });
  };

  return (
    <Modal animationType="fade" transparent={true} visible={showDriverFoundModal} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.modalTitle}>Driver Found</Text>
            <Image source={User} style={styles.profileImage} resizeMode="cover" />
            <Text style={styles.profileName}>Rick Sanchez</Text>
            <View style={styles.iconContainer}>
              <Text>5.0</Text>
              <Image source={Star} style={styles.starStyles} resizeMode="contain" />
              <Image source={Vaccinated} style={styles.vacineStyle} resizeMode="contain" />
            </View>
            <Text>Honda Civic (White) · DA963000 </Text>
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
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    marginBottom: 24,
  },
  profileImage: {
    height: ImageWidth,
    width: ImageWidth,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  profileName: {
    marginVertical: 8,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
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
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
