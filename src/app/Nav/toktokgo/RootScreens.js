import React from 'react';
import SelectedBookingDetails from '../../../ToktokGo/screens/ToktokGoBookingDetails';
import PinLocation from '../../../Toktok/screens/SavedLocationScreens/PinLocation';
import ToktokGoBookingStart from '../../../ToktokGo/screens/ToktokGoBookingStart';
import ToktokGoLanding from '../../../ToktokGo/screens/ToktokGoLanding';
import ToktokGoHealthCare from '../../../ToktokGo/screens/ToktokGoHealthCare';
import ToktokGoBookingSummary from '../../../ToktokGo/screens/ToktokGoBookingSummary';
import ToktokGoBookingSelectLocations from '../../../ToktokGo/screens/ToktokGoBookingSelectLocations';

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
    <Navigator.Screen name="ToktokGoBookingStart" component={ToktokGoBookingStart} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokGoLanding" component={ToktokGoLanding} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokGoHealthCare" component={ToktokGoHealthCare} options={{headerShown: false}} />
    <Navigator.Screen
      name="SelectedBookingDetails"
      component={SelectedBookingDetails}
      options={{headerStyle: navbarShadowOption}}
    />
    <Navigator.Screen name="PinLocation" component={PinLocation} />
    <Navigator.Screen name="ToktokGoBookingSummary" component={ToktokGoBookingSummary} options={{headerShown: false}} />
    <Navigator.Screen
      name="ToktokGoBookingSelectLocations"
      component={ToktokGoBookingSelectLocations}
      options={{headerShown: false}}
    />
  </>
);
