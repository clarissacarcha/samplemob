import React from 'react'
import { View , Text , Dimensions, StyleSheet , Image , TouchableHighlight } from 'react-native'
import {  } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'
import { useNavigation } from '@react-navigation/native'
import { useThrottle } from 'src/hooks'
import CONSTANTS from 'common/res/constants'
const {COLOR , FONT_FAMILY: FONT , FONT_SIZE , SHADOW} = CONSTANTS
const {width,height} = Dimensions.get("window")

import toktokwalletlogo from 'toktokwallet/assets/images/tokwa.png'

export const BillerType = ({
    item,
    index
})=> {
    const navigation = useNavigation();
    const onPress = ()=> {
        navigation.navigate("ToktokBiller" , {biller: item})
    }

    const onThrottledPress = useThrottle(onPress , 2000)

    return (
        <TouchableHighlight onPress={onThrottledPress} underlayColor={COLOR.YELLOW} style={styles.container} key={`billerType_${index}`}>
            <View style={styles.item}>
                   <Image
                        source={toktokwalletlogo}
                        style={styles.itemLogo}
                   />
                   <Text style={styles.itemName}>{item.name}</Text>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        height: moderateScale(120),
        width: moderateScale(120),
        justifyContent:"center",
    },
    item: {
        flex: 1,
        justifyContent:"center",
        alignItems: "center",
        margin: 5,
        ...SHADOW,
        backgroundColor: "white"
    },
    itemLogo: {
        height: moderateScale(60),
        width: moderateScale(60)
    },
    itemName: {
        fontFamily: FONT.REGULAR,
        fontSize: moderateScale(FONT_SIZE.M),
        textAlign:"center"
    }
})