import React from 'react';
import {Text, View} from 'react-native';
import constants from '../../../../../common/res/constants';

export const WithoutTokwaMessage = () => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 35}}>
      <Text style={{fontFamily: constants.FONT_FAMILY.BOLD, fontSize: constants.FONT_SIZE.L}}>Account Deletion</Text>
      <Text
        style={{
          fontFamily: constants.FONT_FAMILY.REGULAR,
          fontSize: constants.FONT_SIZE.M,
          textAlign: 'center',
          marginTop: 8,
        }}>
        We are sorry to see you go! We like you to know that by deleting your account, you will permanently lose all
        your data such as reviews, profile information, and many more. After this, there is no turning back.
      </Text>
      <Text
        style={{
          fontFamily: constants.FONT_FAMILY.REGULAR,
          fontSize: constants.FONT_SIZE.M,
          textAlign: 'center',
          marginTop: 8,
        }}>
        If you are sure with this action, click the button below.
      </Text>
    </View>
  );
};
