import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';

//HELPER
import {moderateScale, numberFormat} from 'toktokbills/helper';

//COMPONENTS
import {HeaderBack, HeaderTitle, Separator, LoadingIndicator, SomethingWentWrong} from 'toktokbills/components';
import {ConfirmButton, Header, PaymentForm, PaymentMethod, VerifyContextProvider, VerifyContext} from './Components';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_ITEM_SETTINGS} from 'toktokbills/graphql/model';
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';

const MainComponent = ({navigation, route}) => {
  const {billItemId, billType} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError, tokwaAccount} = useAccount({isOnErrorAlert: false});

  const {
    data: billItemSettings,
    loading,
    error,
    refetch,
  } = useQuery(GET_BILL_ITEM_SETTINGS, {
    variables: {
      input: {
        billItemId,
      },
    },
    fetchPolicy: 'cache-and-network',
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
  });

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user]);

  const onRefetch = () => {
    refetch();
  };

  useEffect(() => {
    setRefreshing(getMyAccountLoading);
  }, [getMyAccountLoading]);

  const onRefresh = () => {
    getMyAccount();
  };

  const onCashIn = ({balance}) => {
    console.log(balance);
    getMyAccount();
  };

  if (loading || (getMyAccountLoading && !refreshing)) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (error || getMyAccountError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefetch} error={error ?? getMyAccountError} />
      </View>
    );
  }
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(65) : moderateScale(-100)}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Header billItemSettings={billItemSettings?.getBillItemSettings} billType={billType} />
          <PaymentForm billItemSettings={billItemSettings?.getBillItemSettings} />
          <Separator />
          <PaymentMethod onCashIn={onCashIn} getMyAccount={getMyAccount} />
          <ConfirmButton
            billItemSettings={billItemSettings?.getBillItemSettings}
            billType={billType}
            tokwaBalance={user.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : '0.00'}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};
export const ToktokBillsPaymentProcess = ({navigation, route}) => {
  const {billType} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} />,
  });

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: moderateScale(30),
    marginBottom: moderateScale(15),
  },
  logo: {
    width: moderateScale(130),
    height: moderateScale(70),
    resizeMode: 'contain',
  },
  billerName: {
    fontSize: FONT_SIZE.L,
    marginTop: moderateScale(10),
  },
});
