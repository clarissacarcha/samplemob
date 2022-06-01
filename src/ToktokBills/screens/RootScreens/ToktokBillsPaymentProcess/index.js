import React, {useContext, useState, useEffect, useRef} from 'react';
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

//HELPER & UTIL
import {moderateScale, numberFormat} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';

//COMPONENTS
import {
  HeaderBack,
  HeaderTitle,
  Separator,
  LoadingIndicator,
  SomethingWentWrong,
  HeaderRight,
  ToastModal,
  AlertOverlay
} from 'toktokbills/components';
import {ConfirmButton, Header, PaymentForm, PaymentMethod, VerifyContextProvider, VerifyContext} from './Components';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_ITEM_SETTINGS, PATCH_REMOVE_FAVORITE_BILL, POST_FAVORITE_BILL} from 'toktokbills/graphql/model';
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';
import {checkFirstField, checkSecondField} from './Functions';
import {usePrompt} from 'src/hooks';

const MainComponent = ({navigation, route}) => {
  const {billItemId, billType} = route.params;
  const favoriteDetails = route?.params?.favoriteDetails ? route.params.favoriteDetails : null;
  const onRefreshFavorite = route?.params?.favoriteDetails ? route.params.onRefreshFavorite : null;
  const scrollRef = useRef({});

  const [refreshing, setRefreshing] = useState(false);
  const [favoriteBillId, setFavoriteBillId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} />,
    headerRight: () => <HeaderRight onPress={onPressFavorite} isFavorite={favoriteBillId} />,
  });

  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError, tokwaAccount} = useAccount({isOnErrorAlert: false});
  const prompt = usePrompt();

  // GET BILL ITEM SETTINGS
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

  // PATCH REMOVE FAVORITE BILL
  const [patchRemoveFavoriteBill, {loading: patchFavoriteBillLoading}] = useMutation(PATCH_REMOVE_FAVORITE_BILL, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        title: 'Duplicate Favorites',
      });
    },
    onCompleted: ({patchRemoveFavoriteBill}) => {
      setFavoriteBillId(0);
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
      if (onRefreshFavorite) {
        onRefreshFavorite();
      }
    },
  });

  // POST FAVORITE BILL
  const [postFavoriteBill, {loading: postFavoriteBillLoading}] = useMutation(POST_FAVORITE_BILL, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
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
      if (onRefreshFavorite) {
        onRefreshFavorite();
      }
    },
  });

  const {
    amount,
    setAmount,
    amountError,
    setAmountError,
    email,
    setEmail,
    emailError,
    setEmailError,
    firstField,
    setFirstField,
    firstFieldError,
    setFirstFieldError,
    isInsufficientBalance,
    setIsInsufficientBalance,
    secondField,
    setSecondField,
    secondFieldError,
    setSecondFieldError,
  } = useContext(VerifyContext);

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
    getMyAccount();
  };

  const onPressFavorite = () => {
    if (favoriteBillId) {
      return patchRemoveFavoriteBill({
        variables: {
          input: {
            id: favoriteBillId,
          },
        },
      });
    }
    const {
      firstFieldName,
      firstFieldFormat,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
      secondFieldName,
      secondFieldFormat,
      secondFieldWidth,
      secondFieldWidthType,
      secondFieldMinWidth,
    } = billItemSettings?.getBillItemSettings;

    const isFirstFieldValid = checkFirstField(
      firstField,
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
      setFirstFieldError,
    );
    const isSecondFieldValid = checkSecondField(
      secondField,
      secondFieldName,
      secondFieldWidth,
      secondFieldWidthType,
      secondFieldMinWidth,
      setSecondFieldError,
    );
    setAmountError('');
    setEmailError('');

    if (isFirstFieldValid && isSecondFieldValid) {
      postFavoriteBill({
        variables: {
          input: {
            billItemId,
            firstFieldValue: firstField,
            secondFieldValue: secondField,
          },
        },
      });
    }
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
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} message={favoriteModal.message} />
      <AlertOverlay visible={postFavoriteBillLoading || patchFavoriteBillLoading} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(65) : moderateScale(-100)}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ref={scrollRef}>
          <Header billItemSettings={billItemSettings?.getBillItemSettings} billType={billType} />
          <PaymentForm billItemSettings={billItemSettings?.getBillItemSettings} />
          <Separator />
          <PaymentMethod onCashIn={onCashIn} getMyAccount={getMyAccount} />
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmButton
        billItemSettings={billItemSettings?.getBillItemSettings}
        billType={billType}
        tokwaBalance={user.toktokWalletAccountId ? tokwaAccount?.wallet?.balance : '0.00'}
        scrollRef={scrollRef}
      />
    </>
  );
};
export const ToktokBillsPaymentProcess = ({navigation, route}) => {
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
    paddingBottom: moderateScale(20),
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
