import React, {useState} from 'react';
import {Dimensions, Platform, StyleSheet, View, StatusBar} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import {useRoute} from '@react-navigation/native';

// Components
import {RestaurantList} from '../../ToktokFoodHome/components';
import HeaderTabs from 'toktokfood/components/HeaderTabs';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';

// Utils
import {moderateScale, verticalScale, getDeviceWidth} from 'toktokfood/helper/scale';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 0) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

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
  const routes = useRoute();
  const {image, name} = routes.params.item;

  const renderNavBar = () => (
    <View style={[styles.headerWrapper, styles.navbarWrapper]}>
      <HeaderTitle />
      <View style={styles.tabContainer}>
        <HeaderTabs activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} />
      </View>
    </View>
  );

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <HeaderTitle title={name} />
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ReactNativeParallaxHeader
        alwaysShowNavBar={false}
        alwaysShowTitle={false}
        headerMinHeight={moderateScale(150)}
        headerMaxHeight={moderateScale(250)}
        headerTitleStyle={{zIndex: offset <= 245 ? 0 : -1, justifyContent: 'flex-start'}}
        extraScrollHeight={0}
        title={renderTitle()}
        backgroundImage={image}
        backgroundColor="transparent"
        navbarColor="whitesmoke"
        renderContent={() => <RestaurantList />}
        renderNavBar={renderNavBar}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        // scrollViewProps={{
        //   onScroll: (event) => setOffset(event.nativeEvent.contentOffset.y),
        //   onScrollEndDrag: (event) => setOffset(event.nativeEvent.contentOffset.y),
        // }}
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
    backgroundColor: 'whitesmoke',
    flexGrow: 1,
    marginTop: Platform.OS === 'ios' ? verticalScale(15) : 0,
    paddingBottom: 30,
  },
  headerWrapper: {
    borderWidth: 1,
    // flex: 1,
    // paddingTop: 20,
    // paddingHorizontal: 15,
    // width: '100%',
  },
  navbarWrapper: {
    // marginTop: verticalScale(10),
  },
  tabContainer: {
    paddingHorizontal: 15,
  },
  titleContainer: {
    backgroundColor: 'rgba(255,255,255,0.5).',
    // position: 'absolute',
    bottom: Platform.OS === 'ios' ? moderateScale(150) : 0,
    // marginBottom: 200,
    // justifyContent: 'space-between',
    paddingBottom: moderateScale(30),
    width: getDeviceWidth,
  },
});

export default StickyView;
