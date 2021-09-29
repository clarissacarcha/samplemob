import React from 'react';
import {DeliverySummary, SearchContact, SearchMap} from 'toktok/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="DeliverySummary" component={DeliverySummary} />
    <Navigator.Screen name="SearchMap" component={SearchMap} />
    <Navigator.Screen name="SearchContact" component={SearchContact} />
  </>
);
