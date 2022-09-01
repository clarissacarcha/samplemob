/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  Container,
  ContentContainer,
  ContentSubContainer,
  ContentImage,
  ContentTitle,
  ContentDescription,
  Label,
  SubText,
} from './Styled';

const ListItem = props => {
  return (
    <ContentContainer>
      <ContentImage
        resizeMode={props.resizeMode || 'contain'}
        source={props.imageSource ? props.imageSource : require('toktokwallet/assets/icons/magnifying.png')}
      />
      <ContentSubContainer>
        <ContentTitle>{props.title}</ContentTitle>
        <ContentDescription>{props.content}</ContentDescription>
      </ContentSubContainer>
    </ContentContainer>
  );
};

const HelpCentreMoneyProtection = (props: PropsType): React$Node => {
  const data = [
    {
      title: 'Regulated by the local monetary authority',
      content: 'Toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP).',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/bank.png'),
      resizeMode: 'contain',
    },
  ];

  return (
    <Container>
      <Label>Money Protection</Label>
      <SubText>
        All transactions via toktokwallet are successfully completed through One-time Password (OTP) and Transaction
        PIN. These added an extra layer of security that prevents others from compromising your toktokwallet account and
        the money that is stored in it.
      </SubText>
      {data.map((item, i) => (
        <ListItem
          title={item.title}
          content={item.content}
          imageSource={item.imageSource}
          resizeMode={item.resizeMode}
        />
      ))}
    </Container>
  );
};

export default HelpCentreMoneyProtection;
