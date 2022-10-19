/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import type {PropsType} from './types';
import {TouchableOpacity} from 'react-native';
import {Container, Column, Image, Title, Text, NameText, Loader} from './Styled';
import {useTheme} from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Alert from 'toktokfood/components/Alert';
import {useNavigation} from '@react-navigation/native';

const CartIconText = (props: PropsType): React$Node => {
  const {
    id = 1,
    source = null,
    title = '',
    text = '',
    contactNumber = '',
    landmark = '',
    name = '',
    cartRefetch,
  } = props;
  const theme = useTheme();
  const navigation = useNavigation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const renderAlertComponent = () => (
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
        navigation.navigate('ToktokFoodAddressDetails', {isCart: true, cartRefetch});
      }}
    />
  );

  return (
    <React.Fragment>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setIsAlertVisible(true)} disabled={id !== 2}>
        <Container id={id}>
          <Image source={source} width={20} height={20} id={id} />
          <Column flex={1}>
            {title.length > 0 ? (
              <React.Fragment>
                <Title>{title}</Title>
                <Text>{text}</Text>
              </React.Fragment>
            ) : (
              <Column left={-10}>
                <Loader />
              </Column>
            )}
            {landmark.length > 0 && <Text landmark>{landmark}</Text>}
            {name.length > 0 && <NameText>{name}</NameText>}
            {contactNumber.length > 0 && <Text>{contactNumber}</Text>}
          </Column>
          {id === 2 && <AntDesign name="right" size={18} color={theme.color.orange} />}
        </Container>
      </TouchableOpacity>
      {renderAlertComponent()}
    </React.Fragment>
  );
};

export default CartIconText;
