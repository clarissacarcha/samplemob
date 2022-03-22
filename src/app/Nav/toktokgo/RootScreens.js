import React from 'react';
import SelectedBookingDetails from '../../../ToktokGo/screens/BookingDetails/SelectedBookingDetails';
import PinLocation from '../../../Toktok/screens/SavedLocationScreens/PinLocation';

export default ({Navigator}) => (
  <>
    {/* INSERT SCREENS HERE */}
    <Navigator.Screen name="SelectedBookingDetails" component={SelectedBookingDetails} />
    <Navigator.Screen name="PinLocation" component={PinLocation} />
  </>
);
