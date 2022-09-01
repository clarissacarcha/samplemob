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

const HelpCentreLayeredSecurity = (props: PropsType): React$Node => {
  const data = [
    {
      title: 'Fraud Prevention',
      content: 'Your account transactions are protected 24/7 by a Fraud Detection Engine.',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/shield.png'),
      resizeMode: 'contain',
    },
    {
      title: 'OTP/TPIN for Online Transactions',
      content:
        'For safer and secure online transactions, toktokwallet integrates security features such as a One-time Password (OTP) for validation and authentication of every e-money transaction.',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/phone.png'),
      resizeMode: 'contain',
    },
    {
      title: 'Instant Payment Alerts',
      content: 'SMS, Push Notifications, and Emails are sent out as a receipt of confirmation to every transaction.',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/bell.png'),
      resizeMode: 'contain',
    },
    {
      title: 'Data Encryption',
      content: 'All data are encrypted to keep information protected and secure.',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/data.png'),
      resizeMode: 'contain',
    },
    {
      title: 'Data Privacy',
      content:
        'Your provided personal information is kept in a database where accessing, use for external gain, and sharing is not allowed except for the agreed purposes only such as online transactions where personal information is needed.',
      imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/privacy_new.png'),
      resizeMode: 'contain',
    },
  ];

  return (
    <Container>
      <Label>Layered Security</Label>
      <SubText>
        Toktokwallet has its multi-layered security features that prevent threats intrusions, keeping your personal
        information and transaction details safe and protected.
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

export default HelpCentreLayeredSecurity;
