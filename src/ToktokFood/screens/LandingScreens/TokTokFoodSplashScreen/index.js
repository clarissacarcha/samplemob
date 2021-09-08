import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect} from 'react';
import {ActivityIndicator, ImageBackground, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {COLOR} from 'res/variables';
import ENVIRONMENTS from 'src/common/res/environments';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {splash} from 'toktokfood/assets/images';
import {CREATE_ACCOUNT, GET_ACCOUNT} from 'toktokfood/graphql/toktokfood';
import {useUserLocation} from 'toktokfood/hooks';
import {useDispatch} from 'react-redux';

const TokTokFoodSplashScreen = () => {
  useUserLocation(); // user location hook

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector((state) => state.session);
  const {location} = useSelector((state) => state.toktokFood);

  const [createAccount, {loading, error}] = useMutation(CREATE_ACCOUNT, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    onCompleted: ({createAccount}) => {
      let {status} = createAccount;
      if (status == 200) {
        getToktokUserInfo();
      }
    },
  });

  const [getToktokUserInfo, {data: foodPerson, error: foodPersonError, loading: foodPersonLoading}] = useLazyQuery(
    GET_ACCOUNT,
    {
      variables: {
        input: {
          toktokUserId: user.id,
        },
      },
      client: TOKTOK_FOOD_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onCompleted: ({getAccount}) => {
        if (user.toktokfoodUserId != null) {
          dispatch({type: 'SET_TOKTOKFOOD_CUSTOMER_INFO', payload: {...getAccount}});
          showHomPage();
        } else {
          patchToktokFoodUserId(getAccount.userId);
        }
      },
    },
  );

  const showHomPage = () => {
    navigation.replace('ToktokFoodLanding');
  };

  useEffect(() => {
    if (location && user) {
      user.toktokfoodUserId != null ? getToktokUserInfo() : processCreateAccount();
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
          address: location.address,
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

  const patchToktokFoodUserId = async (toktokfoodUserId) => {
    try {
      const API_RESULT = await axios({
        url: `${ENVIRONMENTS.TOKTOK_SERVER}/graphql`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: `
            mutation {
              patchToktokFoodUserId(input: {
                toktokfoodUserId: "${toktokfoodUserId}"
                toktokUserId: "${user.id}"
              }) {
                status
                message
              }
          }`,
        },
      });
      const res = API_RESULT.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
