import React, {useState} from 'react';
import {Platform, StyleSheet, View, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import ReactNativeParallaxHeader from 'react-native-parallax-header';

// Components
import {CategoryList, RestaurantList, AdvertisementSection} from './index';
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
  const headerMaxHeight = Platform.OS === 'ios' ? moderateScale(295) : moderateScale(325);
  const headerMinHeight = Platform.OS === 'ios' ? verticalScale(50) : moderateScale(65);

  const {shops} = useSelector((state) => state).toktokFood;
  const {categories} = useSelector((state) => state).toktokFood;
  

  const RenderNavBar = () => {
    return (
      <View style={[styles.headerWrapper, styles.navbarWrapper]}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    );
  };

  const RenderTitle = () => (
    <>
      <View style={styles.adsContainer}>
        <AdvertisementSection />
      </View>
      <CategoryList horizontal={true} rightText="See all" />
      <RenderNavBar />
    </>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={headerMinHeight}
        headerMaxHeight={headerMaxHeight}
        headerTitleStyle={{zIndex: offset <= 50 ? 1 : -1}}
        extraScrollHeight={10}
        title={<RenderTitle />}
        backgroundColor="transparent"
        navbarColor="whitesmoke"
        renderContent={() => <RestaurantList />}
        renderNavBar={() => <RenderNavBar />}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollViewProps={{
          // onScroll: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onScrollEndDrag: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onMomentumScrollEnd: (event) => setOffset(event.nativeEvent.contentOffset.y),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    backgroundColor: 'whitesmoke',
    paddingBottom: Platform.OS === 'android' ? 10 : 30,
    marginTop: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(14),
  },
  headerWrapper: {paddingHorizontal: 15, width: '100%', paddingTop: moderateScale(8)},
  navbarWrapper: {
    marginBottom: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(8),
  },
  adsContainer: {
    height: 130,
    width: '100%',
  },
});

export default StickyView;
