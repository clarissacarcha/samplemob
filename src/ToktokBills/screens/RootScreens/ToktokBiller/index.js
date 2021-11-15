import React , {useEffect} from 'react'
import { View , Text , StyleSheet , Platform , FlatList, Dimensions , Image , TouchableHighlight} from 'react-native'
import { HeaderBack , HeaderTitle , Separator } from 'toktokbills/components'
import { moderateScale } from 'toktokbills/helper'
import { usePrompt , useThrottle } from 'src/hooks'

export const ToktokBiller = ({navigation, route})=> {
    const { biller } = route.params
    const prompt = usePrompt()

    navigation.setOptions({
        headerLeft: () => <HeaderBack />,
        headerTitle: () => <HeaderTitle label={biller.name} isRightIcon/>,
        headerStyle: { height: Platform.OS == 'ios' ? moderateScale(60) : moderateScale(80) }
    });
    

    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <TouchableHighlight hitSlop={{top: 100 , bottom: 100 ,right: 100, left: 100}} onPress={()=> prompt({
                type: "success",
                title: "Payment Successful",
                message: `Your payment to PLDT amounting to ₱ 2100.00 has been successfully processed with ref no. 0987654321 on September 15, 2021, 5:00 pm.`,
                onPress: ()=> navigation.navigate("ToktokBillsEnterOTP")
            })}>
                <View>
                    <Text>gg</Text>
                </View>
            </TouchableHighlight>
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
