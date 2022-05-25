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
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

//HELPER
import {moderateScale, numberFormat} from 'toktokbills/helper';

//COMPONENTS
import {HeaderBack, HeaderTitle, Separator, LoadingIndicator} from 'toktokbills/components';
import {ConfirmButton, PaymentDetails, VerifyContextProvider, VerifyContext, PaymentMethod} from './Components';
import {SomethingWentWrong} from 'toktokbills/components';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

//HOOKS
import {GET_USER_TOKTOK_WALLET_DATA} from 'toktokwallet/graphql';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {useAccount} from 'toktokwallet/hooks';
import {useLazyQuery} from '@apollo/react-hooks';

export const ToktokBillsPaymentSummary = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Payment Summary'} />,
  });

  const isFocused = useIsFocused();
  const {paymentData} = route.params;
  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount({isOnErrorAlert: false});
  const [refreshing, setRefreshing] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);

  const [getUserToktokWalletData, {error, loading}] = useLazyQuery(GET_USER_TOKTOK_WALLET_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        userId: user.id,
      },
    },
    onCompleted: async ({getUserToktokWalletData}) => {
      //0 - Rejected 1 - Approved 2 - Pending 3 - Linked 4 -For Further Verification
      setKycStatus(getUserToktokWalletData.kycStatus);
    },
  });

  useEffect(() => {
    if (isFocused) {
      getUserToktokWalletData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (user?.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user]);

  useEffect(() => {
    setRefreshing(getMyAccountLoading);
  }, [getMyAccountLoading]);

  const onRefresh = () => {
    getMyAccount();
  };

  if (getMyAccountLoading || loading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (getMyAccountError || error) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong onRefetch={onRefresh} error={getMyAccountError ?? error} />
      </View>
    );
  }
  return (
    <>
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <PaymentDetails paymentData={paymentData} />
          {/* <PaymentMethod paymentData={paymentData} kycStatus={kycStatus} /> */}
        </ScrollView>
        <ConfirmButton paymentData={paymentData} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
