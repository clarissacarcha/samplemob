import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import CustomIcon from '../../../../../Components/Icons';

export const Rate = ({rating, setRating, value}) => {
  let orange = '#FFC833';
  let gray = 'rgba(33, 37, 41, 0.1)';
  return (
    <TouchableWithoutFeedback onPress={() => setRating(value)}>
      <CustomIcon.FoIcon
        name="star"
        size={30}
        color={rating >= value ? orange : gray}
        style={{paddingHorizontal: 12}}
      />
    </TouchableWithoutFeedback>
  );
};
