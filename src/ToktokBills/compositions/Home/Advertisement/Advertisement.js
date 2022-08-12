/**
 * @format
 * @flow
 */

import React, {memo, useState} from 'react';

import type {PropsType} from './types';
import FastImage from 'react-native-fast-image';
import {LoadingIndicator} from 'src/ToktokBills/components';
import {LogoImage, Display, Container, LoadingContainer, List, Slide} from './Styled';

const DisplayImage = memo(({item, index}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Display>
      {imageLoading && (
        <LoadingContainer>
          <LoadingIndicator isLoading={true} size="small" />
        </LoadingContainer>
      )}
      <LogoImage
        source={{
          uri: item.filename,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.stretch}
        onLoadStart={() => {
          setImageLoading(true);
        }}
        onLoadEnd={() => {
          setImageLoading(false);
        }}
      />
    </Display>
  );
});

export const Advertisement = (props: PropsType): React$Node => {
  const {ads, autoplay} = props;
  return (
    <Container>
      {autoplay ? (
        <Slide
          layout="default"
          data={ads}
          renderItem={({item, index}) => <DisplayImage item={item} index={index} />}
          autoplay={ads.length > 1 && true}
          loop={ads.length > 1 && true}
          autoplayDelay={0}
          autoplayInterval={5000}
        />
      ) : (
        <List
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ads}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => <DisplayImage item={item} index={index} />}
        />
      )}
    </Container>
  );
};
