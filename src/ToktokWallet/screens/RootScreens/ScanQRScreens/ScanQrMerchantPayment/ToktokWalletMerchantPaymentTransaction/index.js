import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {ICON_SET, VectorIcon} from 'src/revamp';
import {
  CheckIdleState,
  FlagSecureScreen,
  BuildingBottom,
  TransferableHeaderReminder,
  Separator,
  HeaderBack,
  HeaderTitleRevamp,
  TransferableAndNonTransferableModal,
  PolicyNote,
} from 'toktokwallet/components';
import {useAlert} from 'src/hooks/useAlert';
import {useAccount} from 'toktokwallet/hooks';
import {moderateScale, getStatusbarHeight} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import InputScrollView from 'react-native-input-scroll-view';
import {useHeaderHeight} from '@react-navigation/stack';

//SELF IMPORTS
import {EnterAmount, EnterNote, ProceedButton, Header, Forms} from './Components';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE, MARGIN} = CONSTANTS;

export const ToktokWalletMerchantPaymentTransaction = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={['Pay QR']} />,
  });

  const {merchant, branch, terminal, qrCode} = route.params;
  const headerHeight = useHeaderHeight();

  const alert = useAlert();
  const {tokwaAccount} = useAccount();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCertify, setCertify] = useState(true);
  // const [serviceFee, setServiceFee] = useState(0);
  const [transferableVisible, setTransferableVisible] = useState(false);
  const [formData, setFormData] = useState({
    accountName: `${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`,
    accountNumber: tokwaAccount.mobileNumber,
    amount: '',
    serviceFee: 0,
    note: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    recipientMobileNo: '',
    amount: '',
    emailAddress: '',
    note: '',
  });

  return (
    <FlagSecureScreen>
      <CheckIdleState>
        <View style={styles.container}>
          <TransferableAndNonTransferableModal visible={transferableVisible} setVisible={setTransferableVisible} />
          <View style={styles.content}>
            <InputScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardOffset={moderateScale(headerHeight + getStatusbarHeight)}
              topOffset={moderateScale(getStatusbarHeight)}>
              <Header route={route} />
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
                formData={formData}
                setFormData={setFormData}
                setErrorMessages={setErrorMessages}
                errorMessages={errorMessages}
                route={route}
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
            route={route}
          />
        </View>
      </CheckIdleState>
    </FlagSecureScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  merchantInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  merchantLogoView: {
    height: 70,
    width: 70,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: COLOR.ORANGE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantLogo: {
    height: 50,
    width: 45,
  },
});
