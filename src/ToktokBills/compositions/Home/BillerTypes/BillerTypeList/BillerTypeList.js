/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, HeaderContainer, List, SeeAllContainer, SeeAllIcon, SeeAllText, Title} from './Styled';
import BillerTypeItem from '../BillerTypeItem';

const BillerTypeList = (props: PropsType): React$Node => {
  const {billTypes, showMore, setShowMore} = props;

  const onPressSeeAll = () => {};
  const onPressItem = index => {
    setShowMore(false);
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Favorite Billers</Title>
        <SeeAllContainer onPress={onPressSeeAll}>
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
