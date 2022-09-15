import React from 'react';
import {PromptProviderContext} from '../Provider/PromptProvider';

export const useAlertGO = () => {
  const alert = React.useContext(PromptProviderContext);

  return alert;
};
