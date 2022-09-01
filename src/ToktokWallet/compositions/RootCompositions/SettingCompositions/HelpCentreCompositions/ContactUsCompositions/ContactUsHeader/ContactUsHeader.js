/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Title, SubText, SupportContainer, SupportButton, SupportImage, SupportLabel} from './Styled';
import {Linking} from 'react-native';
import {contact_us} from 'toktokwallet/assets';

const SupportDetails = ({logo, label, url}) => {
  const openUrl = () => {
    Linking.openURL(url);
  };

  return (
    <SupportButton onPress={openUrl}>
      <SupportImage source={logo} />
      <SupportLabel>{label}</SupportLabel>
    </SupportButton>
  );
};

const ContactUsHeader = (props: PropsType): React$Node => {
  return (
    <Container>
      <Title>How can we help you?</Title>
      <SubText>
        Toktokwallet Team provides only the best service experience to our customers. Should you have any questions and
        concerns, you may reach us through the following details:
      </SubText>
      <SupportContainer>
        <SupportDetails url="tel:(623) 8424 8617" logo={contact_us.phone} label="(632) 8424 8617" />
        <SupportDetails
          url="mailto:support@toktokwallet.ph?subject=Talk%20To%20Us&body=How%20can%20we%20help%20you%20ka-toktok?"
          logo={contact_us.email}
          label="support@toktokwallet.ph"
        />
      </SupportContainer>
    </Container>
  );
};

export default ContactUsHeader;
