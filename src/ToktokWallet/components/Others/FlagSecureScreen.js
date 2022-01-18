import React , {useEffect , useCallback , useState } from 'react'
import { View , Platform } from 'react-native'
import FlagSecure from 'react-native-flag-secure-android';
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';

export const FlagSecureScreen = ({children , enable = true})=> {
    // if(Platform.OS == "android"){
    //     enable ? FlagSecure.activate() : FlagSecure.deactivate()
    // }

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