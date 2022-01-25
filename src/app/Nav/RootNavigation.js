import * as React from 'react';

export const navigationRef = React.createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
}

export const getCurrentRoute = () => {
  const route = navigationRef.current?.getCurrentRoute();
  return route.name
}

export const getRootState = ()=> {
  return navigationRef.current?.getRootState()
}

export const getCurrentOptions = ()=> {
  return navigationRef.current?.getCurrentOptions()
}