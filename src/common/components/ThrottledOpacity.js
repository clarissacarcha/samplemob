import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useThrottle} from 'src/hooks';

export const ThrottledOpacity = (props) => {
  const {onPress = () => {}, delay = 2000, children = null, ...remainingProps} = props;

  const onPressThrottled = useThrottle(onPress, delay);

  return (
    <TouchableOpacity onPress={onPressThrottled} {...remainingProps}>
      {children}
    </TouchableOpacity>
  );
};
