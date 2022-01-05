import React from 'react';
import { View , StyleSheet , Text, TouchableOpacity } from 'react-native';
import { useThrottle } from 'src/hooks';
import { VectorIcon , ICON_SET } from 'src/revamp';
import CONSTANTS from 'common/res/constants'

const {FONT_SIZE , SIZE , FONT_FAMILY: FONT , COLOR} = CONSTANTS

const RenderHiddenItem = ({
    item,
    removeFromList
})=> {

    const removeFavorite = ()=> {
        removeFromList(item.item)
    }

    const onPressThrottled = useThrottle(removeFavorite, 2000);

    return (
        <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <TouchableOpacity onPress={onPressThrottled} style={styles.container}>
                 <VectorIcon iconSet={ICON_SET.Feather} name="trash" color="white" size={20}/>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 50,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:COLOR.RED,
        alignSelf:"flex-end"
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'white',
        right: 0,
        paddingLeft: 10,
    }
})

export default RenderHiddenItem