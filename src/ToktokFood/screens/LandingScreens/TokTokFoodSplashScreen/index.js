import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ImageBackground, StyleSheet, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR} from 'res/variables';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {splash} from 'toktokfood/assets/images';
import AlertModal from 'toktokfood/components/AlertModal';
import {CREATE_ACCOUNT, GET_ACCOUNT} from 'toktokfood/graphql/toktokfood';
import {useUserLocation} from 'toktokfood/hooks';

const TokTokFoodSplashScreen = () => {
  useUserLocation(); // user location hook

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.session);
  const {location} = useSelector((state) => state.toktokFood);
  const [errorModal, setErrorModal] = useState({error: {}, visible: false});

  const [createAccount, {loading, error}] = useMutation(CREATE_ACCOUNT, {
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

  const [getToktokUserInfo, {data: foodPerson, error: foodPersonError, loading: foodPersonLoading}] = useLazyQuery(
    GET_ACCOUNT,
    {
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: (error) => {
        setErrorModal({error, visible: true});
      },
      onCompleted: ({getAccount}) => {
        console.log(JSON.stringify({getAccount}));
        if (user.toktokfoodUserId != null) {
          dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
          showHomPage();
        } else {
          patchToktokFoodUserId(getAccount);
        }
      },
    },
  );

  const showHomPage = () => {
    navigation.replace('ToktokFoodLanding');
  };

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
  const patchToktokFoodUserId = async (getAccount) => {
    try {
      const API_RESULT = await axios({
        url: `https://dev.toktok.ph:2096/graphql`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: `
            mutation {
              patchToktokFoodUserId(input: {
                toktokfoodUserId: "${getAccount.userId}"
                toktokUserId: "${user.id}"
              }) {
                status
                message
              }
          }`,
        },
      });
      const res = API_RESULT.data.data;

      if (res.patchToktokFoodUserId.status == 200) {
        dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
        showHomPage();
      } else {
        Alert.alert('', 'Something went wrong.', [{text: 'Okay', onPress: () => navigation.back()}]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
