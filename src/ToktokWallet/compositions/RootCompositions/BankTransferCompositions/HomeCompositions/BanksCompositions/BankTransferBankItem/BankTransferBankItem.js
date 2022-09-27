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

  const {item, onPressItem} = props;
  // const {icon, name} = item;

  const onPress = () => {
    onPressItem(item);
  };

  const onThrottledPress = useThrottle(onPress, 2000);

  // return null;
  return (
    <ButtonContainer onPress={onThrottledPress}>
      <LogoContainer>
        {item?.image && imageLoading && (
          <LoadingContainer>
            <LoadingIndicator isLoading={true} size="small" />
          </LoadingContainer>
        )}
        <LogoImage
          source={{uri: item?.image}}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </LogoContainer>
      <Description>{item.name}</Description>
    </ButtonContainer>
  );
};
export default BankTransferBankItem;
