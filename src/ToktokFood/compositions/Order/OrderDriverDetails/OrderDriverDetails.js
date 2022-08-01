/**
 * @format
 * @flow
 */

import React from 'react';
import {useTheme} from 'styled-components';
import type {PropsType} from './types';
import {Container, Title, Row, AvatarContainer, InfoContainer} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import Divider from 'toktokfood/components/Divider';
import {Avatar} from 'react-native-elements';

const OrderDriverDetails = (props: PropsType): React$Node => {
  const {state} = props;
  const theme = useTheme();
  const name = `${state?.driver?.user?.person?.firstName} ${state?.driver?.user?.person?.lastName}`;
  const vehicle = `${state?.driver?.vehicle?.brand?.brand} ${state?.driver?.vehicle?.model?.model}`;
  const plateNumber = `${state?.driver?.vehicle?.plateNumber}`;
  return (
    <Container>
      <Title>Driver Details</Title>
      <Divider />
      <Row>
        <AvatarContainer>
          <Avatar
            rounded
            source={state?.driver?.user?.person?.avatar ? {uri: state?.driver?.user?.person?.avatar} : {}}
            size={64}
          />
        </AvatarContainer>
        <InfoContainer>
          <Title name>{name}</Title>
          <StyledText color={theme.color.darkgray}>
            {vehicle} &#183; {plateNumber}
          </StyledText>
        </InfoContainer>
      </Row>
    </Container>
  );
};

export default OrderDriverDetails;
