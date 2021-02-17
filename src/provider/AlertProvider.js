import React, {useState, createContext} from 'react';
import {AlertModal} from '../components';

const initialState = {
  visible: false,
  message: '',
  buttonLabel: '',
  actionButtons: [],
};

export const AlertContext = createContext(initialState);
const {Provider} = AlertContext;

const AlertProvider = ({children}) => {
  const [alertState, setAlertState] = useState(initialState);

  const alert = ({message, buttonLabel, actionButtons}) => {
    setAlertState({
      visible: true,
      message,
      buttonLabel,
      actionButtons,
    });
  };

  const close = () => {
    setAlertState(initialState);
  };

  return (
    <>
      <Provider value={alert}>{children}</Provider>
      <AlertModal {...alertState} close={close} />
    </>
  );
};

export default AlertProvider;
