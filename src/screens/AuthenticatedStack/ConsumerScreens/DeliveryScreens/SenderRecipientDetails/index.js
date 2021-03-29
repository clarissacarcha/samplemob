import React from 'react';
import {View, StyleSheet} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../../../components';
import {WhiteButton} from '../../../../../revamp';

//SELF IMPORTS
import Greeting from './Greeting';

const SenderRecipientDetails = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Toktok', 'Delivery']} />,
  });
  return (
    <View style={styles.screenBox}>
      <Greeting />
      <WhiteButton
        label="Pickup Time"
        prefixSet="Material"
        prefixName="access-time"
        suffixSet="Material"
        suffixName="arrow-forward"
        onPress={() => {}}
      />
    </View>
  );
};

export default SenderRecipientDetails;

const styles = StyleSheet.create({
  screenBox: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
});
