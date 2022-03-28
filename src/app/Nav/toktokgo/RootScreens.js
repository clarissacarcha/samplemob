import React from 'react';
import SelectedBookingDetails from '../../../ToktokGo/screens/BookingDetails/SelectedBookingDetails';
import PinLocation from '../../../Toktok/screens/SavedLocationScreens/PinLocation';

const navbarShadowOption = {
  backgroundColor: 'white',
  shadowColor: '#000',

  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

export default ({Navigator}) => (
  <>
    {/* INSERT SCREENS HERE */}
    <Navigator.Screen
      name="SelectedBookingDetails"
      component={SelectedBookingDetails}
      options={{headerStyle: navbarShadowOption}}
    />
    <Navigator.Screen name="PinLocation" component={PinLocation} />
  </>
);
