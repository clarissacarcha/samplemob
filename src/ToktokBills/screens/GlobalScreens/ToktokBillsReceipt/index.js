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
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import ViewShot, {captureScreen, releaseCapture} from 'react-native-view-shot';
import {useHeaderHeight} from '@react-navigation/stack';

//UTIL
import {moderateScale, numberFormat, getStatusbarHeight} from 'toktokbills/helper';
const {width, height} = Dimensions.get('window');

//COMPONENTS
import {
  OrangeButton,
  HeaderBack,
  HeaderTitle,
  LoadingIndicator,
  HeaderDownloadReceipt,
  ToastModal,
  AlertOverlay
} from 'toktokbills/components';
import {Header, ReceiptDetails} from './components';
import {QuestionModal} from '../../../components/Modals';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import LinearGradient from '../../../assets/images/screen-bg.png';

//HELPER
import {usePrompt} from 'src/hooks';
import {ErrorUtility} from 'toktokbills/util';

//GRAPHQL & HOOKS
import {useThrottle} from 'src/hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_FAVORITE_BILL, GET_FAVORITE_BILLS, POST_CHECK_IF_FAVORITE_EXIST} from 'toktokbills/graphql/model';

const MainComponent = ({navigation, route, viewRef, onCapturingScreen}) => {
  return (
    <>
      <ImageBackground
        source={LinearGradient}
        resizeMode="cover"
        style={{
          marginTop: moderateScale(10),
        }}>
        <View style={styles.receiptContainer}>
          <Header route={route} />
          <ReceiptDetails route={route} />
        </View>
      </ImageBackground>
    </>
  );
};

export const ToktokBillsReceipt = ({navigation, route}) => {
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [favoriteBillId, setFavoriteBillId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteExisting, setFavoriteExisting] = useState(false);
  const viewshotRef = useRef();
  const prompt = usePrompt();
  const favoriteDetails = route?.params?.favoriteDetails ? route.params.favoriteDetails : null;
  const {firstField, secondField} = route?.params?.paymentData;

  navigation.setOptions({
    headerLeft: () => {},
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
    postCheckIfFavoriteExist({
      variables: {
        input: {
          billItemId: route?.params?.paymentData?.billItemSettings?.id,
          firstFieldValue: firstField,
          secondFieldValue: secondField,
        },
      },
    });
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // POST FAVORITE BILL
  const [postFavoriteBill, {loading: postFavoriteBillLoading}] = useMutation(POST_FAVORITE_BILL, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      setDuplicateFavorites(true);
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: 'Duplicate Favorites',
      });
    },
    onCompleted: ({postFavoriteBill}) => {
      setFavoriteBillId(postFavoriteBill.favoriteBill.id);
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
      setTimeout(() => {
        navigation.navigate('ToktokBillsHome');
      }, 1000);
    },
  });

  //CHECK FAVORITE BILLS
  const [postCheckIfFavoriteExist, {loading: postCheckIfFavoriteExistLoading}] = useMutation(
    POST_CHECK_IF_FAVORITE_EXIST,
    {
      client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
      onError: error => {
        console.log(error);
      },
      onCompleted: ({postCheckIfFavoriteExist}) => {
        setFavoriteExisting(postCheckIfFavoriteExist);
      },
    },
  );

  const onPressFavorite = () => {
    postFavoriteBill({
      variables: {
        input: {
          billItemId: route?.params?.paymentData?.billItemSettings?.id,
          firstFieldValue: firstField,
          secondFieldValue: secondField,
        },
      },
    });
  };

  return (
    <>
      <QuestionModal
        visible={visible}
        setVisible={setVisible}
        onPressNo={() => navigation.navigate('ToktokBillsHome')}
        onPressYes={onPressFavorite}
      />
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} message={favoriteModal.message} />
      <AlertOverlay visible={postFavoriteBillLoading} />
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView style={styles.container}>
        <ViewShot
          style={[styles.container]}
          ref={viewshotRef}
          options={{format: 'jpg', quality: 0.9, result: 'tmpfile'}}>
          <MainComponent navigation={navigation} route={route} onCapturingScreen={onCapturingScreen} />
        </ViewShot>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OrangeButton
          label="OK"
          onPress={() => (favoriteExisting.result ? navigation.navigate('ToktokBillsHome') : setVisible(true))}
        />
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
    backgroundColor: COLOR.WHITE,
  },
  emailText: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
    marginBottom: moderateScale(30),
    marginTop: moderateScale(10),
  },
  receiptContainer: {
    margin: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    backgroundColor: COLOR.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
