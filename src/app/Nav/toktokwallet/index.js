import React from 'react';
import BankTransferScreens from './BankTransferScreens';
import CashInScreens from './CashInScreens';
import CashOutOTCScreens from './CashOutOTCScreens';
import CashOutScreens from './CashOutScreens';
import GlobalScreens from './GlobalScreens';
import KYCScreens from './KYCScreens';
import LandingScreens from './LandingScreens';
import RequestMoneyScreens from './RequestMoneyScreens';
import ScanQRScreens from './ScanQRScreens';
import SendMoneyScreens from './SendMoneyScreens';
import SettingScreens from './SettingScreens';
import TestingScreens from './TestingScreens';

export default ({Navigator}) => {
  return (
    <>
      {BankTransferScreens({Navigator})}
      {CashInScreens({Navigator})}
      {CashOutOTCScreens({Navigator})}
      {CashOutScreens({Navigator})}
      {GlobalScreens({Navigator})}
      {KYCScreens({Navigator})}
      {LandingScreens({Navigator})}
      {RequestMoneyScreens({Navigator})}
      {ScanQRScreens({Navigator})}
      {SendMoneyScreens({Navigator})}
      {SettingScreens({Navigator})}
      {TestingScreens({Navigator})}
    </>
  );
};
