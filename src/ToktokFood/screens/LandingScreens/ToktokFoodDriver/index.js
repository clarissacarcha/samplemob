import React from 'react';
import {View} from 'react-native';

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
      <DriverAnimationView status={2} />
      <DriverDetailsView status={2} />
    </View>
  );
};

export default ToktokFoodDriver;
