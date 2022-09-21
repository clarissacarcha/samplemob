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
  OtcPartner,
} from './Styled';

const CashOutOtcPartnerDetails = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const {item, title = '', isSearch} = props;

  const onPress = content => {
    navigation.navigate('ToktokWalletCashOutOTCTransaction', {otcPartnerDetails: content});
  };

  const onThrottledPress = useThrottle(content => onPress(content), 2000);

  const displayContent = content => {
    return (
      <ButtonContainer onPress={() => onThrottledPress(content)}>
        <ContentContainer>
          <LogoContainer>
            {imageLoading && content.logo && (
              <LoadingContainer>
                <LoadingIndicator isLoading={true} size="small" />
              </LoadingContainer>
            )}
            <LogoImage
              source={{uri: content.logo}}
              resizeMode={FastImage.resizeMode.contain}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </LogoContainer>
          <DetailsContainer>
            <Title>{content.description}</Title>
          </DetailsContainer>
        </ContentContainer>
      </ButtonContainer>
    );
  };

  return (
    <View>
      {!isSearch && <OtcPartner>{title}</OtcPartner>}
      {isSearch
        ? displayContent(item)
        : item[title].map(content => {
            return displayContent(content);
          })}
    </View>
  );
};
export default CashOutOtcPartnerDetails;
