/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  Container,
  Title,
  LogsContainer,
  DashContainer,
  Dash,
  LogContainer,
  TextContainer,
  Icon,
  Text,
  DeliveryImageContainer,
  Image,
  ImageContainer,
  DeclinedText,
} from './Styled';
import Divider from 'toktokfood/components/Divider';
import moment from 'moment';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';

const OrderDeliveryLogs = (props: PropsType): React$Node => {
  const {state} = props;
  const isLoaded = state && Object.keys(state).length > 0;
  const theme = useTheme();

  const renderDeliveryImageComponent = (uri, dashVisible = true) => (
    <DeliveryImageContainer>
      {renderDashComponent(310)}
      <ImageContainer>
        <Image source={{uri}} />
      </ImageContainer>
    </DeliveryImageContainer>
  );

  const renderDashComponent = (height = 18, visible = true) => (
    <DashContainer height={height}>
      <Dash />
    </DashContainer>
  );

  const renderLogsComponent = (title, time) => {
    const isValid = time !== 'Invalid date';
    return (
      <LogContainer>
        <TextContainer>
          <Icon isValid={isValid} />
          <Text isValid={isValid}>{title}</Text>
        </TextContainer>
        {isValid && <StyledText color={theme.color.gray}>{moment(time).format('LLL')}</StyledText>}
      </LogContainer>
    );
  };

  const renderCancelledLogsComponent = () => {
    const date = state?.isdeclined ? state?.dateDeclined : state?.dateCancelled;
    return (
      <React.Fragment>
        {renderLogsComponent('Cancelled', date)}
        {renderDashComponent()}
        {renderLogsComponent('Order placed', state?.dateOrdered)}
        {state?.isdeclined ? (
          <DeclinedText>
            Order was cancelled by <DeclinedText mode="semibold">{state?.shopDetails?.shopname}</DeclinedText>
          </DeclinedText>
        ) : (
          <DeclinedText>You cancelled this order</DeclinedText>
        )}
      </React.Fragment>
    );
  };

  const renderDeliveryLogsComponent = () => (
    <React.Fragment>
      {renderLogsComponent('Order delivered', state?.dateShipped)}
      {state?.deliveryImgurl2 ? renderDeliveryImageComponent(state?.deliveryImgurl2) : renderDashComponent()}
      {renderLogsComponent(
        'On the way to recipient',
        state?.deliveryLogs?.length > 4 ? state?.deliveryLogs[4].createdAt : state?.dateShipped ?? 'Invalid date',
      )}
      {renderDashComponent()}
      {renderLogsComponent('Picked up order', state?.dateFulfilled)}
      {state?.deliveryImgurl ? renderDeliveryImageComponent(state?.deliveryImgurl) : renderDashComponent()}
      {renderLogsComponent('Preparing order', state?.dateBookingConfirmed)}
      {renderDashComponent()}
      {renderLogsComponent(
        'Finding driver',
        state?.serviceType === 'toktokfood' ? state?.dateOrderProcessed : state?.dateOrdered,
      )}
      {renderDashComponent()}
      {renderLogsComponent('Order placed', state?.dateOrdered)}
    </React.Fragment>
  );

  const renderPickUpLogsComponent = () => (
    <React.Fragment>
      {renderLogsComponent('Order picked up', state?.dateShipped)}
      {renderDashComponent()}
      {renderLogsComponent('Ready for pick up', state?.dateReadyPickup)}
      {renderDashComponent()}
      {renderLogsComponent('Preparing order', state?.dateOrderProcessed)}
      {renderDashComponent()}
      {renderLogsComponent('Order placed', state?.dateOrdered)}
    </React.Fragment>
  );

  const renderOrderLogsComponent = () => {
    const isDelivery = state?.orderIsfor === 1;
    const isCancelled = state?.orderStatus === 'c';
    if (isCancelled) {
      return renderCancelledLogsComponent();
    }
    if (isDelivery) {
      return renderDeliveryLogsComponent();
    }
    return renderPickUpLogsComponent();
  };

  if (isLoaded) {
    return (
      <Container>
        <Title>Order Log</Title>
        <Divider />
        <LogsContainer>{renderOrderLogsComponent()}</LogsContainer>
      </Container>
    );
  }
  return null;
};

export default OrderDeliveryLogs;
