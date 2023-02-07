/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {useTheme} from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {Container, Text, RadioContainer, Button, PickupText} from './Styled';
import {Modal} from 'toktokfood/components/Modal';
import Radio from 'toktokfood/components/Radio';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CartServiceType = (props: PropsType): React$Node => {
  const theme = useTheme();
  const {cartServiceType, setCartServiceType, allowPickup = 1, isPabiliMerchant = false} = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selected, setSelected] = useState(cartServiceType);

  const renderRadioSelection = (title, checked, disabled = false) => {
    const RightComponent = () => {
      if ((!allowPickup || isPabiliMerchant) && title === 'Pick-up') {
        return <PickupText>Restaurant not available for pick-up</PickupText>;
      }
      return null;
    };
    return (
      <Radio
        title={title}
        checked={checked}
        onPress={() => setSelected(title)}
        disabled={disabled}
        RightComponent={() => <RightComponent />}
      />
    );
  };

  const onConfirm = () => {
    setCartServiceType(selected);
    setIsModalVisible(false);
  };

  const onCloseModal = () => setIsModalVisible(false);

  return (
    <React.Fragment>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setIsModalVisible(true)}>
        <Container>
          <Feather name="calendar" size={16} color={theme.color.yellow} />
          <Text>{cartServiceType}</Text>
          <AntDesign name="right" size={18} color={theme.color.orange} />
        </Container>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        borderRadius={15}
        onBackButtonPress={onCloseModal}
        onBackdropPress={onCloseModal}>
        <RadioContainer>
          {renderRadioSelection('Delivery', selected === 'Delivery')}
          {renderRadioSelection('Pick-up', selected === 'Pick-up', !allowPickup || isPabiliMerchant)}
          <Button buttonText="Confirm" onPress={onConfirm} />
        </RadioContainer>
      </Modal>
    </React.Fragment>
  );
};

export default CartServiceType;
