/**
 * @format
 * @flow
 */

import React, {useMemo} from 'react';

import type {PropsType} from './types';
import {Button, ButtonText, Container} from './Styled';
import {throttle} from 'lodash';

const CustomButton = (props: PropsType): React$Node => {
  const {label, labelColor, btnStyle, btnColor, onPress, delay = 2000, hasShadow, disabled} = props;

  const onPressThrottled = useMemo(() => throttle(onPress, delay), [delay, onPress]);

  return (
    <Container hasShadow={hasShadow}>
      <Button onPress={onPressThrottled} style={btnStyle} btnColor={btnColor} disabled={disabled}>
        <ButtonText labelColor={labelColor}>{label}</ButtonText>
      </Button>
    </Container>
  );
};
export default CustomButton;
