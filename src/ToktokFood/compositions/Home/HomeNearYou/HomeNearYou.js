/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/react-hooks';
import _ from 'lodash';
import moment from 'moment';
import {getWeekDay} from 'toktokfood/helper/strings';
import type {PropsType} from './types';
import {
  BtnContainer,
  Container,
  ContentLoading,
  EmptyContainer,
  EmptyImg,
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
  Overlay,
  OverlayText,
} from './Styled';
import YellowButton from 'toktokfood/components/YellowButton';

import StyledText from 'toktokfood/components/StyledText';

// GraphQL & Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SHOPS} from 'toktokfood/graphql/toktokfood';

import {shop_noimage, new_empty_shop_icon} from 'toktokfood/assets/images';

const HomeNearYou = (props: PropsType): React$Node => {
  const {page, setLoadMore} = props;
  const navigation = useNavigation();
  const theme = useTheme();
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
  console.log(data, 'data ----');

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

  const onShopOverview = item => navigation.navigate('ToktokFoodShopOverview', {item});

  const onSetLocationDetails = () => {
    // dispatch({type: 'SET_TOKTOKFOOD_PROMOTIONS', payload: []});
    // dispatch({type: 'SET_TOKTOKFOOD_SHIPPING', payload: []});
    navigation.navigate('ToktokFoodAddressDetails');
  };

  const EmptyList = () => (
    <EmptyContainer>
      <EmptyImg source={new_empty_shop_icon} />

      <StyledText mode="bold" color={theme.color.orange}>
        No Restaurant Available
      </StyledText>
      <StyledText style={{textAlign: 'center', marginTop: 10}}>
        Sinubukan kong mag hanap, pero wala akong makita. Sa ibang lugar na lang kaya?
      </StyledText>

      <BtnContainer>
        <YellowButton
          onPress={onSetLocationDetails}
          label="Try other location"
          btnStyle={{width: 150, borderRadius: 5, height: 35}}
        />
      </BtnContainer>
    </EmptyContainer>
  );

  const RestaurantList = ({item}) => {
    const [validImg, setValidImg] = useState(true);
    const {hasOpen, nextOperatingHrs, operatingHours, dayLapsed, hasProduct} = item;
    const {fromTime: currFromTime} = operatingHours;

    const displayNextOpeningHours = () => {
      if (hasOpen && hasProduct) {
        return null;
      }
      if (nextOperatingHrs === null || !hasProduct) {
        return <OverlayText>Currently Unavailable</OverlayText>;
      }
      const isAboutToOpen = moment().isBefore(moment(currFromTime, 'HH:mm:ss'));
      if (isAboutToOpen || dayLapsed === 0) {
        return (
          <OverlayText>
            Opens at {moment(dayLapsed === 0 ? nextOperatingHrs?.fromTime : currFromTime, 'hh:mm:ss').format('hh:mm A')}
          </OverlayText>
        );
      }
      return (
        <OverlayText>
          Opens on {getWeekDay(nextOperatingHrs?.day)} {moment(nextOperatingHrs?.fromTime, 'hh:mm:ss').format('LT')}
        </OverlayText>
      );
    };

    return (
      <ListContainer activeOpacity={0.9} onPress={() => onShopOverview(item)}>
        <ListImg source={validImg ? {uri: item.logo} : shop_noimage} onError={() => setValidImg(false)} />
        <Overlay opacity={hasOpen && hasProduct ? 0 : 0.68} />
        {displayNextOpeningHours()}
        <ListInfo>
          <StyledText textProps={{numberOfLines: 1}} mode="semibold">
            {item.shopname}
          </StyledText>

          <Row marginTop={5}>
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
        <StyledText mode="semibold">Near You</StyledText>
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
          <ListWrapper activeOpacity={1}>
            {data?.getShops.map(item => (
              <RestaurantList item={item} />
            ))}
          </ListWrapper>
        )
      )}
      {data && !data.getShops.length && <EmptyList />}
    </Container>
  );
};

export default HomeNearYou;
