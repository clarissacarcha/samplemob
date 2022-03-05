import React from 'react'
import {View,Text,StyleSheet,ScrollView} from 'react-native'
import { HeaderBack, YellowButton, HeaderTitle } from 'src/revamp'
import { Separator, SwipeProceedButton, CheckIdleState , FlagSecureScreen , BuildingBottom } from 'toktokwallet/components'
import { VectorIcon , ICON_SET } from 'src/revamp'
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
        headerTitle: ()=> <HeaderTitle label={[label]}/>,
        gestureEnabled: false,
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
        <ScrollView bounces={false} alwaysBounceVertical={false} style={styles.container} contentContainerStyle={{flexGrow:1}}>
            <View style={styles.header}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: "black"}}>Review and Confirm</Text>
              <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",marginTop:5}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                    <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M,marginLeft: 3,marginTop: -2,marginRight: 16}}>Please review the accuracy and completenes of the details
provided before you confirm</Text> 
              </View>
            </View>
            <View style={styles.content}>
               
                {RenderDisplay()}
            </View>
            <View style={{flex:1 ,justifyContent:"center",alignItems:"flex-start",padding: 16}}>
                {
                    event == "Send Money" &&
                    <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,marginTop: 15,textAlign:'left'}}>
                        Transaction cannot be reversed once confirmed and submitted
                    </Text>
                }
                {/* {
                    !data.fundTransferType &&
                    <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,textAlign:"left",marginTop: 10}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.M} /> Please review the accuracy and completeness of the details provided before you confirm.
                    </Text>
                } */}
                {
                    data.fundTransferType && data.fundTransferType == "Instapay" &&
                    <>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginBottom: 10,}}>
                        Based on the bank and amount provided, this transaction will be processed realtime via
                        <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,}}> InstaPay</Text>.
                    </Text>
                    <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,textAlign:"left"}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.M} /> Please ensure that all information is correct and validated before proceeding with this transaction.
                    </Text>
                    </>
                }
                {
                    data.fundTransferType && data.fundTransferType == "Pesonet" &&
                    <>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginBottom: 10}}>
                         Based on the bank and amount provided, this transaction will be processed via 
                         <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,}}> PESONet</Text>.
                    </Text>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginRight: 5}}>
                            -  
                        </Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",}}>
                        Same banking day transfer if made between 8:00AM - 3:00 PM (funds to be credited by 11:00 PM)
                        </Text>
                    </View>
                    <View style={{flexDirection:"row",}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginRight: 5}}>
                            -  
                        </Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",}}>
                        Next banking day transfer if made 3:01 PM onwards ( funds to be credited by 11:00 PM)
                        </Text>
                    </View>
                    <View style={{flexDirection:"row",marginBottom: 10}}>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginRight: 5}}>
                            -  
                        </Text>
                        <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",}}>
                        Banking days are from Monday to Friday excluding holidays. Please take note that transactions during weekends can be credited by Tuesday due to batch processing.
                        </Text>
                    </View>
                    <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,textAlign:"left"}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.M} /> Please ensure that all information is correct and validated before proceeding with this transaction.
                    </Text>
                    </>
                }
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
            <BuildingBottom/>
        </ScrollView>
        </CheckIdleState>
        </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        backgroundColor: "#FFF2D5",
        padding: 16,
        justifyContent:"center"
    },
    proceedBtn: {
        height: 70,
        justifyContent:"flex-end",
        marginBottom: 16,
        paddingHorizontal: 16,
    }
})


