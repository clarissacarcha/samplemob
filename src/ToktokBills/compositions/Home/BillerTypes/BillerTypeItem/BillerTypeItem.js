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
import {ButtonContainer, Description, LoadingContainer, LogoContainer, LogoImage} from './Styled';
import {more_ic} from 'toktokbills/assets';

const BillerTypeItem = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);

  const {index, item, showMore, onPressItem} = props;
  const {icon, name} = item;
  const condition = index === 11 && showMore;

  const onPress = () => {
    condition ? onPressItem(index) : navigation.navigate('ToktokBiller', {billType: item});
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
          source={condition ? more_ic : {uri: icon}}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </LogoContainer>
      <Description>{condition ? 'More...' : name}</Description>
    </ButtonContainer>
  );
};
export default BillerTypeItem;
