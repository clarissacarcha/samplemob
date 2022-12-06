import React, {useState, createContext} from 'react';
import {ToktokAlertModal} from '../components_section/Modals';

const initialState = {
  imageType: 'warning',
  image: null,
  noImage: false,
  title: null,
  message: null,
  visible: false,
  onPressButtonLeft: null,
  onPressButtonRight: null,
  onPressSingleButton: null,
  buttonLeftText: null,
  buttonRightText: null,
  buttonSingleText: 'OK',
  customMessage: null,
};

export const ToktokAlertContext = createContext(initialState);
const {Provider} = ToktokAlertContext;

export const ToktokAlertProvider = ({children}) => {
  const [alertState, setAlertState] = useState(initialState);

  const alert = ({
    title,
    message,
    image,
    noImage,
    imageType,
    onPressButtonLeft,
    onPressButtonRight,
    onPressSingleButton,
    buttonLeftText,
    buttonRightText,
    buttonSingleText,
    customMessage,
  }) => {
    setAlertState({
      visible: true,
      imageType,
      image,
      noImage,
      title,
      message,
      onPressButtonLeft,
      onPressButtonRight,
      onPressSingleButton,
      buttonLeftText,
      buttonRightText,
      buttonSingleText,
      customMessage,
    });
  };

  const close = () => {
    setAlertState(initialState);
  };

  return (
    <>
      <Provider value={alert}>{children}</Provider>
      <ToktokAlertModal {...alertState} close={close} />
    </>
  );
};
