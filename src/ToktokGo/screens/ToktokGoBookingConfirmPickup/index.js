import React, {useRef, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, BackHandler} from 'react-native';
import {Pickup, ConfirmPickupButton, NotesToDriver} from './Sections';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {SheetManager} from 'react-native-actions-sheet';

const ToktokGoBookingConfirmPickup = ({navigation, route}) => {
  const {popTo} = route.params;
  const dropDownRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.pop(popTo);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress); // detect back button press
      return () => BackHandler.removeEventListener('hardwareBackPress');
    }, []),
  );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop(popTo)}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <Pickup />
      <View style={styles.card}>
        <NotesToDriver dropDownRef={dropDownRef} navigation={navigation} popTo={popTo} />
        <ConfirmPickupButton navigation={navigation} />
      </View>
    </View>
  );
};

export default ToktokGoBookingConfirmPickup;

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 3,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,
    borderBottomColor: constants.COLOR.WHITE,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    // zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    // marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: constants.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButton: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
