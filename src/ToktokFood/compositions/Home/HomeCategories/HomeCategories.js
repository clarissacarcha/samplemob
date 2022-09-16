/**
 * @format
 * @flow
 */

import React from 'react';
import {useTheme} from 'styled-components';
import {useQuery} from '@apollo/react-hooks';

import type {PropsType} from './types';
import {Container, CategoryList, CategoryText, CategoryImg, CategoryTouchable, TitleContainer} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

import {fastfood} from 'toktokfood/assets/images';

// Query Clients
import {GET_CATEGORIES_BY_LIMIT} from 'toktokfood/graphql/toktokfood';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';

const HomeCategories = (props: PropsType): React$Node => {
  const theme = useTheme();

  // fetch data in categoties
  const {data} = useQuery(GET_CATEGORIES_BY_LIMIT, {
    variables: {
      input: {
        page: 0,
        limit: 4,
        filterSearch: 0,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
  });

  console.log(data);

  const renderItem = ({item}) => {
    let image = item.filename ? {uri: item.filename} : fastfood;
    return (
      <CategoryTouchable
      // style={horizontal ? styles.listItemVerticalContainer : {flexDirection: 'row', paddingBottom: 10}}
      // onPress={() => showSearchPage(item)}
      >
        <CategoryImg resizeMode="cover" source={image} />
        <CategoryText>{item.categoryName}</CategoryText>
      </CategoryTouchable>
    );
  };

  return (
    <Container>
      <TitleContainer>
        <StyledText>Categories</StyledText>
        <StyledText color={theme.color.orange}>See All</StyledText>
      </TitleContainer>

      <CategoryList data={data?.getCategoriesByLimit || []} renderItem={renderItem} />
    </Container>
  );
};

export default HomeCategories;
