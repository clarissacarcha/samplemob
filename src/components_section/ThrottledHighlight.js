import React from 'react';
import {TouchableHighlight} from 'react-native';
import {useThrottle} from '../hooks';

export const ThrottledHighlight = (props) => {
  const {onPress = () => {}, delay = 2000, children = null, ...remainingProps} = props;

  const onPressThrottled = useThrottle(onPress, delay);

  return (
    <TouchableHighlight onPress={onPressThrottled} {...remainingProps}>
      {children}
    </TouchableHighlight>
  );
};
