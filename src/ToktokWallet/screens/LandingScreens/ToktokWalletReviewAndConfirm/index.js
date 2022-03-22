import React , {useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TouchableOpacity} from 'react-native'
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
    SendMoney
} from "./Components"

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const ViewMorePesonet = ({
    viewMore,
    setViewMore
})=>{
    return (
        <>
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
            <TouchableOpacity onPress={()=>setViewMore(!viewMore)} style={{width: "100%",alignItems:"flex-end"}}> 
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color:COLOR.YELLOW}}>Read Less <VectorIcon iconSet={ICON_SET.Feather} name="chevron-up" color={COLOR.YELLOW} size={FONT_SIZE.L} /></Text>
            </TouchableOpacity>
        </>
    )
}

const RenderFundTransferReminder = ({
    fundTransferType,
    event
})=> {  

    const [viewMore,setViewMore] = useState(false)

    if(fundTransferType == "Instapay"){
        return (
            <>
            <View style={{marginVertical: 10}}>
            <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left"}}>
            <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.M} /> Please ensure that all information is correct and validated before proceeding with this transaction.
            </Text>
            </View>
            <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginBottom: 10,}}>
                Based on the bank and amount provided, this transaction will be processed realtime via
                <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,}}> InstaPay</Text>.
            </Text>
            </>
        )
    }

    return(
        <>
            <View style={{marginVertical: 10}}>
            <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left"}}>
            <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.M} /> Please ensure that all information is correct and validated before proceeding with this transaction.
            </Text>
            </View>
            <Text style={{fontFamily: FONT.REGULAR,fontSize:FONT_SIZE.M,textAlign:"left",marginBottom: 10}}>
                Based on the bank and amount provided, this transaction will be processed via 
                <Text style={{fontFamily: FONT.BOLD,fontSize:FONT_SIZE.M,}}> PESONet</Text>.
            </Text>
            {
                viewMore 
                ? <ViewMorePesonet 
                    setViewMore={setViewMore}
                    viewMore={viewMore}
                />
                : <TouchableOpacity onPress={()=>setViewMore(!viewMore)} style={{width: "100%",alignItems:"flex-end"}}> 
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,color:COLOR.YELLOW}}>Read more <VectorIcon iconSet={ICON_SET.Feather} name="chevron-down" color={COLOR.YELLOW} size={FONT_SIZE.L} /></Text>
                  </TouchableOpacity>
            }
          
            </>
    )
}

const RenderOtherServieReminder = ({
    event
})=> {

    if(event == "Send Money"){
        return (
            <>
            <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",marginTop:5}}>
                    <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                    <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M,marginLeft: 3,marginTop: -2,marginRight: 16}}>
                    Please ensure that all information is correct and validated before proceeding with this transaction.
                    </Text> 
            </View>
            <Text style={{fontFamily:FONT.BOLD,fontSize: FONT_SIZE.M,marginLeft: 3,marginTop: 10,marginRight: 16}}>
            Transaction cannot be reversed once confirmed and submitted.
            </Text> 
            </>
        )
    }

    return (
        <>
         <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",marginTop:5}}>
                <VectorIcon iconSet={ICON_SET.Feather} name="info" color={COLOR.YELLOW} size={FONT_SIZE.XL} />  
                <Text style={{fontFamily:FONT.REGULAR,fontSize: FONT_SIZE.M,marginLeft: 3,marginTop: -2,marginRight: 16}}>Please review the accuracy and completenes of the details
                    provided before you confirm</Text> 
        </View>
        </>
    )
}

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
              {
                  data.fundTransferType
                  ? <RenderFundTransferReminder
                        fundTransferType={data.fundTransferType}
                        event={event}
                    />
                   : <RenderOtherServieReminder
                        event={event}
                   /> 
              }
              </View>
             
            <View style={styles.content}>
               
                {RenderDisplay()}
            </View>
            <View style={{flex:1 ,justifyContent:"flex-end",alignItems:"center",paddingHorizontal: 16,marginVertical: 10,marginTop: 40}}>
                     <TouchableOpacity 
                            // onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                            onPress={()=>navigation.navigate("ToktokWalletTermsConditions")}
                            style={{paddingLeft: 5,marginRight: 16}}
                        >
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Please read our <Text style={{color: COLOR.ORANGE,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Terms and Conditions</Text> before you proceed with your transaction.</Text>
                        </TouchableOpacity>
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


