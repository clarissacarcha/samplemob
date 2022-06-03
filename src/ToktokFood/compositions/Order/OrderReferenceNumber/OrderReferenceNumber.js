/**
 * @format
 * @flow
 */

import React from 'react';
// import {Image} from 'react-native';
import type {PropsType} from './types';
import {Container, Row, Image} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import {carbon_delivery, carbon_check, carbon_x} from 'toktokfood/assets/images';
import ContentLoader from 'react-native-easy-content-loader';

const OrderReferenceNumber = (props: PropsType): React$Node => {
  const {state} = props;
  const isLoaded = state && Object.keys(state).length > 0;
  const theme = useTheme();
  var status = '';
  var image;

  switch (state?.orderStatus) {
    case 's':
      status = 'Completed';
      image = carbon_check;
      break;
    case 'c':
      status = 'Cancelled';
      image = carbon_x;
      break;
    default:
      status = 'Ongoing';
      image = carbon_delivery;
      break;
  }

  const renderLoaderComponent = width => {
    return <ContentLoader active title={false} pRows={1} pWidth={width} pHeight={12} />;
  };

  const renderReferenceNumberComponent = () => {
    if (isLoaded) {
      return (
        <StyledText mode="semibold" color={theme.color.yellow}>
          {`  ${state?.referenceNum}`}
        </StyledText>
      );
    }
    return renderLoaderComponent(115);
  };

  const renderStatusComponent = () => {
    if (isLoaded) {
      return (
        <Row justifyContent="flex-end" alignItems="center">
          <Image source={image} />
          <StyledText>{`  ${status}`}</StyledText>
        </Row>
      );
    }
    return (
      <Row position="absolute" right={10} alignItems="center">
        {renderLoaderComponent(90)}
      </Row>
    );
  };

  return (
    <Container>
      <Row>
        <StyledText mode="semibold">Order ID </StyledText>
        {renderReferenceNumberComponent()}
      </Row>
      {renderStatusComponent()}
    </Container>
  );
};

export default OrderReferenceNumber;
