/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import {View} from 'react-native';
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

  const {item} = props;

  const onPress = () => {
    navigation.navigate('ToktokWalletCashOutOTCTransaction', {otcPartnerDetails: item});
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <View>
      <ButtonContainer onPress={onThrottledPress}>
        <ContentContainer>
          <LogoContainer>
            {imageLoading && item.logo && (
              <LoadingContainer>
                <LoadingIndicator isLoading={true} size="small" />
              </LoadingContainer>
            )}
            <LogoImage
              source={{uri: item.logo}}
              resizeMode={FastImage.resizeMode.contain}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </LogoContainer>
          <DetailsContainer>
            <Title>{item.description}</Title>
          </DetailsContainer>
        </ContentContainer>
      </ButtonContainer>
    </View>
  );
};
export default BankTransferAllBanks;
