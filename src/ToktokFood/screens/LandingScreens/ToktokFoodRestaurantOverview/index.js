import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text, TouchableOpacity} from 'react-native';
import {verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

// import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';

import {GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
import {COLOR, FONT, FONT_SIZE, SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
import {getWeekDay} from 'toktokfood/helper/strings';

const ToktokFoodRestaurantOverview = ({route}) => {
  const {item} = route.params;

  const navigation = useNavigation();

  const {hasOpen, nextOperatingHrs, operatingHours} = item;
  const {fromTime, day: nxtDay} = nextOperatingHrs;
  const {fromTime: currFromTime} = operatingHours;

  const [showOverlay, setShowOverlay] = useState(hasOpen === false);

  const displayNextOpeningHours = () => {
    const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));
    if (isAboutToOpen) {
      return (
        <Text style={styles.closeText}>
          Restaurant is currently closed. Please comeback at {moment(fromTime, 'hh:mm:ss').format('LT')}
        </Text>
      );
    }
    return (
      <Text style={styles.closeText}>
        Restaurant is currently closed. Please comeback on {getWeekDay(nxtDay, true)},{' '}
        {moment(fromTime, 'hh:mm:ss').add(1, 'day').format('MMMM DD')} at {moment(fromTime, 'hh:mm:ss').format('hh:mm A')}.
      </Text>
    );
  };

  const onNavigate = () => {
    setShowOverlay(false);
    navigation.goBack();
  };

  const CloseOverlay = (
    <Modal visible={showOverlay} transparent={true} animationType="fade" presentationStyle="overFullScreen">
      <View style={styles.content}>
        <View style={[styles.wrapper, styles.sheetBorder]}>
          <View style={styles.sheet}>
            {displayNextOpeningHours()}
            <TouchableOpacity style={styles.closeButton} onPress={() => onNavigate()}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      {CloseOverlay}
      <VerifyContextProvider>
        <View style={styles.container}>
          <StickyView />
          <FoodCart />
        </View>
      </VerifyContextProvider>
    </>
  );
};

export default ToktokFoodRestaurantOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    // backgroundColor: '#fff',
  },
  wrapper: {
    height: '21%',
    width: '101%',
    position: 'absolute',
    backgroundColor: COLOR.WHITE,
  },
  sheetBorder: {
    borderTopWidth: 3,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderColor: COLOR.ORANGE,
    marginHorizontal: -2,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 10,
  },
  closeText: {
    fontSize: 15,
    marginTop: 17,
    lineHeight: 20,
    fontFamily: FONT.BOLD,
    marginBottom: verticalScale(16),
  },
  closeButton: {
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE.BUTTON_HEIGHT,
    backgroundColor: '#FFA700',
    width: getDeviceWidth - 28,
  },
  buttonText: {
    color: COLOR.WHITE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
