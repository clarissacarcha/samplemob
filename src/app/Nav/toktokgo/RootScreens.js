import React from 'react';
import SelectedBookingDetails from '../../../ToktokGo/screens/ToktokGoBookingDetails';
import ToktokGoBookingStart from '../../../ToktokGo/screens/ToktokGoBookingStart';
import ToktokGoLanding from '../../../ToktokGo/screens/ToktokGoLanding';
import ToktokGoHealthCare from '../../../ToktokGo/screens/ToktokGoHealthCare';
import ToktokGoBookingSummary from '../../../ToktokGo/screens/ToktokGoBookingSummary';
import ToktokGoBookingSelectLocations from '../../../ToktokGo/screens/ToktokGoBookingSelectLocations';
import ToktokGoRecentDestinations from '../../../ToktokGo/screens/ToktokGoBookingRecentDestinations';
import ToktokGoFrequentlyUsed from '../../../ToktokGo/screens/ToktokGoBookingFrequentlyUsed';
import ToktokGoBookingVehicle from '../../../ToktokGo/screens/ToktokGoBookingVehicle';
import ToktokGoBookingConfirmPickup from '../../../ToktokGo/screens/ToktokGoBookingConfirmPickup';
import ToktokGoBookingConfirmDestination from '../../../ToktokGo/screens/ToktokGoBookingConfirmDestination';
import ToktokGoFindingDriver from '../../../ToktokGo/screens/ToktokGoFindingDriver';
import ToktokGoOnTheWayRoute from '../../../ToktokGo/screens/ToktokGoOnTheWayRoute';
import ToktokGoRateDriver from '../../../ToktokGo/screens/ToktokGoRateDriver';
import ToktokGoBookingVouchers from '../../../ToktokGo/screens/ToktokGoBookingVouchers';
import ToktokGoOnBoardingBeta from '../../../ToktokGo/screens/ToktokGoOnBoardingBeta';
import ToktokGoMaintance from '../../../ToktokGo/screens/ToktokGoMaintance';
import ToktokGoPaymentDetails from '../../../ToktokGo/screens/ToktokGoPaymentDetails';
import ToktokGoCreateTokwa from '../../../ToktokGo/screens/ToktokGoCreateTokwa';
import ToktokGoBookingSelectedVoucher from '../../../ToktokGo/screens/ToktokGoBookingSelectedVoucher';
import ToktokGoNewGuidelines from '../../../ToktokGo/screens/ToktokGoNewGuidelines';

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
    <Navigator.Screen name="ToktokGoNewGuidelines" component={ToktokGoNewGuidelines} options={{headerShown: false}} />
    <Navigator.Screen
      name="SelectedBookingDetails"
      component={SelectedBookingDetails}
      options={{headerStyle: navbarShadowOption}}
    />
    <Navigator.Screen name="ToktokGoBookingSummary" component={ToktokGoBookingSummary} options={{headerShown: false}} />
    <Navigator.Screen
      name="ToktokGoBookingSelectLocations"
      component={ToktokGoBookingSelectLocations}
      options={{headerShown: false}}
    />
    <Navigator.Screen
      name="ToktokGoRecentDestinations"
      component={ToktokGoRecentDestinations}
      options={{
        headerShown: false,
      }}
    />
    <Navigator.Screen
      name="ToktokGoFrequentlyUsed"
      component={ToktokGoFrequentlyUsed}
      options={{
        headerShown: false,
      }}
    />
    <Navigator.Screen
      name="ToktokGoBookingVehicle"
      component={ToktokGoBookingVehicle}
      options={{
        headerShown: false,
      }}
    />
    <Navigator.Screen
      name="ToktokGoBookingConfirmPickup"
      component={ToktokGoBookingConfirmPickup}
      options={{headerShown: false}}
    />
    <Navigator.Screen
      name="ToktokGoBookingConfirmDestination"
      component={ToktokGoBookingConfirmDestination}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokGoFindingDriver" component={ToktokGoFindingDriver} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokGoOnTheWayRoute" component={ToktokGoOnTheWayRoute} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokGoRateDriver" component={ToktokGoRateDriver} options={{headerShown: false}} />
    <Navigator.Screen
      name="ToktokGoBookingVouchers"
      component={ToktokGoBookingVouchers}
      options={{headerShown: false}}
    />
    <Navigator.Screen name="ToktokGoOnBoardingBeta" component={ToktokGoOnBoardingBeta} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokGoMaintance" component={ToktokGoMaintance} options={{headerShown: false}} />
    <Navigator.Screen
      name="ToktokGoPaymentDetails"
      component={ToktokGoPaymentDetails}
      options={{headerStyle: navbarShadowOption}}
    />
    <Navigator.Screen name="ToktokGoCreateTokwa" component={ToktokGoCreateTokwa} options={{headerShown: false}} />
    <Navigator.Screen
      name="ToktokGoBookingSelectedVoucher"
      component={ToktokGoBookingSelectedVoucher}
      options={{headerShown: false}}
    />
  </>
);
