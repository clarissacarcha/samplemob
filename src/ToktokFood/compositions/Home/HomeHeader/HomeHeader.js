/**
 * @format
 * @flow
 */

import React from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components';

import type {PropsType} from './types';
import {AddressContainer, Container, DownIcon, Loader, StyledIcon, Row} from './Styled';

// Components
import Header from 'toktokfood/components/Header';
import StyledText from 'toktokfood/components/StyledText';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';

// Static Header Style
const centerContainerStyle = {
  flex: 15,
};
const leftContainerStyle = {
  flex: 2,
};
const rightContainerStyle = {
  flex: 5,
  paddingTop: 4,
};
const containerStyle = {
  height: 60,
};

const HomeHeader = (props: PropsType): React$Node => {
  useUserLocation();

  const theme = useTheme();
  const {location} = useSelector(state => state.toktokFood);

  const AddressDetails = () => {
    return (
      <AddressContainer>
        <Row>
          <StyledText mode="bold" fontSize={13}>
            Home
          </StyledText>
          <DownIcon />
        </Row>

        {location?.address === undefined ? (
          <Loader />
        ) : (
          <StyledText color={theme.color.darkgray} fontSize={11} textProps={{numberOfLines: 1}}>
            {location.address}
          </StyledText>
        )}
      </AddressContainer>
    );
  };

  const CartOptions = () => {
    return (
      <Row>
        <StyledIcon icon="cart-outline" />
        <StyledIcon />
      </Row>
    );
  };

  return (
    <Container>
      <Header
        hasBack
        containerStyle={containerStyle}
        rightContainerStyle={rightContainerStyle}
        leftContainerStyle={leftContainerStyle}
        centerContainerStyle={centerContainerStyle}
        CenterComponent={AddressDetails}
        RightComponent={CartOptions}
      />
    </Container>
  );
};

export default HomeHeader;
