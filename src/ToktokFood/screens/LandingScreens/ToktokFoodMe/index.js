import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderTitle from 'toktokfood/components/HeaderTitle';
import HeaderSearchBox from 'toktokfood/components/HeaderSearchBox';
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight} from 'toktokfood/helper/scale';
import {arrow_right, help_centre_ic} from 'toktokfood/assets/images';
import { GET_MY_ACCOUNT } from 'toktokwallet/graphql';
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import {useIsFocused, useNavigation} from '@react-navigation/native';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import { HelpCentre, Me, VerifyContext, VerifyContextProvider } from './components';

const CUSTOM_HEADER = {
  container: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
  bgImage: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
};

const MainComponent = () => {

  const {location} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);
  const { showHelpCentreList, setShowHelpCentreList, walletBalance, setWalletBalance } = useContext(VerifyContext);
  const isFocus = useIsFocused();
  const navigation = useNavigation();
  const [ getMyAccount, {loading, error} ] = useLazyQuery(GET_MY_ACCOUNT , {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({ getMyAccount })=> {
      setWalletBalance(getMyAccount.wallet.balance);
    },
    onError: (error) => {
      // console.log(error)
    }
  });

  useEffect(() => {
    if(user && isFocus){
      if(user.toktokWalletAccountId){
        getMyAccount()
      } else {
        setWalletBalance(null);
      }
    } 
  }, [user, isFocus])

  const onBack = () => {
    // setShowHelpCentreList(false)
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <HeaderImageBackground searchBox={false}>
        <View style={styles.header}>
          {/* { showHelpCentreList && ( */}
            <TouchableOpacity onPress={onBack}>
              <FIcon5 name="chevron-left" size={15} />
            </TouchableOpacity>
          {/* )} */}
          <Image source={{ uri: user.person.avatar }} style={styles.avatar} />
          <Text style={styles.name}>
            {`${user.person.firstName} ${user.person.lastName}`}
          </Text>
        </View>
      </HeaderImageBackground>
      { loading || error ? (
          <LoadingIndicator isFlex isLoading={true} />
        ): (
          <HelpCentre getMyAccount={() => { getMyAccount() }} />
      )}
    </View>
  );
};

const ToktokFoodMe = () => {
  return (
    <VerifyContextProvider>
      <MainComponent />
    </VerifyContextProvider>
  );
};

export default ToktokFoodMe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  avatar: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(50),
    resizeMode: 'cover',
    marginLeft: moderateScale(15),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: getStatusbarHeight,
    paddingHorizontal: 16
  },
  name: {
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
    paddingHorizontal: 15
  }
});
