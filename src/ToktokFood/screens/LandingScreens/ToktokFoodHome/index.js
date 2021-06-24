import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import {StickyView} from './components';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';

const ToktokFoodHome = () => {
  useUserLocation(); // user location hook

  return (
    <SafeAreaView style={styles.container}>
      <HeaderImageBackground>
        <HeaderTitle />
        <HeaderSearchBox />
      </HeaderImageBackground>
      <StickyView />
    </SafeAreaView>
  );
};

export default ToktokFoodHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
