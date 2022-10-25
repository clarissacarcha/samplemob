/**
 * @format
 * @flow
 */

import React, {useEffect, useContext, useState} from 'react';

import type {PropsType} from './types';
import {Container, KeyboardAvoidingViewContainer} from './Styled';
//NATIVE COMPONENTS
import {useNavigation, useRoute} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/stack';
//COMPONENTS
import {
  TransactionButton,
  SssForm,
  TransactionHeader,
  TransactionVerifyContext,
  TransactionVerifyContextProvider,
  TransactionPaymentMethod,
  SssTransactionButton,
} from 'toktokbills/compositions';
import {
  HeaderBack,
  HeaderTitle,
  HeaderRight,
  LoadingIndicator,
  Separator,
  SomethingWentWrong,
} from 'toktokbills/components';
import {ToastModal} from 'toktokbills/components';
import {AlertOverlay} from 'src/components';
//HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';
//GRAPHQL
import {useMutation, useQuery} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {ErrorUtility} from 'toktokbills/util';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_BILL_ITEM_SETTINGS, PATCH_REMOVE_FAVORITE_BILL, POST_FAVORITE_BILL} from 'toktokbills/graphql/model';
import {setTimeout} from 'react-native/Libraries/Core/Timers/JSTimers';

const MainComponent = ({route, favoriteDetails}) => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const prompt = usePrompt();
  const [favoriteId, setFavoriteId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const [isMounted, setIsMounted] = useState(false);
  const onRefreshFavorites = route.params?.onRefreshFavorite ? route.params.onRefreshFavorite : null;
  const {billType, billItemId, itemCode} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} />,
    headerRight: () => <HeaderRight onPress={onPressFavorite} isFavorite={favoriteId !== 0} />,
  });

  const {getMyAccountLoading, getMyAccount, getMyAccountError} = useAccount({options: {isOnErrorAlert: false}});
  const {data, changeErrorMessages, fees, errorMessages, checkIsValidField, isFieldRequired} =
    useContext(TransactionVerifyContext);
  const {user} = useSelector(state => state.session);

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
    onCompleted: () => {
      setIsMounted(true);
    },
  });

  // PATCH REMOVE FAVORITE BILL
  const [patchRemoveFavoriteBill, {loading: patchFavoriteBillLoading}] = useMutation(PATCH_REMOVE_FAVORITE_BILL, {
    client: TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT,
    onError: error => {
      ErrorUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: ({patchRemoveFavoriteBill}) => {
      setFavoriteId(0);
      setFavoriteModal({show: true, message: 'Removed from your Favorites'});
      if (onRefreshFavorites) {
        onRefreshFavorites();
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
      setFavoriteId(postFavoriteBill.favoriteBill.id);
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
      if (onRefreshFavorites) {
        onRefreshFavorites();
      }
    },
  });
  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user, getMyAccount]);

  const onRefresh = () => {
    refetch();
    getMyAccount();
  };

  const onPressFavorite = () => {
    if (favoriteId !== 0) {
      return patchRemoveFavoriteBill({
        variables: {
          input: {
            id: +favoriteId,
          },
        },
      });
    }

    const isFirstFieldValid = checkIsValidField(
      'firstField',
      data.firstField,
      'Payment Reference Number (PRN)',
      14,
      1,
      null,
    );
    const isSecondFieldValid = checkIsValidField('secondField', data.secondField, 'Customer Name', 30, 2, 3);

    if (errorMessages.amount !== '') {
      changeErrorMessages('amount', '');
    }

    if (isFirstFieldValid && isSecondFieldValid) {
      postFavoriteBill({
        variables: {
          input: {
            billItemId,
            firstFieldValue: data.firstField,
            secondFieldValue: data.secondField,
          },
        },
      });
    }
  };

  if (loading || (getMyAccountLoading && !isMounted)) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} isFlex />
      </Container>
    );
  }
  if (error || (getMyAccountError && !getMyAccountError?.networkError)) {
    return (
      <Container>
        <SomethingWentWrong onRefetch={onRefresh} error={error ?? getMyAccountError} />
      </Container>
    );
  }
  return (
    <>
      <ToastModal visible={favoriteModal.show} setVisible={setFavoriteModal} message={favoriteModal.message} />
      <AlertOverlay visible={postFavoriteBillLoading || patchFavoriteBillLoading} />
      <Container>
        <KeyboardAvoidingViewContainer headerHeight={headerHeight}>
          <TransactionHeader billItemSettings={billItemSettings?.getBillItemSettings} billType={billType} />
          <SssForm
            billItemSettings={billItemSettings?.getBillItemSettings}
            billType={billType}
            headerHeight={headerHeight}
          />
          <Separator />
          <TransactionPaymentMethod />
        </KeyboardAvoidingViewContainer>
      </Container>
      <SssTransactionButton
        billItemSettings={billItemSettings?.getBillItemSettings}
        billType={billType}
        itemCode={itemCode}
      />
    </>
  );
};

const ToktokBillsSssTransaction = (props: PropsType): React$Node => {
  const route = useRoute();
  const favoriteDetails = route.params?.favoriteDetails ? route.params.favoriteDetails : null;
  const itemCode = route.params?.itemCode;

  return (
    <TransactionVerifyContextProvider favoriteDetails={favoriteDetails} itemCode={itemCode}>
      <MainComponent route={route} favoriteDetails={favoriteDetails} />
    </TransactionVerifyContextProvider>
  );
};

export default ToktokBillsSssTransaction;
