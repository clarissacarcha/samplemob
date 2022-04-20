import React from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import Graphics from '../../../assets/toktokgo/toktokgo-health-care-graphics.png';
import constants from '../../../common/res/constants';
import FAIcons from 'react-native-vector-icons/FontAwesome';

const ToktokGoHealthCare = ({navigation}) => {
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={Graphics} style={{flex: 0.6, width: undefined, height: undefined}} resizeMode={'contain'} />
        <View style={{flex: 1}}>
          <Text style={[styles.textBase, {color: constants.COLOR.BLACK}]}>
            <Text style={[styles.textBase, {color: constants.COLOR.YELLOW}]}>
              toktok<Text style={[styles.textBase, {color: constants.COLOR.ORANGE}]}>go</Text>
            </Text>{' '}
            Health Care
          </Text>
          <Text
            style={[
              styles.textContent,
              {
                marginTop: 16,
              },
            ]}>
            These guidelines are necessary to avoid attaining the virus and keeping the safety of everyone, please
            follow the guidelines:
          </Text>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 8}} />
            <Text style={styles.textContent}>Face mask is a must</Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 8}} />
            <Text style={styles.textContent}>
              If in case you feel sick or rather not feeling well better to stay at home to avoid spreading the virus
            </Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 8}} />
            <Text style={styles.textContent}>
              Vaccination card and/or travel pass shall always be readily available
            </Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 8}} />
            <Text style={styles.textContent}>
              Make sure that all of your colleagues that will ride the vehicle are fully vaccinated
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fabcontainer}>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.replace('ToktokGoBookingStart')}>
          <Text style={styles.fabtext}>Accept</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ToktokGoHealthCare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 32,
  },
  textBase: {
    fontSize: constants.FONT_SIZE.XL + 1,
    fontFamily: constants.FONT_FAMILY.REGULAR,
  },
  textContent: {
    fontSize: constants.FONT_SIZE.M,
    fontFamily: constants.FONT_FAMILY.REGULAR,
    color: constants.COLOR.BLACK,
  },
  textContainer: {
    marginLeft: 16,
    marginTop: 16,
    flexDirection: 'row',
  },
  fabcontainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: constants.COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 50,
    shadowOpacity: 1.0,
    elevation: 20,
  },
  fab: {
    backgroundColor: constants.COLOR.ORANGE,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11,
  },
  fabtext: {
    color: constants.COLOR.WHITE,
    fontFamily: constants.FONT_FAMILY.BOLD,
    fontSize: constants.FONT_SIZE.L,
  },
});
