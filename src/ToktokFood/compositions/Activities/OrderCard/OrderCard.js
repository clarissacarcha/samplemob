/**
 * @format
 * @flow
 */

import React from 'react';
import type {PropsType} from './types';
import {useTheme} from 'styled-components';
import {
  Container,
  RefNumContainer,
  Column,
  Row,
  Icon,
  BottomContainer,
  Image,
  Title,
  Subtitle,
  Button,
  CustomLoader,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import Divider from 'toktokfood/components/Divider';
import {timer_ic, carbon_x, carbon_check, calendar_ic} from 'toktokfood/assets/images';
import moment from 'moment';
import OrderPaymentMethod from '../../Order/OrderPaymentMethod/OrderPaymentMethod';
import ContentLoader from 'react-native-easy-content-loader';
import {useNavigation} from '@react-navigation/native';

const OrderCard = (props: PropsType): React$Node => {
  const {data} = props;
  const navigation = useNavigation();
  const isLoaded = data && Object.keys(data).length > 0;
  const theme = useTheme();

  const onNavigate = () => {
    navigation.navigate('ToktokFoodOrder', {referenceNum: data?.referenceNum, orderStatus: data?.orderStatus});
  };

  const renderReferenceNumberComponent = () => {
    var source;
    var status;
    switch (data?.orderStatus) {
      case 's':
        source = carbon_check;
        status = data?.orderIsfor === 1 ? 'Order delivered' : 'Order picked up';
        break;
      case 'c':
        source = carbon_x;
        status = 'Cancelled';
        break;
      default:
        source = timer_ic;
        if (data?.orderIsfor === 1) {
          const isDriverOntheWay = data?.deliveryLogs?.find(logs => logs.status === 5);
          const isDriverPickedUp = data?.deliveryLogs?.find(logs => logs.status === 4);
          if (isDriverOntheWay !== undefined) {
            status = 'On the way to recipient';
          } else if (isDriverPickedUp !== undefined) {
            status = 'Picked up order';
          } else if (data?.dateBookingConfirmed !== 'Invalid date') {
            status = 'Preparing order';
          } else {
            status = 'Order placed';
          }
        } else {
          if (data?.orderStatus === 'rp') {
            status = 'Ready for pick up';
          } else {
            status = 'Order placed';
          }
        }
        break;
    }
    return (
      <RefNumContainer>
        <Column>
          {isLoaded ? (
            <React.Fragment>
              <Title>
                Order ID{' '}
                <StyledText mode="semibold" color={theme.color.yellow}>
                  {' '}
                  {data?.referenceNum}
                </StyledText>
              </Title>
              <Subtitle>{moment(data?.dateOrdered).format('LLL')}</Subtitle>
            </React.Fragment>
          ) : (
            <ContentLoader active title={false} pRows={2} pWidth={[180, 120]} />
          )}
        </Column>
        <Column flex={1} alignItems="flex-end">
          {isLoaded ? (
            <Row>
              <Icon source={source} orderStatus={data?.orderStatus} />
              <StyledText>{status}</StyledText>
            </Row>
          ) : (
            <CustomLoader active title={false} pRows={1} pWidth={100} pHeight={18} />
          )}
        </Column>
      </RefNumContainer>
    );
  };

  const renderOrderTypeComponent = () => {
    if (isLoaded) {
      return (
        <Row>
          <Icon source={calendar_ic} />
          <StyledText>{data?.orderIsfor === 1 ? 'Delivery: Now' : 'Pick up: Now'}</StyledText>
        </Row>
      );
    }

    return <ContentLoader active title={false} pRows={1} pWidth={100} />;
  };

  const renderShopInfoComponent = () => {
    if (isLoaded) {
      return (
        <Row>
          <Image source={{uri: data?.shopDetails?.logo}} />
          <Column>
            <Title width="95%">{data?.shopDetails?.shopname}</Title>
            <Subtitle>{data?.shopDetails?.address}</Subtitle>
          </Column>
        </Row>
      );
    }
    return <ContentLoader avatar aShape="square" active title={false} pRows={3} pWidth={[120, '100%', 50]} />;
  };

  const renderPaymentMethodComponent = () => {
    if (isLoaded) {
      return (
        <Row justifyContent="space-between">
          <OrderPaymentMethod type={data?.paymentMethod?.toLowerCase()} />
          <StyledText mode="semibold" color={theme.color.orange}>
            Total: &#x20B1;{parseFloat(data?.totalAmount + data?.originalShippingFee).toFixed(2)}
          </StyledText>
        </Row>
      );
    }
    return (
      <Row justifyContent="center" paddingHorizontal={10}>
        <ContentLoader active title={false} pRows={1} pWidth={120} />
        <Column>
          <CustomLoader right="10%" active title={false} pRows={1} pWidth={80} />
        </Column>
      </Row>
    );
  };

  return (
    <Button onPress={onNavigate}>
      <Container>
        {renderReferenceNumberComponent()}
        <BottomContainer>
          {renderOrderTypeComponent()}
          <Divider marginVertical={20} />
          {renderShopInfoComponent()}
          <Divider marginVertical={20} />
          {renderPaymentMethodComponent()}
        </BottomContainer>
      </Container>
    </Button>
  );
};

export default OrderCard;
