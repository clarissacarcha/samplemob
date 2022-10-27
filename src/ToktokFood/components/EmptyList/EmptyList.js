/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, EmptyImg, EmptyTitle} from './Styled';

import StyledText from 'toktokfood/components/StyledText/StyledText';

const EmptyList = (props: PropsType): React$Node => {
  const {image, subtitle = '', title, style} = props;
  return (
    <Container style={style}>
      <EmptyImg source={image} />

      <EmptyTitle>{title}</EmptyTitle>
      <StyledText>{subtitle}</StyledText>
    </Container>
  );
};

export default EmptyList;
