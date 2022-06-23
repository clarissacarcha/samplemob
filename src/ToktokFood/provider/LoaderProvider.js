import React, {createContext, useState} from 'react';
import StyledLoader from 'toktokfood/components/StyledLoader';

const INITIAL_STATE = {
  isVisible: false,
  text: '',
  type: null,
};

export const LoaderContext = createContext([{}, () => {}]);

export const LoaderProvider = props => {
  const [loaderState, setLoaderState] = useState(INITIAL_STATE);
  const {isVisible, text, type} = loaderState;

  return (
    <LoaderContext.Provider value={[loaderState, setLoaderState]}>
      {props.children}
      <StyledLoader isVisible={isVisible} text={text} type={type} />
    </LoaderContext.Provider>
  );
};
