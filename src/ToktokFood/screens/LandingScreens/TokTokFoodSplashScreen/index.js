/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {CLIENT, TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {splash_new} from 'toktokfood/assets/images';

import {
  CREATE_ACCOUNT,
  GET_ACCOUNT,
  GET_CONSUMER_TYPE,
  GET_KYC_STATUS,
  PATCH_PERSON_HAS_TOKTOKFOOD,
  DELETE_SHOP_TEMPORARY_CART,
  CHECK_HAS_TEMPORARY_CART,
} from 'toktokfood/graphql/toktokfood';
import {useUserLocation} from 'toktokfood/hooks';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {setNewInstall} from 'toktokfood/helper/PersistentLocation';

const TokTokFoodSplashScreen = () => {
  useUserLocation(); // user location hook

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const {location, customerInfo, receiver} = useSelector(state => state.toktokFood);
  const [errorModal, setErrorModal] = useState({error: {}, visible: false});
  const [createdFlag, setCreatedFlag] = useState(false);

  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({createAccount}) => {
      let {status} = createAccount;
      if (status === 200) {
        setCreatedFlag(true);
      } else {
        return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
      }
    },
    onError: error => {
      console.log('createAccount', error);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
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
      console.log('getConsumerStatus', error);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
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
      console.log('getKycStatus', error);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
    },
  });

  const [updateToktokUser] = useMutation(PATCH_PERSON_HAS_TOKTOKFOOD, {
    client: CLIENT,
    onCompleted: ({patchToktokFoodUserId}) => {
      // console.log('patchToktokFoodUserId: ' + JSON.stringify(patchToktokFoodUserId));
      if (patchToktokFoodUserId.status !== 200) {
        return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
        // Alert.alert('', 'Something went wrong.', [{text: 'Okay', onPress: () => navigation.pop()}]);
      }
    },
    onError: error => {
      console.log('updateToktokUser', error);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
    },
  });

  const [getToktokFoodUserInfo] = useLazyQuery(GET_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      console.log('getToktokUserInfo', error);
      // setErrorModal({error, visible: true});
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
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
      console.log(`🍔 Temporary cart error: ' ToktokFoodSplashScreen.js`, err);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
      // Alert.alert('', 'Something went wrong.');
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
      navigation.replace('ToktokFoodHomeScreen');
    },
    onError: () => {
      // Alert.alert('', 'Something went wrong.');
      console.log(`🍔 Temporary cart error: ' ToktokFoodSplashScreen.js`);
      return navigation.replace('SuperAppServiceMaintenance', {service: 'FOOD'});
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
        navigation.replace('ToktokFoodHomeScreen');
      }
    } else {
      navigation.replace('ToktokFoodHomeScreen');
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

  return <ImageBackground style={styles.splashContainer} source={splash_new} resizeMode="cover" />;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default TokTokFoodSplashScreen;
