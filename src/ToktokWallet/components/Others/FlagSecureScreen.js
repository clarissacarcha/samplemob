import React , {useEffect , useCallback , useState } from 'react'
import { View , Platform } from 'react-native'
import FlagSecure from 'react-native-flag-secure-android';
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';
import { useAccount } from 'toktokwallet/hooks'

export const FlagSecureScreen = ({children , enable = true})=> {
  const { tokwaAccount } = useAccount();

  if(Platform.OS == "android" && tokwaAccount.constants.androidFlagSecure === 1){
    enable ? FlagSecure.activate() : FlagSecure.deactivate()
  }

  // useFocusEffect(useCallback(()=>{
  //     FlagSecure.activate();
  //     return ()=> {
  //         FlagSecure.deactivate();
  //     }
  // },[]))

  return (
    <View style={{flex: 1,}}>
      {children}
    </View>
  )
}