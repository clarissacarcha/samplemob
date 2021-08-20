import React, {useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import {StickyView} from './components';

// Hooks
import {useCategories, useUserLocation, useShops} from 'toktokfood/hooks';

import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';

import {useNavigation} from '@react-navigation/native';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(150 + getStatusbarHeight) : moderateScale(145),
  bgImage: Platform.OS === 'android' ? moderateScale(115 + getStatusbarHeight) : moderateScale(125),
};

const ToktokFoodHome = () => {
  useShops(); // shops api
  useCategories(); // categories api
  useUserLocation(); // user location hook

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle />
        <HeaderSearchBox />
      </HeaderImageBackground>
      <StickyView />
    </View>
  );
};

export default ToktokFoodHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
