import React from 'react';
import {View, Text} from 'react-native';
import { COLOR, FONT } from '../../../../../res/variables';
import {HeaderBack, HeaderTitle, HeaderRight} from '../../../../Components';

export const ToktokMallAddressesMenu = ({navigation}) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Address', '']} />,
    headerRight: () => <HeaderRight hidden={true} />
  });

  return (
    <View>
      <Text>Addresses</Text>
    </View>
  );
};
