import React from 'react';
import CashInPayPandaScreens from './CashInPayPandaScreens';
import CashOutBDOScreens from './CashOutBDOScreens';
import CashOutGCashScreens from './CashOutGCashScreens';
import CashOutOtherBanksScreens from './CashOutOtherBanksScreens';
import KYCScreens from './KYCScreens';
import LandingScreens from './LandingScreens';
import ScanQRScreens from './ScanQRScreens';
import SendMoneyScreens from './SendMoneyScreens';
import SettingScreens from './SettingScreens';

export default ({Navigator}) => {
  return (
    <>
        {CashInPayPandaScreens({Navigator})}
        {CashOutBDOScreens({Navigator})}
        {CashOutGCashScreens({Navigator})}
        {CashOutOtherBanksScreens({Navigator})}
        {KYCScreens({Navigator})}
        {LandingScreens({Navigator})}
        {ScanQRScreens({Navigator})}
        {SendMoneyScreens({Navigator})}
        {SettingScreens({Navigator})}
    </>
  );
};
