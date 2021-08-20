import React from 'react';
import {
  //Addresses
  ToktokMallAddressesMenu,
  ToktokMallAddressesForm,

  //Checkout
  ToktokMallCheckout,

  //Visit Store
  ToktokMallStore,

  //Product Details
  ToktokMallProductDetails,

  ToktokMallProductRatings,

  //Home Search
  ToktokMallSearch,

  ToktokMallRateProduct,

  //Vouchers Claim
  ToktokMallVouchersClaim,
} from '../../../ToktokMall/screens';
import { ToktokMallRateProductCamera } from '../../../ToktokMall/screens/RootScreens/ToktokMallRateProduct/Components';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokMallAddressesForm" component={ToktokMallAddressesForm} />
    <Navigator.Screen name="ToktokMallAddressesMenu" component={ToktokMallAddressesMenu} />
    <Navigator.Screen name="ToktokMallCheckout" component={ToktokMallCheckout} />
    <Navigator.Screen name="ToktokMallProductDetails" component={ToktokMallProductDetails} options={{headerShown: false}}/>
    <Navigator.Screen name="ToktokMallProductRatings" component={ToktokMallProductRatings} />
    <Navigator.Screen name="ToktokMallRateProduct" component={ToktokMallRateProduct} />
    <Navigator.Screen name="ToktokMallRateProductCamera" component={ToktokMallRateProductCamera} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallSearch" component={ToktokMallSearch} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallStore" component={ToktokMallStore} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokMallVouchersClaim" component={ToktokMallVouchersClaim} />
  </>
);
