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
import InputScrollView from 'react-native-input-scroll-view';
import validator from 'validator';

//HELPER & UTIL
import {moderateScale, numberFormat, getStatusbarHeight} from 'toktokbills/helper';
import {ErrorUtility} from 'toktokbills/util';

//COMPONENTS
import {HeaderBack, HeaderTitleRevamp, Separator, OrangeButton, LoadingIndicator} from 'toktokwallet/components';
import {VerifyContextProvider, VerifyContext, OTCPartnerForm, Header} from './components';
import {AlertOverlay} from 'src/components';

// FONTS AND COLORS
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');
import {info_icon} from 'toktokwallet/assets';

//GRAPHQL & HOOKS
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {TOKTOK_BILLS_LOAD_GRAPHQL_CLIENT} from 'src/graphql';
import {useAccount} from 'toktokwallet/hooks';
import {useSelector} from 'react-redux';
import {usePrompt} from 'src/hooks';

const MainComponent = ({navigation, route}) => {
  const scrollRef = useRef({});
  const headerHeight = useHeaderHeight();

  const [isMounted, setIsMounted] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState({show: false, message: ''});
  const {logo, description, maximumAmount, id} = route.params?.otcPartnerDetails;

  navigation.setOptions({
    headerLeft: () => <HeaderBack color={COLOR.ORANGE} />,
    headerTitle: () => <HeaderTitleRevamp label={'Cash Out'} />,
  });

  const prompt = usePrompt();
  const {user} = useSelector(state => state.session);
  const {getMyAccountLoading, getMyAccount, getMyAccountError, tokwaAccount} = useAccount({isOnErrorAlert: false});
  const {firstName, middleName, lastName, mobileNumber} = user.person;
  const recipientName = middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
  const recipientMobileNo = mobileNumber.replace('+63', '0');

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
    isInsufficientBalance,
    setIsInsufficientBalance,
    secondField,
    setSecondField,
    dateOfClaim,
    setDateOfClaim,
    setDateOfClaimError,
    dateOfClaimError,
    purpose,
    setPurpose,
    providerServiceFee,
    toktokServiceFee,
  } = useContext(VerifyContext);

  useEffect(() => {
    if (user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, [user]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onRefresh = () => {
    getMyAccount();
  };

  const checkEmail = () => {
    if (email != '' && !validator.isEmail(email, {ignore_whitespace: true})) {
      setEmailError('Invalid email address format');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const checkAmount = () => {
    let error = amount == '' ? 'This is a required field' : '';
    if (error == '') {
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

  const checkDateOfClaim = () => {
    let error = dateOfClaim == '' ? 'This is a required field' : '';
    setDateOfClaimError(error);
    return !error;
  };

  const onPressProceed = () => {
    const isAmountValid = checkAmount();
    const isDateOfClaimValid = checkDateOfClaim();
    const isValidEmail = checkEmail();
    if (isAmountValid && isValidEmail) {
      const transactionDetails = {
        recipientName,
        recipientMobileNo,
        email,
        dateOfClaim,
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
      setPurpose(purpose.trim())
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
