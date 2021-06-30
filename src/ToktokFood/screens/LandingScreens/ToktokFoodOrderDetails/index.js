import React from 'react';
import {View} from 'react-native';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';

const ToktokFoodOrderDetails = () => {
  return (
    <View>
      <HeaderImageBackground>
        <HeaderTitle title="Order Details" />
      </HeaderImageBackground>
    </View>
  );
};

export default ToktokFoodOrderDetails;
