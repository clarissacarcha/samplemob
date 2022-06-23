import {useContext} from 'react';
import {LoaderContext} from '../provider/LoaderProvider';

export const useLoader = () => {
  const [loaderState, setLoaderState] = useContext(LoaderContext);
  return [loaderState, setLoaderState];
};
