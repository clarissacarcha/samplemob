/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
// import {useTheme} from 'styled-components';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import _ from 'lodash';

import type {PropsType} from './types';
import {
  Container,
  ContentLoading,
  ListContainer,
  ListImg,
  ListInfo,
  ListInfoText,
  ListWrapper,
  MapIcon,
  // SeeAllContainer,
  // RightIcon,
  Row,
  TitleContainer,
  TimeImg,
} from './Styled';

import StyledText from 'toktokfood/components/StyledText';

// GraphQL & Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';

import {shop_noimage} from 'toktokfood/assets/images';

const HomeNearYou = (props: PropsType): React$Node => {
  const {page, setLoadMore} = props;
  // const theme = useTheme();
  const {location} = useSelector(state => state.toktokFood);

  const variableInput = {
    limit: 11,
    radius: 3,
    userLongitude: location?.longitude,
    userLatitude: location?.latitude,
    tabId: 1,
    version: 2,
  };

  // data fetching for shops
  const [getShops, {data, loading, fetchMore}] = useLazyQuery(GET_SHOPS, {
    // onError: () => {
    //   setRefreshing(false);
    // },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache and network',
    nextFetchPolicy: 'network-only',
    onCompleted: () => setLoadMore(false),
  });
  console.log(data);

  useEffect(() => {
    if (location) {
      // console.log(location.latitude, location.longitude);
      getShops({
        variables: {
          input: {
            page: 0,
            ...variableInput,
          },
        },
      });
    }
  }, [location]);

  useEffect(() => {
    if (page !== 0 && data && data.getShops.length > 0) {
      fetchMore({
        variables: {
          input: {
            page: page,
            ...variableInput,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          const mergeData = _.unionBy(previousResult.getShops, fetchMoreResult.getShops, 'id');
          return {getShops: mergeData};
        },
      });
    }
  }, [page]);

  const RestaurantList = ({item}) => {
    const [validImg, setValidImg] = useState(true);
    return (
      <ListContainer>
        <ListImg source={validImg ? {uri: item.logo} : shop_noimage} onError={() => setValidImg(false)} />

        <ListInfo>
          <StyledText textProps={{numberOfLines: 1}} mode="semibold">
            {item.shopname}
          </StyledText>

          <Row>
            <TimeImg />
            <ListInfoText>{item.estimatedDeliveryTime} mins</ListInfoText>

            <MapIcon />
            <ListInfoText>
              {item.estimatedDistance.indexOf('KM') === -1 ? `${item.estimatedDistance} km` : item.estimatedDistance}
            </ListInfoText>
          </Row>
        </ListInfo>
      </ListContainer>
    );
  };

  return (
    <Container>
      <TitleContainer>
        <StyledText>Near You</StyledText>
        {/* <SeeAllContainer>
          <StyledText color={theme.color.orange}>See All</StyledText>
          <RightIcon />
        </SeeAllContainer> */}
      </TitleContainer>

      {loading ? (
        <ContentLoading />
      ) : (
        data &&
        data?.getShops && (
          <ListWrapper>
            {data?.getShops.map(item => (
              <RestaurantList item={item} />
            ))}
          </ListWrapper>
        )
      )}
    </Container>
  );
};

export default HomeNearYou;
