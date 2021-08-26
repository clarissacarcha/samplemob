import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

// Fonts & Colors
import {COLOR} from 'res/variables';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale, scale, getStatusbarHeight} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(110 + getStatusbarHeight) : moderateScale(88),
  bgImage: Platform.OS === 'android' ? moderateScale(105 + getStatusbarHeight) : moderateScale(83),
};

const ToktokFoodFavorites = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderImageBackground customSize={CUSTOM_HEADER}>
          <HeaderTitle title="Favorites"/>
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
