import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import {BackButton, PrimaryButton} from '../../../components_section/Buttons';
import {HeaderTitle} from '../../../components_section/Texts';

const DeveloperScreen = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <BackButton navigation={navigation} />,
    headerTitle: () => <HeaderTitle label={'Developer Mode'} />,
  });
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16, paddingTop: 16}}>
      <PrimaryButton label={`Primary button`} />
    </ScrollView>
  );
};

export default DeveloperScreen;
