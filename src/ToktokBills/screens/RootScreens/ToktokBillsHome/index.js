import React from 'react'
import { View , Text , StyleSheet , Platform , FlatList, Dimensions , Image } from 'react-native'
import { HeaderBack , HeaderTitle , Separator } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'
import { useHeaderHeight } from '@react-navigation/stack';
import CONSTANTS from 'common/res/constants'
//SELF IMPORTS
import {
    BillerType
} from "./Components"

const {COLOR , FONT_FAMILY: FONT , FONT_SIZE} = CONSTANTS
const {width,height} = Dimensions.get("window")

const sampleData = [
    {
        name: "Cable/Internet sfsd sdfd",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
    {
        name: "Cable/Internet",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
    {
        name: "Cable/Internet",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
    {
        name: "Cable/Internet",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
    {
        name: "Cable/Internet",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
    {
        name: "Cable/Internet",
        logo: "toktokwallet/assets/image/tokwa.png"
    },
]

export const ToktokBillsHome = ({navigation,route})=> {
    // const headerHeight = useHeaderHeight()
    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={"toktokbills"} isRightIcon/>,
        headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
    });

    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <FlatList
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                data={sampleData}
                keyExtractor={(item)=>item.name}
                renderItem={({item,index})=><BillerType item={item} index={index}/>}
            />
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor:"white",
        padding: moderateScale(16)
    }
})
