import React from 'react';
import CashInScreens from "./CashInScreens";
import CashOutScreens from "./CashOutScreens";
import KYCScreens from './KYCScreens';
import LandingScreens from './LandingScreens';
import ScanQRScreens from './ScanQRScreens';
import SendMoneyScreens from './SendMoneyScreens';
import SettingScreens from './SettingScreens';

export default ({Navigator}) => {
  return (
    <>
        {CashInScreens({Navigator})}
        {CashOutScreens({Navigator})}
        {KYCScreens({Navigator})}
        {LandingScreens({Navigator})}
        {ScanQRScreens({Navigator})}
        {SendMoneyScreens({Navigator})}
        {SettingScreens({Navigator})}
    </>
  );
};
