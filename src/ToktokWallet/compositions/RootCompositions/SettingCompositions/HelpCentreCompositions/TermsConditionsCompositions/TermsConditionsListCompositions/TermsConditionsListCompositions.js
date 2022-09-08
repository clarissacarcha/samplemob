/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  Container,
  ContentTitle,
  SubText,
  SubContentContainer,
  ContentContainer,
  ContentText,
  SubContentWrapper,
  SubContentText,
} from './Styled';

const TermsConditionsListCompositions = (props: PropsType): React$Node => {
  const {contents} = props;
  return (
    <Container>
      <ContentTitle>{contents.title}</ContentTitle>
      {!!contents.content && <SubText>{contents.content}</SubText>}
      {typeof contents.listContent !== 'undefined' &&
        contents.listContent.map(v => {
          return (
            <ContentContainer>
              <SubText>
                {!!v.title && <ContentTitle>{v.title}</ContentTitle>}
                {!!v.content && <ContentText isBold={v.isContentBold}>{v.content}</ContentText>}
              </SubText>
              {typeof v.subContent !== 'undefined' && (
                <SubContentContainer hasContent={v.content}>
                  {v.subContent.map(subVal => (
                    <SubContentWrapper>
                      <ContentText isBold={subVal.isSubContentTitleBold}>{subVal.title} </ContentText>
                      <SubContentText>{subVal.content}</SubContentText>
                    </SubContentWrapper>
                  ))}
                </SubContentContainer>
              )}
            </ContentContainer>
          );
        })}
    </Container>
  );
};

export default TermsConditionsListCompositions;
