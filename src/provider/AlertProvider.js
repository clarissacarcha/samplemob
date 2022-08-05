import React, {useState, createContext} from 'react';
import { useSelector } from 'react-redux';
import {AlertModal} from '../components';

//TOKTOKMALL
import { PopupModal, ToktokMallModal } from '../ToktokMall/Components';
import StyledLoader from 'toktokfood/components/StyledLoader';

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
  const {toktokMallModal, popupmodal} = useSelector((state) => state.toktokMall);
  const {loader} = useSelector((state) => state.toktokFood);
  const {isVisible, text, type} = loader;

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
      {toktokMallModal?.visible && <ToktokMallModal />}
      {popupmodal?.visible && <PopupModal {...popupmodal} />}      
      <StyledLoader isVisible={isVisible} text={text} type={type} />
    </>
  );
};

export default AlertProvider;
