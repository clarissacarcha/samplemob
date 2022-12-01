import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {useSelector} from 'react-redux';
import InputScrollView from 'react-native-input-scroll-view';
import {useHeaderHeight} from '@react-navigation/stack';
//GRAPHQL
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ACCOUNT} from 'toktokwallet/graphql';
//SELF  IMPORTS
import {ProceedButton, Forms} from './Components';
import {
  CheckIdleState,
  SomethingWentWrong,
  HeaderBack,
  HeaderTitleRevamp,
  PolicyNote,
  TransferableAndNonTransferableModal,
  LoadingIndicator,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE, MARGIN} = CONSTANTS;

export const ToktokWalletScanQRTransaction = ({navigation, route}) => {
  const headerHeight = useHeaderHeight();
  const recipientInfo = route.params?.recipientInfo ? route.params.recipientInfo : null;
  const QRInfo = route.params?.QRInfo ? route.params.QRInfo : null;
  const headerTitle = route.params?.headerTitle ? route.params.headerTitle : 'Send Money';
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [transferableVisible, setTransferableVisible] = useState(false);
  const [formData, setFormData] = useState({
    recipientSelfieImage: recipientInfo ? recipientInfo.person.selfieImage : null,
    recipientName: recipientInfo ? `${recipientInfo.person.firstName} ${recipientInfo.person.lastName[0]}.` : '',
    recipientMobileNo: recipientInfo ? recipientInfo.mobileNumber : '',
    amount: QRInfo && QRInfo.amount !== 0 ? QRInfo.amount.toString() : '',
    emailAddress: tokwaAccount.person.emailAddress,
    note: '',
    toktokwalletAccountNo: tokwaAccount.mobileNumber,
  });
  const [errorMessages, setErrorMessages] = useState({
    recipientMobileNo: '',
    amount: '',
    emailAddress: '',
    note: '',
  });

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={headerTitle} />,
  });

  const [getAccount, {error: walletError, loading: walletLoading}] = useLazyQuery(GET_ACCOUNT, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getAccount}) => {
      setFormData(prev => ({...prev, recipientSelfieImage: getAccount.selfieImage}));
    },
  });

  useEffect(() => {
    // handleGetAccount();
  }, []);

  const handleGetAccount = () => {
    getAccount({
      variables: {
        input: {
          mobileNumber: formData.recipientMobileNo,
        },
      },
    });
  };

  if (walletLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (walletError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong error={walletError} onRefetch={handleGetAccount} />
      </View>
    );
  }

  return (
    <CheckIdleState>
      <TransferableAndNonTransferableModal visible={transferableVisible} setVisible={setTransferableVisible} />
      <View style={styles.container}>
        <InputScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardOffset={moderateScale(headerHeight + getStatusbarHeight)}
          topOffset={moderateScale(getStatusbarHeight)}>
          <PolicyNote
            title="Transferable and Non-transferable amount"
            titleStyles={{marginBottom: 0}}
            note1="Click "
            subTextNote1="here"
            subTextNote1Styles={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}
            noteText1Styles={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S}}
            endOfNote1=" here to read more about transferable and non-transferable amount."
            onPress={() => {
              setTransferableVisible(true);
            }}
            disabled={false}
          />
          <Forms
            recipientInfo={recipientInfo}
            formData={formData}
            setFormData={setFormData}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
            headerHeight={headerHeight}
          />
        </InputScrollView>
      </View>
      <ProceedButton
        formData={formData}
        setFormData={setFormData}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
        tokwaAccount={tokwaAccount}
        recipientInfo={recipientInfo}
      />
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headings: {
    height: 190,
    backgroundColor: 'black',
  },
  header: {
    marginTop: 42,
    height: 24,
    width: '100%',
    flexDirection: 'row',
  },
  walletbackgroundimage: {
    flex: 1,
    resizeMode: 'cover',
  },
  walletContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: MARGIN.M,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
  },
  swipeContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  receiverInfo: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  amount: {
    height: SIZE.FORM_HEIGHT,
    width: '100%',
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    borderRadius: 5,
    flexDirection: 'row',
  },
  topUp: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 40,
    marginLeft: 5,
    paddingTop: 10,
  },
  topUpbtn: {
    height: 34,
    width: 34,
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
