import React, {useState, createContext} from 'react';
import { useSelector } from 'react-redux';
import {AlertModal} from '../components';

//TOKTOKMALL
import { CustomConfirmModal, CustomMessageModal, CustomModal, CustomPlaceOrderModal, Modal, PopupModal, ToktokMallModal } from '../ToktokMall/Components';

const initialState = {
  visible: false,
  message: '',
  buttonLabel: '',
  actionButtons: [],
  title: null,
};

export const AlertContext = createContext(initialState);
const {Provider} = AlertContext;

const AlertProvider = ({children}) => {
  const [alertState, setAlertState] = useState(initialState);
  const {customModal, customConfirmModal, customMessageModal, customPlaceOrderModal, modal, popupmodal} = useSelector((state) => state.toktokMall);

  const alert = ({message, buttonLabel, actionButtons, title}) => {
    setAlertState({
      visible: true,
      message,
      buttonLabel,
      actionButtons,
      title,
    });
  };

  const close = () => {
    setAlertState(initialState);
  };

  return (
    <>
      <Provider value={alert}>{children}</Provider>
      <AlertModal {...alertState} close={close} />
      {modal?.visible && <ToktokMallModal />}
      {popupmodal?.visible && <PopupModal {...popupmodal} />}
    </>
  );
};

export default AlertProvider;
