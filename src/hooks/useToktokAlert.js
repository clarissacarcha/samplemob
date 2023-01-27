import React from 'react';
import {ToktokAlertContext} from '../provider/ToktokAlertProvider';

export const useToktokAlert = () => {
  const alert = React.useContext(ToktokAlertContext);

  return alert;
};
