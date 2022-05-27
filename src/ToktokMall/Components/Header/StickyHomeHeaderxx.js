import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
 
import {banner} from '../../assets';
import CustomIcon from '../../Components/Icons';
import {LandingHeader, LandingSubHeader} from './'

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
 
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
 
const renderNavBar = () => (
  <>
  <View style={styles.statusBar} />
  <View style={{...styles.navContainer, backgroundColor: 'transparent'}}>    
    <View style={{...styles.navBar, backgroundColor: 'transparent'}}>
      <TouchableOpacity style={styles.iconLeft} onPress={() => {}}>
        <Text style={{color: 'white'}}>
            <CustomIcon.FA5Icon name="chevron-left" color="orange" size={15} />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconRight} onPress={() => {}}>
        <Text style={{color: 'white'}}></Text>
      </TouchableOpacity>
    </View>
  </View>
  </>
);
 
const renderContent = () => {
  return (
    <View style={styles.body}>
      {Array.from(Array(30).keys()).map((i) => (
        <View
          key={i}
          style={{padding: 15, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Item {i + 1}</Text>
        </View>
      ))}
    </View>
  );
};
 
const title = () => {
  return (
    // <View style={styles.body}>
    //   <Text style={{color: 'black', fontSize: 25}}>ToktokMall</Text>
    // </View>
    <LandingHeader />
  );
};
 
export const StickyHomeHeader = ({children}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ReactNativeParallaxHeader
        alwaysShowTitle={false}
        alwaysShowNavBar={false}
        headerMinHeight={0}
        headerMaxHeight={150}
        extraScrollHeight={20}
        navbarColor="transparent"
        titleStyle={styles.titleStyle}
        title={title()}
        backgroundImage={banner}
        backgroundImageScale={1.2}
        renderNavBar={() => {
            return (
                <LandingSubHeader />
            )
        }}
        renderContent={() => {
            return (
                <>
                    <View>                        
                        {children}
                    </View>
                </>
            )
        }}
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        innerContainerStyle={styles.container}
        scrollViewProps={{
          onScrollBeginDrag: () => console.log('onScrollBeginDrag'),
          onScrollEndDrag: () => console.log('onScrollEndDrag'),
        }}
      />
    </>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: HEADER_HEIGHT,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    // backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  titleStyle: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
