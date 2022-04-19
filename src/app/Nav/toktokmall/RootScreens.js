import React from 'react';
import {
  //Addresses
  ToktokMallAddressesMenu,
  ToktokMallAddressesForm,

  //Checkout
  ToktokMallCheckout,

  ToktokMallOrderDetails,

  ToktokMallRateProduct,

  ToktokMallPaymentWebview,

  //Product Details
  ToktokMallProductDetails,

  ToktokMallProductRatings,

  //Home Search
  ToktokMallSearch,

  //Visit Store
  ToktokMallStore,

  ToktokMallStoreSearch,

  //Vouchers Claim
  ToktokMallVouchersClaim,

  //Toktokwallet OTP Screen
  ToktokMallOTP
} from '../../../ToktokMall/screens';
import { ToktokMallRateProductCamera } from '../../../ToktokMall/screens/RootScreens/ToktokMallRateProduct/Components';
import { ToktokMallEmptyCheckout } from '../../../ToktokMall/screens/RootScreens/ToktokMallCheckout/empty';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallAddressesForm" component={ToktokMallAddressesForm} />
    <Navigator.Screen name="ToktokMallAddressesMenu" component={ToktokMallAddressesMenu} />
    <Navigator.Screen name="ToktokMallCheckout" component={ToktokMallCheckout} />
    <Navigator.Screen name="ToktokMallEmptyCheckout" component={ToktokMallEmptyCheckout} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallOrderDetails" component={ToktokMallOrderDetails} />    
    <Navigator.Screen name="ToktokMallPaymentWebview" component={ToktokMallPaymentWebview} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallProductDetails" component={ToktokMallProductDetails} options={{headerShown: false}}/>
    <Navigator.Screen name="ToktokMallProductRatings" component={ToktokMallProductRatings} />
    <Navigator.Screen name="ToktokMallRateProduct" component={ToktokMallRateProduct} />
    <Navigator.Screen name="ToktokMallRateProductCamera" component={ToktokMallRateProductCamera} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallSearch" component={ToktokMallSearch} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallStore" component={ToktokMallStore} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallStoreSearch" component={ToktokMallStoreSearch} options={{headerShown: false}} />    
    <Navigator.Screen name="ToktokMallVouchersClaim" component={ToktokMallVouchersClaim} />
    <Navigator.Screen name="ToktokMallOTP" component={ToktokMallOTP} options={{headerShown: false}} />    
  </>
);
