import React, {useState, createContext, Children} from 'react';
import {ErrorModal} from '../components';

const initialState = {
  title: '',
  message: '',
  visible: false,
};

export const PromptProviderContext = createContext(initialState);
const {Provider} = PromptProviderContext;

export const PromptProviderGo = ({children}) => {
  const [promptState, setPromptstate] = useState(initialState);

  const prompt = ({title, message}) => {
    setPromptstate({
      title,
      message,
      visible: true,
    });
  };

  const close = () => {
    setPromptstate(initialState);
  };

  return (
    <>
      <Provider value={prompt}>{children}</Provider>
      <ErrorModal {...promptState} close={close} />
    </>
  );
};
