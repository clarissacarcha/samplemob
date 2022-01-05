import React from 'react';
import { View , StyleSheet , Text , TouchableOpacity } from 'react-native';
import { useThrottle } from 'src/hooks';
import { moderateScale } from 'toktokwallet/helper'

import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const RenderShowItem = ({
    item,
    selectFromList
})=> {

    const account = item.item.favoriteAccount
    const person = `${account.person.firstName} ${account.person.lastName}`
    const mobileNumber = account.mobileNumber

    const selectFavorite = ()=>{
        selectFromList(item.item)
    }

    const onPressThrottled = useThrottle(selectFavorite, 2000);

    return (
        <View style={styles.rowFront}>
             <TouchableOpacity onPress={onPressThrottled} style={styles.favorite}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,flex:1}}>{person}</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,color: COLOR.ORANGE}}>{mobileNumber}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: moderateScale(45),
    },
    favorite: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        // margin: 20,
        minHeight: moderateScale(45)
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 50,
    },
})

export default RenderShowItem