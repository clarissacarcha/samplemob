import React from 'react';
import {Text} from 'react-native';
import constants from '../../common/res/constants';

export const ModalCustomDescription = ({children}) => {
  return (
    <Text
      style={{
        fontFamily: constants.FONT_FAMILY.REGULAR,
        fontSize: constants.FONT_SIZE.M,
        color: constants.COLOR.BLACK,
        textAlign: 'center',
      }}>
      {children}
    </Text>
  );
};
