/**
 * @format
 * @flow
 */

import React from 'react';
import {Avatar} from 'react-native-elements';
import {useRoute} from '@react-navigation/native';
import {useTheme} from 'styled-components';

import type {PropsType} from './types';
import {Column, Container, InfoContainer, InfoIcon, InfoText, Row} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

const ShopInfo = (props: PropsType): React$Node => {
  const route = useRoute();
  const theme = useTheme();

  const {address, estimatedDeliveryTime, estimatedDistance, logo, shopname} = route.params?.item;
  const shopBranch = `${shopname} - ${address}`;
  const deliveryTime = `${estimatedDeliveryTime} mins`;
  const distance = `${estimatedDistance} km`;

  return (
    <Container>
      <Avatar
        rounded
        size="medium"
        title={shopname[0]}
        source={{
          uri: logo,
        }}
      />

      <Column>
        <StyledText textProps={{numberOfLines: 3}} mode="bold" fontSize={18}>
          {shopBranch}
        </StyledText>
        <StyledText fontSize={12}>Available for pick-up and delivery</StyledText>

        <Row>
          <InfoIcon icon="time-outline" />
          <InfoText>{deliveryTime}</InfoText>
          <InfoIcon icon="map-outline" />
          <InfoText>{distance}</InfoText>
        </Row>
      </Column>

      <InfoContainer>
        <StyledText color={theme.color.orange} fontSize={14}>
          Shop Info
        </StyledText>
      </InfoContainer>
    </Container>
  );
};

export default ShopInfo;
