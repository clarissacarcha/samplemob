import React  from "react";
import { View , Text , StyleSheet , Image , Dimensions } from 'react-native'
import NoDataImage from 'toktokwallet/assets/images/no-record.png'
import { moderateScale } from 'toktokwallet/helper'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const imageWidth = 200;

export const NoData = ()=>{

    return(
        <View style={{paddingTop: 100}}>
            <View style={styles.center}>
                <Image source={NoDataImage} style={styles.image} resizeMode={'contain'} />
                <Text style={styles.title}>No Record Found</Text>
                <Text style={styles.text}>You have no transactions at the moment.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: moderateScale(imageWidth),
        width: moderateScale(imageWidth),
    },
    text: {
        fontFamily: FONT.REGULAR,
        fontSize: moderateScale(FONT_SIZE.L),
        color: COLOR.DARK,
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: moderateScale(FONT_SIZE.XL),
        color: COLOR.YELLOW,
        marginVertical: 20,
    }
})