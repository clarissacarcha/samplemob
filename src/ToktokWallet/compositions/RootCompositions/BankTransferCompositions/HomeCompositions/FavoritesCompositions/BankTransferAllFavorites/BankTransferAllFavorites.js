/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import FastImage from 'react-native-fast-image';

import {LoadingIndicator} from 'toktokbills/components';
import type {PropsType} from './types';
import {
  ButtonContainer,
  ContentContainer,
  Description,
  DetailsContainer,
  HeartButton,
  HeartIcon,
  LoadingContainer,
  LogoContainer,
  LogoImage,
  Title,
} from './Styled';

const BankTransferAllFavorites = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const {item, onPressFavorite, onRefreshFavorite} = props;
  const {accountName, accountNumber, bank, id} = item.node;
  const {name, image} = bank;
  const isFavorite = true;

  const onPress = () => {
    navigation.navigate('ToktokWalletBankTransferTransaction', {
      bankDetails: bank,
      favoriteDetails: {
        id,
        accountName,
        accountNumber,
      },
      onRefreshFavorite,
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <ButtonContainer onPress={onThrottledPress}>
      <ContentContainer>
        <LogoContainer>
          {imageLoading && image && (
            <LoadingContainer>
              <LoadingIndicator isLoading={true} size="small" />
            </LoadingContainer>
          )}
          <LogoImage
            source={{uri: image}}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </LogoContainer>
        <DetailsContainer>
          <Title>{name}</Title>
          <Description>{accountName}</Description>
          <Description>{accountNumber}</Description>
        </DetailsContainer>
      </ContentContainer>
      <HeartButton onPress={onPressFavorite}>
        <HeartIcon isFavorite={isFavorite} />
      </HeartButton>
    </ButtonContainer>
  );
};
export default BankTransferAllFavorites;
