import React from 'react';
import {
  //Addresses
  ToktokMallAddressesMenu,
  ToktokMallAddressesForm,

  //Checkout
  ToktokMallCheckout,

  //My Orders
  ToktokMallMyOrders,

  //Notification
  ToktokMallNotifications,

  //Product Details
  ToktokMallProductDetails,

  //Home Search
  ToktokMallSearch,

  //Vouchers Claim
  ToktokMallVouchersClaim,
} from '../../../ToktokMall/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallAddressesForm" component={ToktokMallAddressesForm} />
    <Navigator.Screen name="ToktokMallAddressesMenu" component={ToktokMallAddressesMenu} />
    <Navigator.Screen name="ToktokMallCheckout" component={ToktokMallCheckout} />
    <Navigator.Screen name="ToktokMallMyOrders" component={ToktokMallMyOrders} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallNotifications" component={ToktokMallNotifications} />
    <Navigator.Screen
      name="ToktokMallProductDetails"
      component={ToktokMallProductDetails}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokMallSearch" component={ToktokMallSearch} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallVouchersClaim" component={ToktokMallVouchersClaim} />
  </>
);
