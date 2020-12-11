import React from 'react';
import {AlertContext} from '../provider/AlertProvider';

export const useAlert = () => {
  const alert = React.useContext(AlertContext);

  return alert;
};
