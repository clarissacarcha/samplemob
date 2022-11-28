import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import {useSelector} from 'react-redux';
import InputScrollView from 'react-native-input-scroll-view';
import {useHeaderHeight} from '@react-navigation/stack';
//SELF  IMPORTS
import {ProceedButton, Forms, ContextProvider, Favorites, FavoritesContext} from './Components';
import {
  CheckIdleState,
  HeaderBack,
  HeaderTitleRevamp,
  PolicyNote,
  TransferableAndNonTransferableModal,
  LoadingIndicator,
  SomethingWentWrong,
} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, SIZE, FONT_SIZE, MARGIN} = CONSTANTS;

const MainComponent = ({navigation, route}) => {
  const headerHeight = useHeaderHeight();
  const recipientInfo = route.params?.recipientInfo ? route.params.recipientInfo : null;
  const QRInfo = route.params?.QRInfo ? route.params.QRInfo : null;
  const headerTitle = route.params?.headerTitle ? route.params.headerTitle : 'Send Money';
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [transferableVisible, setTransferableVisible] = useState(false);
  const {getFavorites, getFavoritesLoading, getFavoritesError, isFavorite} = useContext(FavoritesContext);
  const [formData, setFormData] = useState({
    recipientSelfieImage: '',
    recipientName: recipientInfo ? `${recipientInfo.person.firstName} ${recipientInfo.person.lastName[0]}.` : '',
    recipientMobileNo: recipientInfo ? recipientInfo.mobileNumber.replace('+63', '') : '',
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

  useEffect(() => {
    getFavorites();
  }, []);

  if (getFavoritesLoading && !isFavorite) {
    return (
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    );
  }
  if (getFavoritesError) {
    return (
      <View style={styles.container}>
        <SomethingWentWrong error={getFavoritesError} onRefetch={getFavorites} />
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
          <Favorites formData={formData} setFormData={setFormData} navigation={navigation} />
          <Forms
            recipientInfo={recipientInfo}
            formData={formData}
            setFormData={setFormData}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
            headerHeight={headerHeight}
            tokwaAccount={tokwaAccount}
            navigation={navigation}
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

export const ToktokWalletSendMoneyTransaction = ({navigation, route}) => {
  return (
    <ContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </ContextProvider>
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
