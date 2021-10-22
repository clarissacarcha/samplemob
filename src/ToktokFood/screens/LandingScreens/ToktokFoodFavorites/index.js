import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
// Fonts & Colors
import { COLOR } from 'res/variables';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
// Utils
import { moderateScale } from 'toktokfood/helper/scale';


const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodFavorites = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground customSize={CUSTOM_HEADER}>
          <HeaderTitle titleOnly title="Favorites" />
        </HeaderImageBackground>
        <View style={[styles.container, styles.loaderWrapper]}>
          <ActivityIndicator color={COLOR.BLACK} size={25}/>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ToktokFoodFavorites;
