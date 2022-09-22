/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {useThrottle} from 'src/hooks';
import FastImage from 'react-native-fast-image';
import {LoadingIndicator} from 'toktokwallet/components';
import type {PropsType} from './types';
import {ButtonContainer, Description, LoadingContainer, LogoContainer, LogoImage} from './Styled';

const BankTransferBankItem = (props: PropsType): React$Node => {
  const [imageLoading, setImageLoading] = useState(true);

  const {index, item, onPressItem} = props;
  const {icon, name} = item;

  const onPress = () => {
    onPressItem(index);
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  return (
    <ButtonContainer onPress={onThrottledPress}>
      <LogoContainer>
        {imageLoading && (
          <LoadingContainer>
            <LoadingIndicator isLoading={true} size="small" />
          </LoadingContainer>
        )}
        <LogoImage
          source={{uri: icon}}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </LogoContainer>
      <Description>{name}</Description>
    </ButtonContainer>
  );
};
export default BankTransferBankItem;
