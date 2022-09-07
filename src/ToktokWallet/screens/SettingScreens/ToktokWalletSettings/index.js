import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {Separator, CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {useSelector} from 'react-redux';
import CONSTANTS from 'common/res/constants';
import _ from 'lodash';

const {FONT_FAMILY: FONT, FONT_SIZE, COLOR} = CONSTANTS;
const SettingHeaderTitle = ({title}) => {
  return (
    <View style={{paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white'}}>
      <Text style={{fontFamily: FONT.BOLD}}>{title}</Text>
    </View>
  );
};

export const ToktokWalletSettings = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Settings'} />,
  });
  const tokwaAccount = useSelector(state => state.toktokWallet);
  const [menuData, setMenuData] = useState([]);
  const menuDataConstant = [
    {
      label: 'Cash In',
      route: 'ToktokWalletCashInLogs',
      identifier: 'logCashIn',
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Fund Transfer',
      route: 'ToktokWalletCashOutLogs',
      identifier: 'logFundTransfer',
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Cash Out',
      route: 'ToktokWalletCashOutOtcLogs',
      identifier: 'logCashOutOtc',
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Send Money',
      route: 'ToktokWalletSendMoneyLogs',
      identifier: 'logSendMoney',
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Delivery',
      route: 'ToktokWalletPabiliDeliveryLogs',
      identifier: 'logToktok',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'Food',
      route: 'ToktokWalletFoodLogs',
      identifier: 'logToktokFood',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'QR Payment',
      route: 'ToktokWalletMerchantPaymentLogs',
      identifier: 'logMerchantQrPayment',
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Load',
      route: 'ToktokWalletLoadLogs',
      identifier: 'logToktokLoad',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'Receive Money',
      route: 'ToktokWalletReceiveMoneyLogs',
      identifier: `${Platform.OS}LogRecieveMoney`,
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Request Money',
      route: 'ToktokWalletRequestMoneyLogs',
      identifier: `${Platform.OS}LogRequestMoney`,
      checkIfMerchantLinked: false,
      service: 'internal',
    },
    {
      label: 'Bills',
      route: 'ToktokWalletBillsLogs',
      identifier: 'logToktokBills',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'Mart',
      route: 'ToktokWalletMartLogs',
      identifier: 'logToktokMart',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'Mall',
      route: 'ToktokWalletMallLogs',
      identifier: 'logToktokMall',
      checkIfMerchantLinked: false,
      service: 'external',
    },
    {
      label: 'Settlement',
      route: 'ToktokWalletMerchantSettlementLogs',
      identifier: 'logMerchantSettlement',
      checkIfMerchantLinked: true,
      service: 'internal',
    },
  ];

  useEffect(() => {
    const appServicesObject = _.keyBy(tokwaAccount.appServiceLogs, 'identifier');
    const filteredMenuData = menuDataConstant.filter(menuDataItem => {
      const appService = appServicesObject[menuDataItem.identifier];

      if (!appService) {
        console.log(`Menu item ${menuDataItem.identifier} not set in App Services. Do not bypass this validation.`);
        return false;
      }

      const isEnabled = appService.isEnabled;
      const isEnabledInEarlyAccess = tokwaAccount.constants.isEarlyAccess === 'TRUE' && appService.isEarlyAccess;
      const isDisplayed = isEnabled || isEnabledInEarlyAccess;

      if (!isDisplayed) {
        console.log(`Menu item ${menuDataItem.identifier} is hidden in App Services. Do not bypass this validation.`);
        return false;
      }

      if (menuDataItem?.checkIfMerchantLinked && !tokwaAccount?.merchantSettlement) {
        console.log('No Merchant linked in tokwa account');
        return false;
      }

      return true;
    });

    const groupedItems = _(filteredMenuData)
      .sortBy(item => item.label)
      .groupBy(item => item.service)
      .value();

    setMenuData([...groupedItems.internal, ...groupedItems.external]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SettingOption = ({route, params = {}, title}) => (
    <>
      <TouchableOpacity style={styles.settingoption} onPress={() => navigation.navigate(route, params)}>
        <View style={styles.name}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>{title}</Text>
        </View>
        <View style={styles.arrowright}>
          <FIcon name="chevron-right" size={20} color={'#A6A8A9'} />
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />
    </>
  );

  return (
    <CheckIdleState>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <SettingHeaderTitle title="Security" />
        <SettingOption route="ToktokWalletCreatePin" title={`${tokwaAccount.pinCode ? 'Change' : 'Setup'} TPIN`} />
        <SettingOption route="ToktokWalletMPINCreate" title="Change MPIN" />
        {/* TEMPORARY DISABLE OR HIDE THIS FEATURE */}
        {/* <Biometrics/> */}
        <Separator />
        <SettingHeaderTitle title="Account" />
        <SettingOption route="ToktokWalletPaymentChart" title="Payment Chart" />
        <SettingOption route="ToktokWalletTransactionLimit" title="User Level and Transaction Limit" />
        {(!tokwaAccount.isPep && +tokwaAccount.person.accountType.level < 3) ||
        (tokwaAccount.isPep && +tokwaAccount.person.accountType.level < 2) ? (
          <SettingOption route="ToktokWalletUpgradeAccount" title="Upgrade Account" />
        ) : null}
        <Separator />
        <SettingHeaderTitle title="Help Centre" />
        <SettingOption route="ToktokWalletHelpCentreSecurityPrivacy" title="Security and Privacy" />
        <SettingOption route="ToktokWalletTermsConditions" title="Terms and Conditions" />
        <SettingOption route="ToktokWalletHelpCentreContactUs" title="Contact Us" />
        <Separator />
        <SettingHeaderTitle title="Logs" />
        {menuData.map((item, index) => (
          <SettingOption route={item.route} title={item.label} />
        ))}
        <Separator />
        <SettingHeaderTitle title="Account Recovery" />
        <SettingOption route="ToktokWalletAccountRecoverySetup" title="Account Recovery Setup" />
      </ScrollView>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingVertical: 15,
  },
  settingoption: {
    padding: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  logo: {
    flexBasis: 45,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  arrowright: {
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLOR.LIGHT,
  },
});
