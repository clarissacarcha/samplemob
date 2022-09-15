/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, ContentTitle, SubText} from './Styled';

const TermsConditionsSectionCompositions = (props: PropsType): React$Node => {
  const {contents} = props;
  return (
    <Container>
      {!!contents.title && <ContentTitle>{contents.title}</ContentTitle>}
      <SubText>{contents.content}</SubText>
    </Container>
  );
};

export default TermsConditionsSectionCompositions;
