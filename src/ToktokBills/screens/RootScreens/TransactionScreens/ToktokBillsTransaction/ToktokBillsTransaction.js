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
  BillsForm,
  TransactionHeader,
  TransactionVerifyContext,
  TransactionVerifyContextProvider,
  TransactionPaymentMethod,
} from 'toktokbills/compositions';
import {HeaderBack, HeaderTitle, HeaderRight, LoadingIndicator, Separator} from 'toktokbills/components';
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

const MainComponent = ({route, favoriteDetails}) => {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const prompt = usePrompt();
  const [favoriteId, setFavoriteId] = useState(favoriteDetails ? favoriteDetails.id : 0);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const onRefreshFavorite = route.params?.onRefreshFavorite ? route.params.onRefreshFavorite : null;
  const {billType, billItemId, itemCode} = route.params;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={billType.name} />,
    headerRight: () => <HeaderRight onPress={onPressFavorite} isFavorite={favoriteId !== 0} />,
  });

  const {getMyAccountLoading, getMyAccount} = useAccount({isOnErrorAlert: false});
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
      setFavoriteId(0);
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
      setFavoriteId(postFavoriteBill.favoriteBill.id);
      setFavoriteModal({show: true, message: 'Added to your Favorites'});
      if (onRefreshFavorite) {
        onRefreshFavorite();
      }
    },
  });
  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user, getMyAccount]);

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
      commissionRateDetails,
      providerId,
    } = billItemSettings.getBillItemSettings;

    const isFirstFieldValid = checkIsValidField(
      'firstField',
      data.firstField,
      firstFieldName,
      firstFieldWidth,
      firstFieldWidthType,
      firstFieldMinWidth,
    );
    const isSecondFieldValid = checkIsValidField(
      'secondField',
      data.secondField,
      secondFieldName,
      secondFieldWidth,
      secondFieldWidthType,
      secondFieldMinWidth,
    );
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

  if (getMyAccountLoading || loading) {
    return (
      <Container>
        <LoadingIndicator isLoading={true} isFlex />
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
          <BillsForm
            billItemSettings={billItemSettings?.getBillItemSettings}
            billType={billType}
            headerHeight={headerHeight}
          />
          <Separator />
          <TransactionPaymentMethod />
        </KeyboardAvoidingViewContainer>
      </Container>
      <TransactionButton
        billItemSettings={billItemSettings?.getBillItemSettings}
        billType={billType}
        itemCode={itemCode}
      />
    </>
  );
};

const ToktokBillsTransaction = (props: PropsType): React$Node => {
  const route = useRoute();
  const favoriteDetails = route.params?.favoriteDetails ? route.params.favoriteDetails : null;

  return (
    <TransactionVerifyContextProvider favoriteDetails={favoriteDetails}>
      <MainComponent route={route} favoriteDetails={favoriteDetails} />
    </TransactionVerifyContextProvider>
  );
};

export default ToktokBillsTransaction;
