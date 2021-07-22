import React from 'react';
import {ToktokAnnouncements, ToktokSelectedAnnouncement} from 'toktok/screens';

export default ({Navigator}) => (
  <>
    <Navigator.Screen name="ToktokAnnouncements" component={ToktokAnnouncements} />
    <Navigator.Screen name="ToktokSelectedAnnouncement" component={ToktokSelectedAnnouncement} />
  </>
);
