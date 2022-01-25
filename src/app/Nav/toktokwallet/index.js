import React from 'react';
import {View,PanResponder} from 'react-native';
import CashInScreens from "./CashInScreens";
import CashOutScreens from "./CashOutScreens";
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
        {CashInScreens({Navigator})}
        {CashOutScreens({Navigator})}
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
