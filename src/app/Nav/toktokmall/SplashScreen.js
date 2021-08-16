import React from 'react'
import SplashScreen from '../../../ToktokMall/screens/SplashScreen'

export default ({Navigator}) => {
    return (
      <>
        <Navigator.Screen name="ToktokMallSplashScreen" component={SplashScreen} options={{headerShown: false}}  />
      </>
    )
  };