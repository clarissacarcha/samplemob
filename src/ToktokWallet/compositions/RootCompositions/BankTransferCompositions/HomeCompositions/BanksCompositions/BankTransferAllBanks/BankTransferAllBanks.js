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
  DetailsContainer,
  LoadingContainer,
  LogoContainer,
  LogoImage,
  Title,
} from './Styled';

const BankTransferAllBanks = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const {item, screenLabel, onRefreshFavorite} = props;

  const onPress = () => {
    navigation.navigate('ToktokWalletBankTransferTransaction', {
      bankDetails: item,
      screenLabel,
      onRefreshFavorite,
      event: 'see all',
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <ButtonContainer onPress={onThrottledPress}>
      <ContentContainer>
        <LogoContainer>
          {imageLoading && item.image && (
            <LoadingContainer>
              <LoadingIndicator isLoading={true} size="small" />
            </LoadingContainer>
          )}
          <LogoImage
            source={{uri: item.image}}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </LogoContainer>
        <DetailsContainer>
          <Title>{item.name}</Title>
        </DetailsContainer>
      </ContentContainer>
    </ButtonContainer>
  );
};
export default BankTransferAllBanks;
