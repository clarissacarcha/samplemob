import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { HeaderBack, YellowButton, HeaderTitle } from 'src/revamp'
import { Separator, SwipeProceedButton, CheckIdleState , FlagSecureScreen } from 'toktokwallet/components'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    CashIn,
    CashInDragonPay,
    CashOut,
    CashOutOtherBank,
    RequestMoney,
    SendMoney
} from "./Components"

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

export const ToktokWalletReviewAndConfirm = ({navigation,route})=> {

    const label = route.params.label
    const event = route.params.event
    const onConfirm = route.params.onConfirm
    const data = route.params.data ? route.params.data : null
    const onSwipeFail = route.params.onSwipeFail ? route.params.onSwipeFail : null
    const onSwipeSuccess = route.params.onSwipeSuccess ? route.params.onSwipeSuccess : null
    const isSwipe = route.params.isSwipe ? route.params.isSwipe : null
    const swipeTitle = route.params.swipeTitle ? route.params.swipeTitle : null
    
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={[label]}/>
    })

    const confirm = ()=> {
        onConfirm()
    }

    const RenderDisplay = ()=> {
        switch(event){
            case "Cash In":
                return <CashIn data={data}/>
            case "Cash In Dragon Pay":
                return <CashInDragonPay data={data}/>
            case "Cash Out":
                return <CashOut data={data}/>
            case "Send Money":
                return <SendMoney data={data}/>
            case "Fund Transfer":
                return <CashOutOtherBank data={data}/>
            case "Request Money":
                return <RequestMoney data={data}/>
            default:
                return
        }
    }
    return (
        <FlagSecureScreen>
        <CheckIdleState>
        <Separator/>
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Review and Confirm</Text>
                {RenderDisplay()}
            </View>
            <View style={{flex:1 ,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"center"}}>
Please make sure all information provided is correct
before clicking the confirmation button.
                </Text>
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
        </CheckIdleState>
        </FlagSecureScreen>
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
