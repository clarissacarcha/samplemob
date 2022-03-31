import React from 'react';
import SelectedBookingDetails from '../../../ToktokGo/screens/ToktokGoBookingDetails';
import PinLocation from '../../../Toktok/screens/SavedLocationScreens/PinLocation';
import ToktokGoBookingStart from '../../../ToktokGo/screens/ToktokGoBookingStart';
import ToktokGoBookingSummary from '../../../ToktokGo/screens/ToktokGoBookingSummary';

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
    <Navigator.Screen name="ToktokGoBookingStart" component={ToktokGoBookingStart} />
    <Navigator.Screen
      name="SelectedBookingDetails"
      component={SelectedBookingDetails}
      options={{headerStyle: navbarShadowOption}}
    />
    <Navigator.Screen name="PinLocation" component={PinLocation} />
    <Navigator.Screen name="ToktokGoBookingSummary" component={ToktokGoBookingSummary} options={{headerShown: false}} />
  </>
);
