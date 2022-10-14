/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {Animated, RefreshControl} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useLazyQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
// import {useTheme} from 'styled-components/native';
import _ from 'lodash';

import type {PropsType} from './types';
import {
  AnimatedList,
  Column,
  ContentLoading,
  // ContentContainer,
  Description,
  ItemContainer,
  Loader,
  LoaderContainer,
  Pricetext,
  TagContainer,
  PromoTag,
  PromoText,
  ResellerTag,
  Row,
  TitleContainer,
  Container,
} from './Styled';

import EmptyList from 'toktokfood/components/EmptyList/EmptyList';
import StyledText from 'toktokfood/components/StyledText';

import {empty_search_2} from 'toktokfood/assets/images';

// Queries
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_PRODUCTS_BY_SHOP_CATEGORY} from 'toktokfood/graphql/toktokfood';

const ShopItemList = (props: PropsType): React$Node => {
  const {onGetRef, onMomentumScrollBegin, onMomentumScrollEnd, onScrollEndDrag, route, shopId, scrollY} = props;
  const navigation = useNavigation();
  // const theme = useTheme();

  const [hasMorePage, setHasMorePage] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(0);
  const avatarStyle = {borderRadius: 10};
  const containerStyle = {height: 70, width: 70, marginRight: 15};
  const textProps = {numberOfLines: 1};


  const [getProductsByShopCategory, {data, fetchMore, refetch, loading}] = useLazyQuery(GET_PRODUCTS_BY_SHOP_CATEGORY, {
    variables: {
      input: {
        id: shopId,
        catId: route?.id,
        page: 0,
        // key: searchProduct,
      },
    },
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'cache and network',
    // onCompleted: ({getProductsByShopCategory}) => {
    //   const products = getProductsByShopCategory;
    //   filterProducts(products);
    // },
  });

  useEffect(() => {
    getProductsByShopCategory();
  }, [shopId, route]);

  const onLoadMore = () => {
    if (!showMore && hasMorePage) {
      setShowMore(true);
      fetchMore({
        variables: {
          input: {
            id: shopId,
            catId: route?.id,
            page: page + 1,
          },
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          setPage(page + 1);
          setShowMore(false);

          if (!fetchMoreResult) {
            return previousResult;
          }
          if (!fetchMoreResult?.getProductsByShopCategory.length) {
            setHasMorePage(false);
          }
          const mergeData = _.unionBy(
            previousResult.getProductsByShopCategory,
            fetchMoreResult.getProductsByShopCategory,
            'Id',
          );

          return {
            getProductsByShopCategory: mergeData,
          };
        },
      });
    }
  };

  const onNavigateToItem = Id => {
    navigation.navigate('ToktokFoodItemDetails', {Id});
  };

  const renderListHeader = () => (
    <TitleContainer>
      <StyledText fontSize={18} mode="medium">
        {route.title}
      </StyledText>
    </TitleContainer>
  );

  const renderFooter = () => (
    <LoaderContainer>
      <Loader animating={showMore} />
    </LoaderContainer>
  );

  const renderItem = ({item}) => {
    const {filename, itemname, price, promoVoucher, resellerDiscount, summary} = item;
    const {discRatetype, referralDiscount} = resellerDiscount;
    const discountText = discRatetype === 'p' ? `${referralDiscount * 100}%` : referralDiscount;
    return (
      <ItemContainer activeOpacity={0.9} onPress={() => onNavigateToItem(item?.Id)}>
        <Container>
          <Avatar
            size="medium"
            source={{
              uri: filename,
            }}
            avatarStyle={avatarStyle}
            containerStyle={containerStyle}
          />
          <Row>
            <Column flex={2} marginRight={20}>
              <StyledText mode="semibold" textProps={textProps}>
                {itemname}
              </StyledText>
              <Description>{summary}</Description>

              <TagContainer>
                {promoVoucher && (
                  <PromoTag>
                    <PromoText>{promoVoucher?.vname}</PromoText>
                  </PromoTag>
                )}

                {resellerDiscount?.referralShopRate > 0 && (
                  <ResellerTag>
                    <PromoText>Reseller {discountText}</PromoText>
                  </ResellerTag>
                )}
              </TagContainer>
            </Column>

            <Column>
              <Row>
                <StyledText>from </StyledText>
                <Pricetext>&#8369;{price.toFixed(2)}</Pricetext>
              </Row>
            </Column>
          </Row>
        </Container>
      </ItemContainer>
    );
  };

  return (
    <AnimatedList
      data={data?.getProductsByShopCategory || []}
      totalItems={data?.getProductsByShopCategory.length}
      ref={onGetRef}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onLoadMore}
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
      onMomentumScrollBegin={onMomentumScrollBegin}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      // ItemSeparatorComponent={() => <View style={{height: 10}} />}
      ListHeaderComponent={renderListHeader}
      ListEmptyComponent={() => {
        if (data) {
          return (
            <EmptyList image={empty_search_2} subtitle="Try to search something similar." title="No Results Found" />
          );
        }
        return <ContentLoading />;
      }}
      ListFooterComponent={renderFooter}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    />
  );
};

export default ShopItemList;
