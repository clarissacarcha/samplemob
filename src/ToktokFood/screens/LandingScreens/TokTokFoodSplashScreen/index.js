/* eslint-disable react-hooks/exhaustive-deps */
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR} from 'res/variables';
import {CLIENT, TOKTOK_FOOD_GRAPHQL_CLIENT, TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {splash} from 'toktokfood/assets/images';
import AlertModal from 'toktokfood/components/AlertModal';

import {CREATE_ACCOUNT, GET_ACCOUNT, GET_KYC_STATUS, PATCH_PERSON_HAS_TOKTOKFOOD} from 'toktokfood/graphql/toktokfood';
import {useUserLocation} from 'toktokfood/hooks';

const TokTokFoodSplashScreen = () => {
  useUserLocation(); // user location hook

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.session);
  const {location} = useSelector(state => state.toktokFood);
  const [errorModal, setErrorModal] = useState({error: {}, visible: false});

  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({createAccount}) => {
      let {status} = createAccount;
      if (status == 200) {
        getToktokUserInfo({
          variables: {
            input: {
              toktokUserId: user.id,
            },
          },
        });
      }
    },
  });

  const [updateToktokUser, {data: updateToktokSuccess}] = useMutation(PATCH_PERSON_HAS_TOKTOKFOOD, {
    client: CLIENT,
    onCompleted: ({patchToktokFoodUserId}) => {
      // // const res = API_RESULT.data.data;
      // // console.log(JSON.stringify(res));
      // if (patchToktokFoodUserId.status == 200) {
      //   dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...patchToktokFoodUserId}});
      //   showHomPage();
      // } else {
      //   Alert.alert('', 'Something went wrong.', [{text: 'Okay', onPress: () => navigation.pop()}]);
      // }
    },
  });

  const [getKycStatus] = useLazyQuery(GET_KYC_STATUS, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    context: {
      headers: {
        'x-api-key': 'ABCD1234',
      },
    },
    fetchPolicy: 'network-only',
    variables: {
      input: {
        referenceNumber: String(user.id),
      },
    },
    onCompleted: ({getKycStatus}) => {
      if (getKycStatus) {
        return dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_WALLET_ACCOUNT', payload: {...getKycStatus}});
      }
      return dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_WALLET_ACCOUNT', payload: null});
    },
    onError: error => console.log(error),
  });

  const [getToktokUserInfo, {data: foodPerson, error: foodPersonError, loading: foodPersonLoading}] = useLazyQuery(
    GET_ACCOUNT,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: error => {
        setErrorModal({error, visible: true});
      },
      onCompleted: ({getAccount}) => {
        // console.log(JSON.stringify({foodPerson}));
        if (user.toktokfoodUserId != null) {
          dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
          showHomPage();
        } else {
          addToktokFoodId(getAccount);
        }
      },
    },
  );

  const addToktokFoodId = account => {
    updateToktokUser({
      variables: {
        input: {
          toktokUserId: `"${user.id}"`,
          toktokfoodUserId: `"${account.userId}"`,
        },
      },
    });
  };

  const showHomPage = () => {
    navigation.replace('ToktokFoodLanding');
  };

  useEffect(() => {
    getKycStatus(); // get kyc status on load
  }, []);

  useEffect(() => {
    StatusBar.setHidden(true, 'slide');

    if (location != undefined) {
      if (user.toktokfoodUserId != null) {
        getToktokUserInfo({
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
  // const patchToktokFoodUserId = async getAccount => {
  // try {
  // console.log(getAccount.userId);
  // console.log(user.id);
  // const API_RESULT = await axios({
  //   url: `https://dev.toktok.ph:2096/graphql`,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: {
  //     query: `
  //       mutation {
  //         patchToktokFoodUserId(input: {
  //           toktokfoodUserId: "${getAccount.userId}"
  //           toktokUserId: "${user.id}"
  //         }) {
  //           status
  //           message
  //         }
  //     }`,
  //   },
  // });
  //   const res = API_RESULT.data.data;
  //   console.log(JSON.stringify(res));

  //   if (res.patchToktokFoodUserId.status == 200) {
  //     dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
  //     showHomPage();
  //   } else {
  //     Alert.alert('', 'Something went wrong.', [{text: 'Okay', onPress: () => navigation.pop()}]);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  // };

  return (
    <>
      <AlertModal visible={errorModal.visible} error={errorModal.error} close={() => navigation.pop()} />
      <ImageBackground style={styles.container} source={splash} resizeMode="cover">
        <ActivityIndicator style={{marginBottom: 30}} size="large" color={COLOR.WHITE} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default TokTokFoodSplashScreen;
