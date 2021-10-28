import React  from "react";
import { View , Text , StyleSheet , Image , Dimensions } from 'react-native'
import NoDataImage from 'src/assets/images/NoData.png'
import CONSTANTS from 'common/res/constants';

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS
const imageWidth = Dimensions.get('window').width - 200;

export const NoData = ()=>{

    return(
        <View style={{paddingTop: 100}}>
            <View style={styles.center}>
                <Image source={NoDataImage} style={styles.image} resizeMode={'contain'} />
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
        height: imageWidth,
        width: imageWidth,
    },
})