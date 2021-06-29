import React from 'react';
import {View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import {DriverAnimationView} from './components';

const ToktokFoodDriver = () => {
  return (
    <View>
      <HeaderImageBackground>
        <HeaderTitle title="Finding Driver" />
      </HeaderImageBackground>

      <DriverAnimationView />
    </View>
  );
};

export default ToktokFoodDriver;
