/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {MobileNumberInput} from 'toktokwallet/components';
import {FavoritesContext} from '../ContextProvider';
import {AlertOverlay} from 'src/components';
import {TransactionUtility} from 'toktokwallet/util';

export const EnterMobileNo = ({
  navigation,
  setProceed,
  proceed,
  setRecipientDetails,
  mobileNo,
  setMobileNo,
  recipientDetails,
  tokwaAccount,
  setGetAccountLoading,
  favoritesRef,
  formData,
  setFormData,
  setErrorMessages,
  errorMessages,
}) => {
  const prompt = usePrompt();

  const [getAccount, {loading: walletLoading}] = useLazyQuery(GET_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setFormData(prev => ({
        ...prev,
        recipientName: data.getAccount.person,
        recipientSelfieImage: data.getAccount.selfieImage,
      }));
    },
    onError: err => {
      if (err.graphQLErrors.length > 0) {
        console.log(err.graphQLErrors);
        if (err.graphQLErrors[0] === "Person doesn't registered in toktokwallet") {
          changeErrorMessages('The recipient has no toktokwallet account');
        } else {
          TransactionUtility.StandardErrorHandling({
            error: err,
            navigation,
            prompt,
          });
        }
      }
    },
  });

  const checkIFSameNumber = mobile => {
    let errorM = mobile === tokwaAccount.mobileNumber ? 'You cannot send money to yourself' : '';
    changeErrorMessages(errorM);
    return !!errorM;
  };

  const changeMobileNo = number => {
    if (number.length > 11) {
      return;
    }

    if (checkMobileFormat(number)) {
      checkIFSameNumber(number);
    }
    changeDataValue(number);
    changeErrorMessages('');
  };

  const fetchRecipientInfo = () => {
    getAccount({
      variables: {
        input: {
          mobileNumber: `+63${formData.recipientMobileNo}`,
        },
      },
    });
  };

  const changeDataValue = value => {
    setFormData(prev => ({...prev, recipientMobileNo: value}));
  };

  const changeErrorMessages = value => {
    setErrorMessages(prev => ({...prev, recipientMobileNo: value}));
  };

  const checkMobileFormat = mobile => {
    if (mobile.length !== 10) {
      return false;
    }
    if (mobile.slice(0, 2) !== '09') {
      return false;
    }
    return true;
  };

  const checkMobileNumber = () => {
    const isSameMobNum = checkIFSameNumber(`+63${formData.recipientMobileNo}`);

    if (!isSameMobNum) {
      fetchRecipientInfo();
    }
  };

  useEffect(() => {
    if (formData.recipientMobileNo !== '' && formData.recipientMobileNo.length === 10) {
      checkMobileNumber();
    }
  }, [formData.recipientMobileNo]);

  return (
    <>
      <AlertOverlay visible={walletLoading} />
      <MobileNumberInput
        label="Send Money to "
        name={formData.recipientName}
        value={formData.recipientMobileNo}
        onChangeText={value => {
          changeMobileNo(value);
          setFormData(prev => ({...prev, recipientName: ''}));
        }}
        errorMessage={errorMessages.recipientMobileNo}
        disableFavorite={
          formData.recipientMobileNo.length < 10 ||
          formData.recipientMobileNo === '' ||
          !!errorMessages.recipientMobileNo
        }
        hasFavorite
        hasContacts
      />
    </>
  );
};
