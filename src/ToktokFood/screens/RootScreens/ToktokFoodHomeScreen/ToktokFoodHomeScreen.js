/**
 * @format
 * @flow
 */

import React, {useCallback, useState} from 'react';
import {RefreshControl, SafeAreaView} from 'react-native';
// import {useTheme} from 'styled-components';

import type {PropsType} from './types';
import {Container, ScrollContainer} from './Styled';

// Components
import HomeHeader from 'toktokfood/compositions/Home/HomeHeader';
import HomeSearchBar from 'toktokfood/compositions/Home/HomeSearchBar';
import HomeFab from 'toktokfood/compositions/Home/HomeFab';
import HomeCategories from 'toktokfood/compositions/Home/HomeCategories';
import HomeBanner from 'toktokfood/compositions/Home/HomeBanner';
import HomeNearYou from 'toktokfood/compositions/Home/HomeNearYou';
import HomePromotions from 'toktokfood/compositions/Home/HomePromotions';
import Divider from 'toktokfood/components/Divider';

const ToktokFoodHomeScreen = (props: PropsType): React$Node => {
  // const theme = useTheme();
  const [page, setPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [isReload, setIsReload] = useState(false);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 100;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onLoadMore = nativeEvent => {
    if (!loadMore) {
      setPage(prev => prev + 1);
      setLoadMore(isCloseToBottom(nativeEvent));
    }
  };

  const onRefresh = useCallback(() => {
    setIsReload(true);
  }, [setIsReload]);

  return (
    <Container>
      <ScrollContainer
        refreshControl={<RefreshControl refreshing={isReload} onRefresh={onRefresh} />}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            onLoadMore(nativeEvent);
          }
        }}>
        <HomeHeader />
        <HomeSearchBar />
        <HomeBanner />
        <HomeCategories />
        <Divider height={8} />
        <HomePromotions />
        <HomeNearYou
          page={page}
          isLoadMore={loadMore}
          isReload={isReload}
          setLoadMore={setLoadMore}
          setIsReload={setIsReload}
          setPage={setPage}
        />
      </ScrollContainer>
      <HomeFab />
    </Container>
  );
};

export default ToktokFoodHomeScreen;
