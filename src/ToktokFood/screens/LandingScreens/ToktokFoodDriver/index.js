import React from 'react';
import {View, StyleSheet} from 'react-native';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView, DriverDetailsView} from './components';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';

// Utils
import {moderateScale} from 'toktokfood/helper/scale';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(83) : moderateScale(70),
};

const ToktokFoodDriver = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#FFFF'}}>
      <HeaderImageBackground customSize={CUSTOM_HEADER}>
        <HeaderTitle title="Place Order" />
      </HeaderImageBackground>
      <DriverAnimationView status={1} />
      <View style={styles.driverWrapper}>
        <DriverDetailsView status={1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  driverWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToktokFoodDriver;
