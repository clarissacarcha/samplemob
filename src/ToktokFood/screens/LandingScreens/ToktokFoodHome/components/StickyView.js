import React, {useState} from 'react';
import {Platform, StyleSheet, View, StatusBar} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';

// Components
import {CategoryList, RestaurantList} from './index';
import HeaderTabs from 'toktokfood/components/HeaderTabs';

// Utils
import {moderateScale, scale, verticalScale} from 'toktokfood/helper/scale';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 0) : 64;
// const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const tabs = [
  {
    id: 1,
    name: 'Near You',
  },
  {
    id: 2,
    name: 'Promos',
  },
  {
    id: 3,
    name: 'All',
  },
];

const StickyView = () => {
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const headerMaxHeight = Platform.OS === 'ios' ? moderateScale(270) : scale(300);
  // const headerMinHeight = Platform.OS === 'ios' ? moderateScale(70) : scale(65);

  const renderNavBar = () => (
    <View style={[styles.headerWrapper, styles.navbarWrapper]}>
      <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
    </View>
  );

  const renderTitle = () => (
    <>
      <CategoryList />
      <CategoryList />

      {renderNavBar()}
    </>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={moderateScale(65)}
        headerMaxHeight={headerMaxHeight}
        headerTitleStyle={{zIndex: offset <= 245 ? 0 : -1}}
        extraScrollHeight={20}
        title={renderTitle()}
        backgroundColor="transparent"
        navbarColor="whitesmoke"
        renderContent={() => <RestaurantList />}
        renderNavBar={renderNavBar}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollViewProps={{
          // onScroll: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onScrollEndDrag: (event) => setOffset(event.nativeEvent.contentOffset.y),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'whitesmoke',
    paddingBottom: Platform.OS === 'android' ? 10 : 30,
    marginTop: Platform.OS === 'ios' ? verticalScale(15) : 0,
  },
  headerWrapper: {paddingHorizontal: 15, width: '100%'},
  navbarWrapper: {
    marginTop: Platform.OS === 'ios' ? verticalScale(10) : verticalScale(15),
  },
});

export default StickyView;
