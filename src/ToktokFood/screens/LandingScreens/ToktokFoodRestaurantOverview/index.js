import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text, TouchableOpacity, Dimensions} from 'react-native';
import {verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

const phoneDimensions = Dimensions.get('window');

// import {useSelector} from 'react-redux';

import {StickyView} from './components';
import {FoodCart, VerifyContextProvider} from './components';
import Header from 'toktokfood/components/Header';

import {GET_SHOP_DETAILS} from 'toktokfood/graphql/toktokfood';
import {COLOR, FONT, FONT_SIZE, SIZE} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

// import {useNavigation} from '@react-navigation/native';

// import moment from 'moment';
// import {getWeekDay} from 'toktokfood/helper/strings';

const ToktokFoodRestaurantOverview = ({route}) => {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <VerifyContextProvider>
        {/* <CloseOverlay /> */}
        {/* <ProductOverlay /> */}
        <View style={styles.container}>
          <Header hasBack />
          {/* <StickyView onCheckShop={v => setShowCart(v)} /> */}
          {showCart && <FoodCart />}
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
  },
  wrapper: {
    width: phoneDimensions.width + 10,
    paddingLeft: 5,
    paddingBottom: 20,
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
    marginHorizontal: 0,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 10,
  },
  closeText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT.BOLD,
    marginVertical: 20,
    textAlign: 'center',
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
