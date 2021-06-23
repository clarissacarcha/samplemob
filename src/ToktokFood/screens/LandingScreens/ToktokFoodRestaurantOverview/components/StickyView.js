import React, {useState} from 'react';
import {Platform, StyleSheet, View, StatusBar, Text} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import {Rating} from 'react-native-ratings';

// Components
// import {RestaurantList} from '../../ToktokFoodHome/components';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderTitleSearchBox from './HeaderTitleSearchBox';
import FoodList from './FoodList';

// Utils
import {moderateScale, scale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';
import {tabs} from 'toktokfood/helper/strings';

// const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 0) : 64;
// const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

const StickyView = () => {
  const [offset, setOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const routes = useRoute();
  const {distance, image, name, ratings, time, totalBranches} = routes.params.item;
  const headerMinHeight = Platform.OS === 'ios' ? moderateScale(130) : moderateScale(160);
  const headerMaxHeight = Platform.OS === 'ios' ? scale(350) : scale(370);

  const renderNavBar = () => (
    <View style={[styles.headerWrapper, styles.navbarWrapper]}>
      {/* <HeaderTitle /> */}
      <HeaderTitleSearchBox />
      <View style={styles.tabContainer}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    </View>
  );

  const renderTitle = () => (
    <View style={styles.title}>
      <View style={styles.titleContainer}>
        <HeaderTitle title={name} />
      </View>
      <View style={styles.titleInfo}>
        <View style={styles.content}>
          <Text style={styles.titleText}>{name}</Text>
          <Rating startingValue={ratings} tintColor={'white'} imageSize={13} readonly style={styles.ratings} />

          <View style={styles.branchInfo}>
            <MCIcon name="store" color={'#868686'} size={13} />
            <Text style={styles.branches}>{totalBranches} branches</Text>

            <MCIcon name="clock-outline" color={'#868686'} size={13} />
            <Text style={styles.branches}>{time}</Text>

            <MCIcon name="map-marker-outline" color={'#868686'} size={13} />
            <Text style={styles.branches}>{distance}</Text>
          </View>
        </View>

        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={headerMinHeight}
        headerMaxHeight={headerMaxHeight}
        headerTitleStyle={{zIndex: offset <= 210 ? 0 : -1, justifyContent: 'flex-start'}}
        extraScrollHeight={0}
        backgroundImageScale={1.1}
        title={renderTitle()}
        backgroundImage={image}
        backgroundColor="transparent"
        navbarColor="whitesmoke"
        renderContent={() => <FoodList />}
        renderNavBar={renderNavBar}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollViewProps={{
          //   onScroll: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onScrollEndDrag: (event) => setOffset(event.nativeEvent.contentOffset.y),
          onMomentumScrollEnd: (event) => setOffset(event.nativeEvent.contentOffset.y),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  branches: {
    fontWeight: '400',
    fontSize: 10,
    paddingHorizontal: 3,
  },
  branchInfo: {
    flexDirection: 'row',
    marginBottom: verticalScale(5),
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: moderateScale(10),
  },
  contentContainer: {
    backgroundColor: 'whitesmoke',
    flexGrow: 1,
    // marginTop: Platform.OS === 'ios' ? verticalScale(4) : 0,
    paddingBottom: 30,
  },
  headerWrapper: {
    backgroundColor: 'white',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  navbarWrapper: {
    // marginTop: verticalScale(10),
  },
  ratings: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  tabContainer: {
    paddingHorizontal: 10,
    marginTop: verticalScale(8),
  },
  title: {
    flex: 1,
    width: getDeviceWidth,
    justifyContent: 'space-between',
  },
  titleContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: Platform.OS === 'ios' ? moderateScale(47) : verticalScale(7),
    height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(110),
    position: 'relative',
  },
  titleInfo: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    // height: 100,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  titleText: {
    fontWeight: '500',
    fontSize: 15,
  },
});

export default StickyView;
