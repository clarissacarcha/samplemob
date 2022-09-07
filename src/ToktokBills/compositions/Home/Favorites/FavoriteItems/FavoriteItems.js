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
  LoadingContainer,
  LogoContainer,
  LogoImage,
  Title,
} from './Styled';

const FavoriteItems = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const {item} = props;
  const {billItemId, billItem, id, firstFieldValue, secondFieldValue} = item.node;
  const {descriptions, logo, billType} = billItem;

  const onPress = () => {
    navigation.navigate('ToktokBillsPaymentProcess', {
      billItemId: billItemId,
      billType: billType,
      favoriteDetails: {
        id,
        firstFieldValue,
        secondFieldValue,
      },
    });
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <ButtonContainer onPress={onThrottledPress}>
      <ContentContainer>
        <LogoContainer>
          {imageLoading && logo && (
            <LoadingContainer>
              <LoadingIndicator isLoading={true} size="small" />
            </LoadingContainer>
          )}
          <LogoImage
            source={{uri: logo}}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
        </LogoContainer>
        <DetailsContainer>
          <Title>{descriptions}</Title>
          <Description>{secondFieldValue}</Description>
          <Description>{firstFieldValue}</Description>
        </DetailsContainer>
      </ContentContainer>
    </ButtonContainer>
  );
};
export default FavoriteItems;
