/**
 * @format
 * @flow
 */

import React from 'react';
import {Avatar} from 'react-native-elements';
import {useRoute} from '@react-navigation/native';
import {useTheme} from 'styled-components';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';

import type {PropsType} from './types';
import {
  Column,
  Container,
  Text,
  InfoIcon,
  InfoText,
  Row,
  SubContainer,
  VoucherContainer,
  FlatList,
  Title,
  SubTitle,
  VoucherParentContainer,
} from './Styled';

import StyledText from 'toktokfood/components/StyledText';
import {Image, View} from 'react-native';
import {shop_voucher, voucher_border} from '../../../assets/images';
import {useSelector} from 'react-redux';

const ShopInfo = (props: PropsType): React$Node => {
  const route = useRoute();
  const theme = useTheme();
  const {location} = useSelector(s => s.toktokFood);

  const {
    address,
    estimatedDeliveryTime,
    estimatedDistance,
    logo,
    shopname,
    allowPickup,
    shopVoucher = [],
  } = route.params?.item;
  const shopBranch = `${shopname} - ${address}`;
  const deliveryTime = `${estimatedDeliveryTime} mins`;
  const distance = `${estimatedDistance} km`;

  const copyToClipboard = item => {
    Clipboard.setString(item.voucherCode);
    Toast.show('Voucher Code Copied!');
  };

  return (
    <Container>
      <SubContainer voucher={shopVoucher.length !== 0}>
        <Avatar rounded size="medium" title={shopname[0]} source={{uri: logo}} />
        <Column>
          <StyledText textProps={{numberOfLines: 2}} mode="semibold" fontSize={18}>
            {shopBranch}
          </StyledText>
          <Text>{!allowPickup ? 'Available for delivery only' : 'Available for pick-up and delivery'}</Text>

          <Row>
            <InfoIcon icon="time-outline" />
            <InfoText>{deliveryTime}</InfoText>
            <InfoIcon icon="map-outline" />
            <InfoText>{distance}</InfoText>
          </Row>
        </Column>
      </SubContainer>

      {shopVoucher.length !== 0 && (
        <VoucherParentContainer>
          <Title>Voucher Code</Title>
          <SubTitle>Applies to all products.</SubTitle>
          <FlatList
            data={shopVoucher}
            renderItem={({item}) => (
              <VoucherContainer onPress={() => copyToClipboard(item)}>
                <Image source={voucher_border} style={{position: 'absolute', zIndex: 1, left: -5}} />
                <Image source={shop_voucher} style={{marginLeft: 18, marginRight: 14, height: 50, width: 50}} />
                <View>
                  <Title>{item.voucherCode}</Title>
                  <SubTitle color="#9E9E9E">Valid until {item.validUntil}</SubTitle>
                </View>
              </VoucherContainer>
            )}
          />
        </VoucherParentContainer>
      )}

      {/* <InfoContainer>
        <StyledText color={theme.color.orange} fontSize={14}>
          Shop Info
        </StyledText>
      </InfoContainer> */}
    </Container>
  );
};

export default ShopInfo;
