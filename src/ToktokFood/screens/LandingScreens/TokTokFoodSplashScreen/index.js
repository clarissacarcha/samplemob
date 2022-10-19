/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, View, Image, Text, Platform, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {CLIENT, TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {splash_new, toktokfood_logo, maintenance_logo, maintenance_bg} from 'toktokfood/assets/images';

import {
  CREATE_ACCOUNT,
  GET_ACCOUNT,
  GET_CONSUMER_TYPE,
  GET_KYC_STATUS,
  PATCH_PERSON_HAS_TOKTOKFOOD,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_HAS_TEMPORARY_CART,
} from 'toktokfood/graphql/toktokfood';
import {moderateScale, getStatusbarHeight} from 'toktokbills/helper';
import {useUserLocation} from 'toktokfood/hooks';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {HeaderBack} from 'toktokbills/components';
import {setNewInstall} from 'toktokfood/helper/PersistentLocation';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

const TokTokFoodSplashScreen = () => {
  useUserLocation(); // user location hook

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const {location, customerInfo, receiver} = useSelector(state => state.toktokFood);
  const [errorModal, setErrorModal] = useState({error: {}, visible: false});
  const [createdFlag, setCreatedFlag] = useState(false);

  //Checkpoint
  //A is default which is everything is working and can proceed to home
  //Maintenance for maintenance screen.
  //10-19-2022 Proceed to maintenance screen once api fails to load
  //
  const [checkPoint, setCheckPoint] = useState('A');

  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({createAccount}) => {
      let {status} = createAccount;
      if (status === 200) {
        setCreatedFlag(true);
      } else {
        setCheckPoint('MAINTENANCE');
      }
    },
    onError: error => {
      setCheckPoint('MAINTENANCE');
      console.log('createAccount', error);
    },
  });

  const [getConsumerStatus] = useLazyQuery(GET_CONSUMER_TYPE, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    // context: {
    //   headers: {
    //     'x-api-key': 'ABCD1234',
    //   },
    // },
    fetchPolicy: 'network-only',
    variables: {
      input: {
        referenceNumber: String(user.id),
      },
    },
    onCompleted: ({getConsumer}) => {
      dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_FRANCHISEE', payload: {...getConsumer}});
    },
    onError: error => {
      setCheckPoint('MAINTENANCE');
      console.log('getConsumerStatus', error);
    },
  });

  const [getKycStatus] = useLazyQuery(GET_KYC_STATUS, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    // context: {
    //   headers: {
    //     'x-api-key': 'ABCD1234',
    //   },
    // },
    fetchPolicy: 'network-only',
    variables: {
      input: {
        referenceNumber: user.id,
      },
    },
    onCompleted: ({getKycStatus}) => {
      // console.log(getKycStatus, user);
      if (getKycStatus) {
        dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_WALLET_ACCOUNT', payload: {...getKycStatus}});
        return showHomPage();
      }
      dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_WALLET_ACCOUNT', payload: null});
      return showHomPage();
    },
    onError: error => {
      setCheckPoint('MAINTENANCE');
      console.log('getKycStatus', error);
    },
  });

  const [updateToktokUser] = useMutation(PATCH_PERSON_HAS_TOKTOKFOOD, {
    client: CLIENT,
    onCompleted: ({patchToktokFoodUserId}) => {
      // console.log('patchToktokFoodUserId: ' + JSON.stringify(patchToktokFoodUserId));
      if (patchToktokFoodUserId.status !== 200) {
        setCheckPoint('MAINTENANCE');
        // Alert.alert('', 'Something went wrong.', [{text: 'Okay', onPress: () => navigation.pop()}]);
      }
    },
    onError: error => {
      setCheckPoint('MAINTENANCE');
      console.log('updateToktokUser', error);
    },
  });

  const [getToktokFoodUserInfo] = useLazyQuery(GET_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      console.log('getToktokUserInfo', error);
      // setErrorModal({error, visible: true});
      setCheckPoint('MAINTENANCE');
    },
    onCompleted: async ({getAccount}) => {
      await getConsumerStatus();
      await getKycStatus();
      console.log('GET ACCOUNT:' + JSON.stringify(getAccount));

      if (createdFlag) {
        addToktokFoodId(getAccount);
      }
      if (user.toktokfoodUserId != null) {
        dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
        checkHasTemporaryCart({variables: {input: {userId: getAccount.userId}}});
      }
    },
  });

  const addToktokFoodId = account => {
    dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...account}});
    updateToktokUser({
      variables: {
        input: {
          toktokUserId: Number(user.id),
          toktokfoodUserId: Number(account.userId),
        },
      },
    });
  };

  const checkContactNumber = (contact = '') => {
    if (contact !== '') {
      if (contact.slice(0, 2) === '63') {
        return contact.slice(2, contact.length);
      }
      return contact;
    }
    return '';
  };

  const [checkHasTemporaryCart, {data: temporaryCart}] = useLazyQuery(CHECK_HAS_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: err => {
      setCheckPoint('MAINTENANCE');
      // Alert.alert('', 'Something went wrong.');
      console.log(`🍔 Temporary cart error: ' ToktokFoodSplashScreen.js`, err);
    },
  });

  const [deleteShopTemporaryCart, {loading}] = useMutation(DELETE_SHOP_TEMPORARY_CART, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    variables: {
      input: {
        userid: customerInfo.userId,
        shopid: temporaryCart?.checkHasTemporaryCart?.shopid,
        branchid: 0,
      },
    },
    onCompleted: () => {
      setNewInstall();
      navigation.replace('ToktokFoodLanding');
    },
    onError: () => {
      // Alert.alert('', 'Something went wrong.');
      setCheckPoint('MAINTENANCE');
      console.log(`🍔 Temporary cart error: ' ToktokFoodSplashScreen.js`);
    },
  });

  const showHomPage = () => {
    const NAME =
      customerInfo.firstName && customerInfo.lastName ? `${customerInfo.firstName} ${customerInfo.lastName}` : '';
    dispatch({
      type: 'SET_TOKTOKFOOD_ORDER_RECEIVER',
      payload: {
        contactPerson: NAME,
        contactPersonNumber: customerInfo.conno ? checkContactNumber(customerInfo.conno) : '',
        landmark: '',
      },
    });
    if (temporaryCart) {
      if (temporaryCart.checkHasTemporaryCart.shopid !== 0 && Object.keys(receiver).length !== 3) {
        deleteShopTemporaryCart();
      } else {
        navigation.replace('ToktokFoodLanding');
      }
    } else {
      navigation.replace('ToktokFoodLanding');
    }
  };

  useEffect(async () => {
    await AsyncStorage.removeItem('toktokWalletEnterpriseToken');
    // await getKycStatus(); // get kyc status on load
  }, []);

  useEffect(() => {
    // StatusBar.setHidden(true, 'slide');
    if (location != undefined) {
      if (user.toktokfoodUserId != null) {
        getToktokFoodUserInfo({
          variables: {
            input: {
              toktokUserId: user.id,
            },
          },
        });
      } else {
        processCreateAccount();
      }
    }
  }, [user, location]);

  useEffect(() => {
    if (createdFlag) {
      getToktokFoodUserInfo({
        variables: {
          input: {
            toktokUserId: user.id,
          },
        },
      });
    }
  }, [createdFlag]);

  const processCreateAccount = () => {
    let {firstName, lastName, birthdate, emailAddress, gender} = user.person;
    const formattedMobile = user.username.substring(1, user.username.length);
    createAccount({
      variables: {
        input: {
          firstname: firstName,
          lastname: lastName,
          toktokid: user.id,
          contactnumber: formattedMobile,
          email: emailAddress,
          address: location?.address,
          birthday: '',
          gender: '',
          postal_code: '',
          region_id: '',
          province_id: '',
          city_id: '',
          brgy_id: '',
        },
      },
    });
  };

  if (checkPoint === 'A') {
    return <ImageBackground style={styles.splashContainer} source={splash_new} resizeMode="cover" />;
  }

  return (
    <ImageBackground
      source={maintenance_bg}
      style={[styles.container, {paddingTop: Platform.OS === 'android' ? getStatusbarHeight : 0}]}>
      <HeaderBack styleContainer={{marginVertical: moderateScale(16)}} />
      <View style={styles.contentContainer}>
        <View style={[styles.subContainer, {marginBottom: getStatusbarHeight}]}>
          <Image style={styles.logo} source={toktokfood_logo} resizeMode="contain" />
          <Image style={styles.maintenanceBills} source={maintenance_logo} resizeMode="cover" />
          <Text style={styles.title}>Katok ka ulit mamaya!</Text>
          <Text style={styles.message}>
            We are performing some maintenance to serve you better. We will be right back. Thank you.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  logo: {
    height: moderateScale(25),
    width: moderateScale(166),
    marginBottom: moderateScale(30),
  },
  contentContainer: {
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.XL,
    fontFamily: FONT.SEMI_BOLD,
    marginTop: moderateScale(10),
  },
  message: {
    marginHorizontal: moderateScale(20),
    textAlign: 'center',
    marginTop: 8,
  },
  maintenanceBills: {
    height: null,
    aspectRatio: 1.05,
    width: width * 0.8,
    marginBottom: moderateScale(15),
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TokTokFoodSplashScreen;
