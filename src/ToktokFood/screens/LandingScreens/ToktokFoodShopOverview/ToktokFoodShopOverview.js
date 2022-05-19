/**
 * @format
 * @flow
 */

import React from 'react';
import {Animated} from 'react-native';

import type {PropsType} from './types';
import {AnimatedHeader, Container, ImageBg, ScrollContainer} from './Styled';

import Header from 'toktokfood/components/Header';
import StyledText from 'toktokfood/components/StyledText';

const ToktokFoodShopOverview = (props: PropsType): React$Node => {
  const scrollY = new Animated.Value(0);
  const bgColor = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: ['rgba(0,0,0,0.0)', 'white'],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  const DATA = [
    {
      id: 1,
      title: 'The Hunger Games',
    },
    {
      id: 2,
      title: 'Harry Potter and the Order of the Phoenix',
    },
    {
      id: 3,
      title: 'To Kill a Mockingbird',
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
    },
    {
      id: 5,
      title: 'Twilight',
    },
    {
      id: 6,
      title: 'The Book Thief',
    },
    {
      id: 7,
      title: 'The Chronicles of Narnia',
    },
    {
      id: 8,
      title: 'Animal Farm',
    },
    {
      id: 9,
      title: 'Gone with the Wind',
    },
    {
      id: 10,
      title: 'The Shadow of the Wind',
    },
    {
      id: 11,
      title: 'The Fault in Our Stars',
    },
    {
      id: 12,
      title: "The Hitchhiker's Guide to the Galaxy",
    },
    {
      id: 13,
      title: 'The Giving Tree',
    },
    {
      id: 14,
      title: 'Wuthering Heights',
    },
    {
      id: 15,
      title: 'The Da Vinci Code',
    },
  ];

  return (
    <Container>
      <ImageBg />

      <AnimatedHeader style={{backgroundColor: bgColor}}>
        <Header hasBack backgroundColor="transparent" />
      </AnimatedHeader>

      <ScrollContainer
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {
            listener: event => {},
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={16}>
        {DATA.map(() => (
          <StyledText fontSize={80}>Test Scroll lakjdklsajdlkasjdklsjkdajskd</StyledText>
        ))}
      </ScrollContainer>
    </Container>
  );
};

export default ToktokFoodShopOverview;
