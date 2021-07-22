import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useThrottle} from 'src/hooks';

export const ThrottledWithoutFeedback = (props) => {
  const {onPress = () => {}, delay = 2000, children = null, ...remainingProps} = props;

  const onPressThrottled = useThrottle(onPress, delay);

  return (
    <TouchableWithoutFeedback onPress={onPressThrottled} {...remainingProps}>
      {children}
    </TouchableWithoutFeedback>
  );
};
