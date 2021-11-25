import React , {useEffect , useCallback , useState } from 'react'
import { View } from 'react-native'
import FlagSecure from 'react-native-flag-secure-android';
import { useNavigation , useFocusEffect  , useRoute} from '@react-navigation/native';

export const FlagSecureScreen = ({children , enable = true})=> {
    if(enable){
        FlagSecure.activate();
    }else{
        FlagSecure.deactivate();
    }
    

    return (
        <View style={{flex: 1,}}>
            {children}
        </View>
    )
}