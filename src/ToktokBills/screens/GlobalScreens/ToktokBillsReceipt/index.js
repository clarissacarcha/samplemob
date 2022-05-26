import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import {useSelector} from 'react-redux';
import ViewShot, {captureScreen, releaseCapture} from 'react-native-view-shot';
import {useHeaderHeight} from '@react-navigation/stack';

//UTIL
import {moderateScale, numberFormat, getStatusbarHeight} from 'toktokbills/helper';
const {width, height} = Dimensions.get('window');

//COMPONENTS
import {OrangeButton, HeaderBack, HeaderTitle, LoadingIndicator, HeaderDownloadReceipt} from 'toktokbills/components';
import {SomethingWentWrong} from 'toktokbills/components';
import {Header, ReceiptDetails} from './components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {Colors} from 'react-native/Libraries/NewAppScreen';

//IMAGE
import LinearGradient from '../../../assets/images/screen-bg.png';

const MainComponent = ({navigation, route, viewRef, onCapturingScreen}) => {
  return (
    <>
      <ImageBackground
        source={LinearGradient}
        resizeMode="cover"
        style={{paddingTop: onCapturingScreen ? moderateScale(50) : moderateScale(20)}}>
        <View
          style={{
            margin: 16,
            marginBottom: moderateScale(100),
            paddingHorizontal: 16,
            paddingVertical: 20,
            backgroundColor: COLOR.WHITE,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          }}>
          <Header route={route} />
          <ReceiptDetails route={route} />
        </View>
      </ImageBackground>
    </>
  );
};

export const ToktokBillsReceipt = ({navigation, route}) => {
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const viewshotRef = useRef();
  const headerHeight = useHeaderHeight();
  const imageHeight = height - headerHeight - (Platform.OS == 'ios' ? getStatusbarHeight : 0);

  navigation.setOptions({
    headerLeft: () => null,
    headerTitle: () => <HeaderTitle label={'Transaction Receipt'} />,
    headerRight: () => (
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        refNo={route.params.receipt.referenceNumber}
        onPressDownloadReceipt={val => {
          setOnCapturingScreen(val);
        }}
      />
    ),
  });

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView style={styles.container}>
        <ViewShot style={styles.container} ref={viewshotRef} options={{format: 'jpg', quality: 0.9, result: 'tmpfile'}}>
          <MainComponent navigation={navigation} route={route} onCapturingScreen={onCapturingScreen} />
        </ViewShot>
      </ScrollView>
      {!onCapturingScreen && (
        <View style={styles.buttonContainer}>
          <OrangeButton label="OK" onPress={() => navigation.navigate('ToktokBillsHome')} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingTop: moderateScale(30),
  },
  headerText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  separator: {
    height: moderateScale(30),
    backgroundColor: '#F7F7FA',
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    width: '100%',
    flex: 1,
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    backgroundColor: COLOR.WHITE,
  },
  emailText: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10),
  },
});
