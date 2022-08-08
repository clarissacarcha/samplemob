/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import {Container, HeaderContainer, List, SeeAllContainer, SeeAllIcon, SeeAllText, Title} from './Styled';
import BillerTypeItem from '../BillerTypeItem';

const BillerTypeList = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const {billTypes, showMore, setShowMore} = props;
  const onPressSeeAll = () => {
    navigation.navigate('ToktokBiller', {billType: {name: 'Billers'}});
  };
  const onPressItem = index => {
    setShowMore(false);
  };

  const onThrottledPress = useThrottle(onPressSeeAll, 2000);

  return (
    <Container>
      <HeaderContainer>
        <Title>Select Biller Type</Title>
        <SeeAllContainer onPress={onThrottledPress}>
          <SeeAllText>See All</SeeAllText>
          <SeeAllIcon />
        </SeeAllContainer>
      </HeaderContainer>
      <List
        data={showMore ? billTypes.slice(0, 12) : billTypes}
        renderItem={({item, index}) => (
          <BillerTypeItem item={item} onPressItem={onPressItem} showMore={showMore} index={index} />
        )}
        keyExtractor={(val, index) => index.toString()}
      />
    </Container>
  );
};

export default BillerTypeList;
