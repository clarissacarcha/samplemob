/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import type {PropsType} from './types';
import {
  Container,
  Row,
  Icon,
  Image,
  Column,
  CashInButton,
  ErrorContainer,
  LimitContainer,
  LimitText,
  CreateAccountText,
  PaymentSelectionContainer,
} from './Styled';
import StyledText from 'toktokfood/components/StyledText';
import {useTheme} from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {toktokwallet_ic, cash_ic} from 'toktokfood/assets/images';
import {useGetUserWallet, useGetActivities} from 'toktokfood/hooks';
import ContentLoader from 'react-native-easy-content-loader';
import {Modal} from 'toktokfood/components/Modal';
import Divider from 'toktokfood/components/Divider';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const MAX_AMOUNT_LIMIT_WITH_TOKWA = 3000;
const MAX_AMOUNT_LIMIT_WITHOUT_TOKWA = 2000;

const CartPaymentMethod = (props: PropsType): React$Node => {
  const {
    cartPaymentMethod,
    setCartPaymentMethod,
    setCartPaymentMethodCoordinates,
    animation = {},
    setUserWallet = ({}) => {},
    isInsufficientBalance = false,
    amountText = 0,
    setErrorVoucherMessage = string => null,
  } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [numberOfCompletedOrders, setNumberOfCompletedOrders] = useState(0);
  const {data, refetch, loading, customerWallet} = useGetUserWallet();
  const {data: completedOrders} = useGetActivities('s', 50);
  const theme = useTheme();

  useEffect(() => {
    if (completedOrders?.getTransactions?.length > 0) {
      const completed = completedOrders?.getTransactions?.filter(order => order.paymentMethod === 'COD');
      if (completed.length > 0) {
        setNumberOfCompletedOrders(completed.length);
      }
    }
  }, [completedOrders]);

  useEffect(() => {
    if (cartPaymentMethod === 'toktokwallet') {
      setUserWallet(data);
    } else {
      setUserWallet({});
    }
  }, [cartPaymentMethod, data, setUserWallet]);

  const onHighlight = {
    backgroundColor: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.color.white, theme.color.lightYellow],
    }),
  };

  const onCashIn = ({balance}) => {
    refetch();
  };

  const onToktokWalletCashInNavigate = () => {
    setIsModalVisible(false);
    navigation.navigate('ToktokWalletPaymentOptions', {
      amount: 0,
      onCashIn: onCashIn,
    });
  };

  const onToktokWalletRegisterNavigate = () => {
    setIsModalVisible(false);
    navigation.navigate('ToktokWalletVerification');
  };

  const onPaymentMethodSelection = pm => {
    if (cartPaymentMethod !== pm) {
      setErrorVoucherMessage('');
    }
    setCartPaymentMethod(pm);
    setIsModalVisible(false);
  };

  const isButtonDisabled = () => {
    if (customerWallet && amountText > MAX_AMOUNT_LIMIT_WITH_TOKWA) {
      return true;
    }
    if (!customerWallet && amountText > MAX_AMOUNT_LIMIT_WITHOUT_TOKWA) {
      return true;
    }
    if (!customerWallet && numberOfCompletedOrders >= 2) {
      return true;
    }
    return false;
  };

  const renderLimitComponent = () => {
    if (customerWallet && amountText > MAX_AMOUNT_LIMIT_WITH_TOKWA) {
      return (
        <LimitContainer>
          <LimitText>Order exceeded the limit of ₱{MAX_AMOUNT_LIMIT_WITH_TOKWA} worth of items.</LimitText>
        </LimitContainer>
      );
    }
    if (!customerWallet && amountText > MAX_AMOUNT_LIMIT_WITHOUT_TOKWA) {
      return (
        <LimitContainer>
          <LimitText>Order exceeded the limit of ₱{MAX_AMOUNT_LIMIT_WITHOUT_TOKWA} worth of items.</LimitText>
        </LimitContainer>
      );
    }
    if (!customerWallet && numberOfCompletedOrders >= 2) {
      return (
        <LimitContainer>
          <LimitText>We’re sorry but you already ordered twice via cash.</LimitText>
        </LimitContainer>
      );
    }
    return null;
  };

  const buttonWrapper = (component, pm = 'toktokwallet', isDisabled = false) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPaymentMethodSelection(pm)} disabled={isDisabled}>
      {component()}
    </TouchableOpacity>
  );

  const renderCashComponent = () => {
    return (
      <Row>
        <Row opacity={isButtonDisabled() ? 0.5 : 1}>
          <Image source={cash_ic} selected="cash" />
          <Column>
            <StyledText color={theme.color.yellow}>Cash</StyledText>
          </Column>
        </Row>
        {renderLimitComponent()}
      </Row>
    );
  };

  const renderToktokWalletComponent = () => {
    const coloredText = () => (
      <StyledText color={theme.color.yellow}>
        toktok<StyledText color={theme.color.orange}>wallet</StyledText>
      </StyledText>
    );

    if (!customerWallet) {
      return (
        <Row>
          <Row>
            <Image source={toktokwallet_ic} selected="toktokwallet" />
            <Column>{coloredText()}</Column>
          </Row>
          {renderCashInButton()}
        </Row>
      );
    }

    if (customerWallet?.status === 1) {
      if (loading) {
        return <ContentLoader active title={false} pRows={1} pWidth={90} pHeight={22} />;
      }

      return (
        <React.Fragment>
          <Row>
            <Row>
              <Image source={toktokwallet_ic} selected="toktokwallet" />
              <Column>
                {coloredText()}
                <StyledText fontSize={11} color={theme.color.darkgray}>
                  Balance: &#x20B1;{data?.getMyAccount?.wallet?.balance}
                </StyledText>
              </Column>
            </Row>
            {renderCashInButton()}
          </Row>
          {isInsufficientBalance && (
            <ErrorContainer>
              <Icon name="exclamationcircle" color={theme.color.red} size={12} marginRight={7} />
              <StyledText fontSize={11} color={theme.color.red}>
                Insufficient Balance
              </StyledText>
            </ErrorContainer>
          )}
        </React.Fragment>
      );
    }
  };

  const renderCashInButton = () => {
    if (!customerWallet) {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={onToktokWalletRegisterNavigate}>
          <CreateAccountText>Create your toktokwallet{'\n'}account now!</CreateAccountText>
        </TouchableOpacity>
      );
    }

    return <CashInButton onPress={onToktokWalletCashInNavigate} />;
  };

  const renderSelectedPaymentMethod = () =>
    cartPaymentMethod === 'toktokwallet' ? renderToktokWalletComponent() : renderCashComponent();

  const onCloseModal = () => setIsModalVisible(false);

  const renderModalComponent = () => (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={isModalVisible}
      borderRadius={15}
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}>
      <PaymentSelectionContainer>
        {buttonWrapper(renderToktokWalletComponent, 'toktokwallet')}
        <Column marginVertical={20}>
          <Divider />
        </Column>
        {buttonWrapper(renderCashComponent, 'cash', isButtonDisabled())}
      </PaymentSelectionContainer>
    </Modal>
  );

  const getCoordinates = ({nativeEvent}) => {
    setCartPaymentMethodCoordinates(nativeEvent.layout.y);
  };

  return (
    <Container onLayout={getCoordinates} style={onHighlight}>
      <Row marginBottom={20}>
        <StyledText mode="semibold" color={theme.color.darkgray}>
          Payment Method
        </StyledText>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setIsModalVisible(true)}>
          <Row>
            <StyledText color={theme.color.orange}>See All</StyledText>
            <Icon name="right" size={13} color={theme.color.orange} marginLeft={5} />
          </Row>
        </TouchableOpacity>
      </Row>
      {renderSelectedPaymentMethod()}
      {renderModalComponent()}
    </Container>
  );
};

export default CartPaymentMethod;
