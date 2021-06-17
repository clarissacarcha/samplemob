import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { COLORS, FONTS, SIZES } from '../../../../../res/constants'
import { HeaderBack, YellowButton, HeaderTitle } from '../../../../../revamp'
import { Separator, SwipeProceedButton } from '../Components'

//SELF IMPORTS
import CashIn from "./CashIn";
import CashOut from "./CashOut";
import SendMoney from "./SendMoney";
import CashOutOtherBank from "./CashOutOtherBank";

const ToktokWalletReviewAndConfirm = ({navigation,route})=> {

    const label = route.params.label
    const onConfirm = route.params.onConfirm
    const data = route.params.data ? route.params.data : null
    const onSwipeFail = route.params.onSwipeFail ? route.params.onSwipeFail : null
    const onSwipeSuccess = route.params.onSwipeSuccess ? route.params.onSwipeSuccess : null
    const isSwipe = route.params.isSwipe ? route.params.isSwipe : null
    const swipeTitle = route.params.swipeTitle ? route.params.swipeTitle : null
    
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[label]}/>
    })

    const confirm = ()=> {
        // navigation.replace("ToktokWalletSecurityPinCode", {onConfirm: onConfirm})
        onConfirm()
    }

    const RenderDisplay = ()=> {
        switch(label){
            case "Cash In":
                return <CashIn data={data}/>
            case "Cash Out":
                return <CashOut data={data}/>
            case "Send Money":
                return <SendMoney data={data}/>
            case "Fund Transfer":
                return <CashOutOtherBank data={data}/>
            default:
                return
        }
    }
    return (
        <>
        <Separator/>
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={{fontFamily: FONTS.BOLD, fontSize: SIZES.M,color: COLORS.DARK}}>Review and Confirm</Text>
                {RenderDisplay()}
            </View>
            <View style={styles.proceedBtn}>
                {
                    isSwipe
                    ?  <SwipeProceedButton 
                                enabled={true}
                                title={swipeTitle}
                                onSwipeFail={onSwipeFail}
                                onSwipeSuccess={onSwipeSuccess}
                        />
                    : <YellowButton onPress={confirm} label="Confirm" />
                }
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
    content: {
        flex: 1,
    },
    proceedBtn: {
        height: 70,
        justifyContent:"flex-end",
    }
})

export default ToktokWalletReviewAndConfirm