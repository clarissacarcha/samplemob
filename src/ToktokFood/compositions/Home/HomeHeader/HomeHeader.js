/**
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import type {PropsType} from './types';
import {AddressContainer, DownIcon, Loader, StyledIcon, Row, Text, Column} from './Styled';
import {Badge} from 'react-native-elements';
// Components
import Header from 'toktokfood/components/Header';
import Alert from 'toktokfood/components/Alert';
import StyledText from 'toktokfood/components/StyledText';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';

// Hooks
import {useUserLocation, useGetCartItems} from 'toktokfood/hooks';

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
  // height: 60,
  flex: 1,
};

const customPopupMenuStyle = {
  optionsContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 45,
  },
};

const HomeHeader = (props: PropsType): React$Node => {
  useUserLocation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const theme = useTheme();
  const {location} = useSelector(state => state.toktokFood);
  const {cartData, cartRefetch} = useGetCartItems();
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (isFocused && cartRefetch) {
      cartRefetch();
    }
  }, [cartRefetch, isFocused]);

  const customOptionStyle = {
    optionWrapper: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider.active,
    },
  };

  const badgeContainerStyle = {
    position: 'absolute',
    top: -4,
    right: -4,
  };

  const badgeStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1,
  };

  const onSetLocationDetails = () => {
    if (cartData?.items?.length > 0) {
      setIsAlertVisible(true);
    } else {
      navigation.navigate('ToktokFoodAddressDetails');
    }
  };

  const onCartNavigate = () => navigation.navigate('ToktokFoodPlaceOrder');

  const AddressDetails = () => {
    return (
      <AddressContainer onPress={onSetLocationDetails}>
        <Row>
          <StyledText mode="bold" fontSize={13}>
            Delivery Address
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

  const renderMenuOptions = (style = {}, text, screen) => {
    return (
      <MenuOption customStyles={style} onSelect={() => navigation.navigate(screen)}>
        <Text>{text}</Text>
      </MenuOption>
    );
  };

  const CartOptions = () => {
    return (
      <Row>
        <Column>
          <StyledIcon icon="cart-outline" onPress={onCartNavigate} />
          {cartData?.items?.length > 0 && (
            <Badge
              value={cartData?.items?.length}
              status="error"
              containerStyle={badgeContainerStyle}
              badgeStyle={badgeStyle}
            />
          )}
        </Column>
        <Menu>
          <MenuTrigger>
            <StyledIcon />
          </MenuTrigger>
          <MenuOptions customStyles={customPopupMenuStyle}>
            {renderMenuOptions(customOptionStyle, 'Contact Us', 'ToktokFoodContactUs')}
            {renderMenuOptions(customOptionStyle, 'Privacy Policy', 'ToktokFoodPrivacyPolicy')}
            {renderMenuOptions({}, 'Terms and Conditions', 'ToktokFoodTermsAndConditions')}
          </MenuOptions>
        </Menu>
      </Row>
    );
  };

  return (
    <React.Fragment>
      <Header
        hasBack
        containerStyle={containerStyle}
        rightContainerStyle={rightContainerStyle}
        leftContainerStyle={leftContainerStyle}
        centerContainerStyle={centerContainerStyle}
        CenterComponent={AddressDetails}
        RightComponent={CartOptions}
      />
      <Alert
        isVisible={isAlertVisible}
        type="question"
        title="Change Location"
        subtitle="You will lose the items in your cart if you change location. Proceed?"
        buttonText="No"
        onPress={() => setIsAlertVisible(false)}
        buttonText2="Yes"
        onPress2={() => {
          setIsAlertVisible(false);
          navigation.navigate('ToktokFoodAddressDetails');
        }}
      />
    </React.Fragment>
  );
};

export default HomeHeader;
