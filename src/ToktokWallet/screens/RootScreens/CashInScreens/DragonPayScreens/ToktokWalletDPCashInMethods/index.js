import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {useMutation, useLazyQuery, useQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {
  POST_CASH_IN_PAYPANDA_REQUEST,
  POST_REQUEST_CASH_IN,
  GET_CASH_IN_PARTNER_TYPES,
  POST_COMPUTE_PROCESSING_FEE,
} from 'toktokwallet/graphql';
import {
  Separator,
  CheckIdleState,
  NoData,
  QuestionModal,
  PolicyNote,
  HeaderBack,
  HeaderTitleRevamp,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
import {useAccount} from 'toktokwallet/hooks';
import {TransactionUtility} from 'toktokwallet/util';
import {useAlert, usePrompt} from 'src/hooks';
import {AlertOverlay} from 'src/components';

//SELF IMPORTS
import {PaymentMethod} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const ToktokWalletDPCashInMethods = ({navigation, route}) => {
  const {transactionType, amount, cashInAmount, onCashIn} = route.params;
  const {tokwaAccount} = useAccount();
  const [processingFee, setProcessingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMethodKey, setPaymentMethodKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [cashInMethods, setCashInMethods] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState(null);
  const [cashInPartnerTypeId, setCashInPartnerTypeId] = useState(null);
  const alert = useAlert();
  const prompt = usePrompt();

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={['Cash In']} />,
  });

  const [getCashInPartnerTypes, {data: getMethodsData, error: getMethodsError, loading: getMethodsLoading}] =
    useLazyQuery(GET_CASH_IN_PARTNER_TYPES, {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      fetchPolicy: 'network-only',
      onError: error => {
        TransactionUtility.StandardErrorHandling({
          error,
          navigation,
          prompt,
          isPop: false,
        });
      },
      onCompleted: ({getCashInPartnerTypes}) => {
        setCashInMethods(getCashInPartnerTypes);
      },
    });

  useEffect(() => {
    getCashInPartnerTypes();
  }, []);

  const [postComputeProcessingFee, {loading: postComputePFLoading}] = useMutation(POST_COMPUTE_PROCESSING_FEE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isPop: false,
      });
    },
    onCompleted: ({postComputeProcessingFee}) => {
      setProcessingFee(postComputeProcessingFee.processingFee);
    },
  });

  const [postRequestCashIn, {loading: cashInLoading}] = useMutation(POST_REQUEST_CASH_IN, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: ({postRequestCashIn}) => {
      return navigation.navigate('ToktokWalletTPINValidator', {
        callBackFunc: proceedToPaypandaPortal,
        btnLabel: 'Cash In',
      });
    },
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        isPop: false,
      });
    },
  });

  const [postCashInPayPandaRequest, {data, error, loading}] = useMutation(POST_CASH_IN_PAYPANDA_REQUEST, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
        alert,
      });
    },
    onCompleted: ({postCashInPayPandaRequest}) => {
      navigation.pop(); // remove TPIN/OTP Validator Screen;
      navigation.navigate('ToktokWalletPayPandaWebView', {
        merchantId: postCashInPayPandaRequest.merchantId,
        refNo: postCashInPayPandaRequest.refNo,
        signature: postCashInPayPandaRequest.signature,
        email_address: tokwaAccount.person.emailAddress,
        payer_name: `${tokwaAccount.person.firstName}${
          tokwaAccount.person.middleName ? ' ' + tokwaAccount.person.middleName : ''
        } ${tokwaAccount.person.lastName}`,
        mobile_number: tokwaAccount.mobileNumber,
        amount_to_pay: amount,
        currency: tokwaAccount.wallet.currency.code,
        walletId: tokwaAccount.wallet.id,
        transactionTypeId: transactionType.id,
        paypandaTransactionUrl: postCashInPayPandaRequest.paypandaTransactionEntryEndpoint,
        paypandaReturnUrl: postCashInPayPandaRequest.paypandaReturnUrlEndpoint,
        paypandaStaginReturnUrl: postCashInPayPandaRequest.paypandaReturUrlStagingEndpoint,
        cashInAmount: cashInAmount,
        onCashIn: onCashIn,
        processingFee: processingFee,
        paymentMethod: paymentMethod,
        paymentChoice: paymentChoice,
        providerServiceFee: postCashInPayPandaRequest.providerServiceFee,
        paymentMethodKey: paymentMethodKey,
      });
    },
  });

  const proceedToPaypandaPortal = ({pinCode = null, Otp = null}) => {
    postCashInPayPandaRequest({
      variables: {
        input: {
          provider: transactionType.id,
          amount: +amount,
          currencyId: tokwaAccount.wallet.currency.id,
          walletId: tokwaAccount.wallet.id,
          pinCode: pinCode,
          paymentMethod: paymentMethod,
          cashInPartnerTypeId: cashInPartnerTypeId,
        },
      },
    });
  };

  const onSwipeFail = e => {
    console.log(e);
  };

  const onSwipeSuccess = () => {
    postRequestCashIn();
  };

  const ProcessPayment = (method, paymentChoice, cashInPartnerTypeId, isCredit, methodKey) => {
    setPaymentMethod(method);
    setPaymentMethodKey(methodKey);
    setPaymentChoice(paymentChoice);
    setCashInPartnerTypeId(cashInPartnerTypeId);

    if (!isCredit) {
      proceedPayment({
        paymentChoice,
        method,
        methodKey,
      });
      return;
    }

    setVisible(true);
    return;
  };

  const proceedPayment = ({paymentChoice, method, methodKey}) => {
    // CALL PROCESSING FEE PAYPANDA API HERE
    postComputeProcessingFee({
      variables: {
        input: {
          amountToPay: +amount,
          paymentChoice,
        },
      },
    })
      .then(({data: {postComputeProcessingFee}}) => {
        navigation.navigate('ToktokWalletDpCashInPaymentSummary', {
          onFail: onSwipeFail,
          onSuccess: onSwipeSuccess,
          transactionDetails: {
            method,
            methodKey,
            amount: amount,
            accountName: `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`,
            accountNumber: tokwaAccount.mobileNumber,
            processingFee: postComputeProcessingFee.processingFee,
            transactionType,
          },
        });
      })
      .catch(error => console.log(error));
  };

  return (
    <CheckIdleState>
      <QuestionModal
        visible={visible}
        setVisible={setVisible}
        onPressYes={() => {
          proceedPayment({
            paymentChoice,
            method: paymentMethod,
            methodKey: paymentMethodKey,
          });
          setVisible(false);
        }}
        title="Online Banking: Debit/Credit Card"
        message="The amount you are trying to Cash In via this option is non-transferable and can only be used for payments. Would you like to proceed?"
      />
      <AlertOverlay visible={loading || postComputePFLoading || cashInLoading} />
      <View style={styles.container}>
        <PolicyNote
          note1="Your toktokwallet balance is considered non-transferable depending on the cash in method used. If you cash
          in via Credit Card or Foreign Debit Card, you are not allowed to transfer this fund to any toktokwallet
          user’s account and/or other bank accounts. You can only use this as payments for goods and services."
          title="Cash In Method"
        />
        <View style={styles.content}>
          {!cashInMethods ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size={36} color={COLOR.YELLOW} />
            </View>
          ) : cashInMethods.length == 0 ? (
            <NoData />
          ) : (
            cashInMethods.map((item, index) => {
              return (
                <PaymentMethod
                  onPress={() => ProcessPayment(item.name, item.transactionTypeId, item.id, item.isCredit, item.key)}
                  label={item.name}
                />
              );
            })
          )}
        </View>
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 16,
  },
  headerReminder: {
    padding: 16,
    backgroundColor: '#FFF2D5',
  },
  paymentoptions: {
    backgroundColor: '#FFF2D5',
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
});
