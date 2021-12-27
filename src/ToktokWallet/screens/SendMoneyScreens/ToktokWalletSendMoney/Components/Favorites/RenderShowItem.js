import React from 'react';
import { View , StyleSheet , Text } from 'react-native';
import { useThrottle } from 'src/hooks';

import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const RenderShowItem = ({
    item,
    selectFromList
})=> {

    const selectFavorite = ()=>{
        selectFromList(item)
    }

    const onPressThrottled = useThrottle(selectFavorite, 2000);

    return (
        <>

        </>
    )
}

export default RenderShowItem