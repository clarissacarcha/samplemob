/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, AddressContainer, Icon, AddressIconContainer, DashContainer, IconContainer} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import DashedLine from 'react-native-dashed-line';
import ContentLoader from 'react-native-easy-content-loader';

const OrderAddresses = (props: PropsType): React$Node => {
  const theme = useTheme();
  const {state} = props;

  const addressComponent = (title, address = '', landmark = '') => {
    return (
      <AddressIconContainer>
        {state && Object.keys(state).length > 0 ? (
          <React.Fragment>
            <StyledText>{title}</StyledText>
            {address.length > 0 && <StyledText color={theme.color.darkgray}>{address}</StyledText>}
            {landmark.length > 0 && <StyledText color={theme.color.gray}>{landmark}</StyledText>}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ContentLoader active title={false} pRows={2} pWidth={[180, '100%']} />
          </React.Fragment>
        )}
      </AddressIconContainer>
    );
  };

  const dashComponent = (height = 25) => {
    return (
      <DashContainer height={height}>
        <DashedLine axis="vertical" dashGap={2} dashColor={theme.color.lightgray} dashLength={3} height={20} />
      </DashContainer>
    );
  };

  const iconComponent = () => {
    return (
      <IconContainer>
        <Icon name="map-pin" color={theme.color.yellow} size={22} />
        {dashComponent()}
        <Icon name="map-marker-alt" color={theme.color.orange} size={17} />
      </IconContainer>
    );
  };

  return (
    <Container>
      {iconComponent()}
      <AddressContainer>
        {addressComponent(state?.shopDetails?.shopname, state?.shopDetails?.address)}
        {addressComponent(state?.address, '', state?.landmark)}
      </AddressContainer>
    </Container>
  );
};

export default OrderAddresses;
