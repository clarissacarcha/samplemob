import React from 'react';
import {DeliveryInformation, DeliveryStops, StopInformation, ToktokVehicleInformation} from 'toktok/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="DeliveryDetails" component={DeliveryInformation} />
    <Navigator.Screen name="ToktokDelivery" component={DeliveryStops} options={{headerShown: false}} />
    <Navigator.Screen name="StopDetails" component={StopInformation} options={{headerShown: false}} />
    <Navigator.Screen name="ToktokVehicleInformation" component={ToktokVehicleInformation} />
  </>
);
