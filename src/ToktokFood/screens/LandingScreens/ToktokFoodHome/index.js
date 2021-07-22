import React from 'react';
import {StyleSheet, View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import {StickyView} from './components';

// Hooks
import {useCategories, useUserLocation, useShops} from 'toktokfood/hooks';

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook
  useCategories(); // categories api
  useShops(); // shops api
  return (
    <View style={styles.container}>
      <HeaderImageBackground>
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
