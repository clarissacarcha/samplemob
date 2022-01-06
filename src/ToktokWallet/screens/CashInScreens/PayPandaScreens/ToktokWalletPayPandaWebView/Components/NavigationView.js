import React from 'react'
import { View , Text , StyleSheet } from 'react-native'
import { useThrottle } from 'src/hooks';

export const NavigationView = ({
    canGoBack,
    canGoForward,
    goBack,
    goForward,
})=> {

    const onThrottledBackPress = useThrottle(goBack , 2000);
    const onThrottledForwardPress = useThrottle(goForward , 2000);

    return (
        <>
        
        </>
    )
}

const styles = StyleSheet.create({

})