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
import {useIsFocused} from '@react-navigation/native';

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
      console.log(user.toktokWalletAccountId)
      if(user.toktokWalletAccountId){
        getMyAccount()
      } else {
        setWalletBalance(null);
      }
    } 
  }, [user, isFocus])
  

  const onBack = () => {
    setShowHelpCentreList(false)
  }

  return (
    <View style={styles.container}>
      <HeaderImageBackground styleContainer={{ justifyContent: 'center' }} customSize={CUSTOM_HEADER}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: getStatusbarHeight, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={onBack} style={{  }}>
            <FIcon5 name="chevron-left" size={15} />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 10  }}>
            <Image source={{ uri: user.person.avatar }} style={{ height: 50, width: 50, borderRadius: 50, resizeMode: 'cover' }} />
          </View>
          <Text style={{ fontSize: FONT_SIZE.L, fontFamily: FONT.BOLD }}>{`${user.person.firstName} ${user.person.lastName}`}</Text>
        </View>
      </HeaderImageBackground>
      { loading || error ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <LoadingIndicator isLoading={true} size='small' />
          </View>
        ): (
        <>
          <Me />
          <HelpCentre />
        </>
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
    backgroundColor: 'whitesmoke',
  },
  shadow: {
    backgroundColor:"whitesmoke",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  }
});
