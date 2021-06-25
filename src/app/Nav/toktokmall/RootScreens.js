import React from 'react';
import { 

  //Addresses
  ToktokMallAddressesMenu,
  ToktokMallAddressesForm,

  //Checkout
  ToktokMallCheckout,

  //Notification
  ToktokMallNotifications,

  //Product Details
  ToktokMallProductDetails,

  //Home Search
  ToktokMallSearch,

  //Vouchers Claim
  ToktokMallVouchersClaim

 } from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallAddressesForm" component={ToktokMallAddressesForm} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallAddressesMenu" component={ToktokMallAddressesMenu} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallCheckout" component={ToktokMallCheckout} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallNotifications" component={ToktokMallNotifications} />
    <Navigator.Screen name="ToktokMallProductDetails" component={ToktokMallProductDetails} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallSearch" component={ToktokMallSearch} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallVouchersClaim" component={ToktokMallVouchersClaim} />
  </>
);
