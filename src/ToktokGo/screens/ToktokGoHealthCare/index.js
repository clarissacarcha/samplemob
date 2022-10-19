import React from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import GradientBackground from '../../../assets/toktokgo/toktokgo-gradient-background.png';
import Graphics from '../../../assets/toktokgo/toktokgo-health-care-graphics.png';
import CONSTANTS from '../../../common/res/constants';
import FAIcons from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {connect, useDispatch, useSelector} from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const ToktokGoHealthCare = ({navigation, route, constants}) => {
  const {voucherData} = route.params;
  const onPress = () => {
    if (constants.show1022GoRates == 1) {
      const date = moment(new Date()).format('MMM D, YYYY');
      AsyncStorage.setItem('ToktokGoHealthCare', date);
      navigation.replace('ToktokGoNewGuidelines', {voucherData});
    } else {
      const date = moment(new Date()).format('MMM D, YYYY');
      AsyncStorage.setItem('ToktokGoHealthCare', date);
      navigation.replace('ToktokGoBookingStart', {voucherData});
    }
  };
  return (
    <ImageBackground source={GradientBackground} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={Graphics} style={{flex: 0.6, width: undefined, height: undefined}} resizeMode={'contain'} />
        <View style={{flex: 1, width: windowWidth * 0.9}}>
          <Text style={[styles.textBase, {color: CONSTANTS.COLOR.BLACK}]}>
            <Text style={[styles.textBase, {color: CONSTANTS.COLOR.YELLOW}]}>
              toktok<Text style={[styles.textBase, {color: CONSTANTS.COLOR.ORANGE}]}>go</Text>
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
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 6}} />
            <Text style={styles.textContent}>Face mask is a must</Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 6}} />
            <Text style={styles.textContent}>
              If in case you feel sick or rather not feeling well better to stay at home to avoid spreading the virus
            </Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 6}} />
            <Text style={styles.textContent}>
              Vaccination card and/or travel pass shall always be readily available
            </Text>
          </View>
          <View style={styles.textContainer}>
            <FAIcons name="circle" size={5} style={{marginRight: 5, marginTop: 6}} />
            <Text style={styles.textContent}>
              Make sure that all of your colleagues that will ride the vehicle are fully vaccinated
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.fabcontainer}>
        <TouchableOpacity style={styles.fab} onPress={onPress}>
          <Text style={styles.fabtext}>Accept</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ToktokGoHealthCare);

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
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
  },
  textContent: {
    fontSize: CONSTANTS.FONT_SIZE.M,
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.BLACK,
  },
  textContainer: {
    marginLeft: 10,
    marginTop: 16,
    flexDirection: 'row',
  },
  fabcontainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.2,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
  fab: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 11,
  },
  fabtext: {
    color: CONSTANTS.COLOR.WHITE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.L,
  },
});
