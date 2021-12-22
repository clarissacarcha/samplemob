import React, {useState, createContext} from 'react';
import { useSelector } from 'react-redux';
import {AlertModal} from '../components';
import { CustomConfirmModal, CustomMessageModal, CustomModal, CustomPlaceOrderModal } from '../ToktokMall/Components';

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
  const {customModal, customConfirmModal, customMessageModal, customPlaceOrderModal} = useSelector((state) => state.toktokMall);

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
      {customModal?.visible && <CustomModal {...customModal} />}
      {customConfirmModal?.visible && <CustomConfirmModal {...customConfirmModal} />}
      {customMessageModal?.visible && <CustomMessageModal {...customMessageModal} />}
      {customPlaceOrderModal?.visible && <CustomPlaceOrderModal {...customPlaceOrderModal} />}
    </>
  );
};

export default AlertProvider;
