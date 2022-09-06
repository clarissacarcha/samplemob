import React, {useContext, useEffect, useRef} from 'react';
import {View, StyleSheet, Platform, ScrollView, KeyboardAvoidingView} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';
import validator from 'validator';

//HELPER & UTIL
import {moderateScale, numberFormat, getStatusbarHeight} from 'toktokbills/helper';

//COMPONENTS
import {HeaderBack, HeaderTitleRevamp, OrangeButton, LoadingIndicator} from 'toktokwallet/components';
import {VerifyContextProvider, VerifyContext, OTCPartnerForm, Header} from './components';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_SIZE} = CONSTANTS;

//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';

const MainComponent = ({navigation, route}) => {
  const scrollRef = useRef({});
  const headerHeight = useHeaderHeight();

  const {logo, description, maximumAmount, id} = route.params?.otcPartnerDetails;

  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
    headerTitle: () => <HeaderTitleRevamp label={'Cash Out'} />,
  });

  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, tokwaAccount} = useAccount({isOnErrorAlert: false});
  const {firstName, middleName, lastName, mobileNumber} = user.person;
  const recipientName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;

  const {amount, setAmountError, email, setEmailError, purpose, setPurpose, providerServiceFee, toktokServiceFee} =
    useContext(VerifyContext);

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user, getMyAccount]);

  const checkEmail = () => {
    let error = email === '' ? 'This is a required field' : '';
    if (error === '' && !validator.isEmail(email, {ignore_whitespace: true})) {
      error = 'Invalid email address format';
    }
    setEmailError(error);
    return !error;
  };

  const checkAmount = () => {
    let error = amount === '' ? 'This is a required field' : '';
    if (amount === '0') {
      error = 'The minimum amount is ₱1';
    }
    if (error === '') {
      return checkInsufficientBalance();
    }
    setAmountError(error);
    return !error;
  };

  const checkInsufficientBalance = () => {
    let totalServiceFee = parseFloat(toktokServiceFee) + parseFloat(providerServiceFee);
    let totalAmount = totalServiceFee + parseFloat(amount);
    let isInsufficientBalance = parseFloat(totalAmount) > parseFloat(tokwaAccount?.wallet?.balance);
    let isMaxAmount = parseFloat(amount) > parseFloat(maximumAmount);
    let error = '';

    if (isMaxAmount) {
      error = `The maximum amount is up to ₱${numberFormat(maximumAmount).replace('.00', '')} only`;
    } else if (isInsufficientBalance) {
      error = `You have insufficient balance. ₱${totalServiceFee} service fee is added to this transaction. Kindly cash in or edit the amount.`;
    } else {
      error = '';
    }
    setAmountError(error);
    return !error;
  };

  const onPressProceed = () => {
    const isAmountValid = checkAmount();
    const isValidEmail = checkEmail();
    if (isAmountValid && isValidEmail) {
      const transactionDetails = {
        recipientName,
        recipientMobileNo: mobileNumber,
        email,
        purpose: purpose.trim(),
        providerServiceFee,
        toktokServiceFee,
        otcPartnerDetails: {
          logo,
          description,
        },
        amount: parseFloat(amount),
        cashOutProviderPartnerId: +id,
        totalServiceFee: parseFloat(providerServiceFee) + parseFloat(toktokServiceFee),
      };
      setPurpose(purpose.trim());
      navigation.navigate('ToktokWalletCashOutOTCPaymentSummary', {
        transactionDetails,
      });
    }
  };

  if (getMyAccountLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  // if (getMyAccountError && !getMyAccountError?.networkError) {
  //   return (
  //     <View style={styles.container}>
  //       <SomethingWentWrong onRefetch={onRefresh} error={error ?? getMyAccountError} />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        ref={scrollRef}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' && moderateScale(headerHeight + getStatusbarHeight)}>
        <ScrollView>
          <Header route={route} />
          <OTCPartnerForm route={route} />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <OrangeButton label="Proceed" onPress={onPressProceed} />
      </View>
    </View>
  );
};
export const ToktokWalletCashOutOTCTransaction = ({navigation, route}) => {
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
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLOR.WHITE,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
});
