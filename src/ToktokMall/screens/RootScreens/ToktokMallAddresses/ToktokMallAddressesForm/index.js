import React from 'react';
import {View, Text} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';

export const ToktokMallAddressesForm = ({navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['New Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    <View>
      <Text>Add Address</Text>
    </View>
  );
};
