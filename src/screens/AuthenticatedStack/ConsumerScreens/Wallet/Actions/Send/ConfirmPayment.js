import React, {useState} from 'react'
import {View,Text,StyleSheet,Image,Alert,TouchableOpacity,TextInput} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants';
import {numberFormat} from '../../../../../../helper'

const ConfirmPayment = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Choose a Recipient','']}/>,
    })

    const [amount,setAmount] = useState("")

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9]/g, '')
        setAmount(num.substring(0,1) == 0 ? num.slice(1) : num)
    }

    const onSwipeSuccess = ()=> {
        console.log("Success")
        Alert.alert("Success")
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }


    const thumbIconComponent = ()=> (
        <View>
            <Image style={{height: 15,width: 20}} source={require('../../../../../../assets/icons/walletSwipenext.png')}/>
        </View>
    )


    return (
        <View style={styles.container}>
            <View style={styles.content}>
                    <View style={styles.receiverInfo}>
                        <Image style={{height: 50,width: 50,marginRight: 10}} resizeMode="contain" source={require('../../../../../../assets/icons/ToktokLogo.png')}/>
                        <View style={{justifyContent: "center"}}>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>Alvin Sison Raquem</Text>
                            <Text style={{fontSize:12,color:"#A6A8A9",fontFamily: FONT_REGULAR,}}>+639123456789</Text>
                        </View>
                        <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsSend")} style={{flex: 1,alignItems: "flex-end",justifyContent: "center"}}>
                            <Text style={{color: "#F6841F",fontSize: 10, fontFamily: FONT_MEDIUM}}>Change Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Balance: {'\u20B1'} 500.00</Text>
                        <View style={styles.amount}>
                                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM,alignSelf:"center"}}>{'\u20B1'} </Text>
                                <TextInput
                                        value={amount}
                                        onChangeText={value=>changeAmount(value)}
                                        keyboardType="numeric"
                                        placeholder="Enter Amount" 
                                        style={{fontSize: 12,fontFamily: FONT_REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                                />
                        </View>
                    </View>
            </View>
            <SwipeButton 
                    containerStyles={styles.swipeContainer}
                    width={250}
                    title={`Swipe to Pay ${'\u20B1'} ${amount != "" ? numberFormat(amount) : "0.00"}`}
                    titleStyles={{
                        fontSize: 12,
                        fontFamily: FONT_MEDIUM,
                        paddingLeft: 20,
                    }}
                    titleColor="white"
                    railBackgroundColor="black"
                    railStyles={{
                        backgroundColor: "white",
                        margin: 0,
                        borderColor: "black"
                    }}
                    thumbIconBackgroundColor="white"
                    thumbIconBorderColor="black"
                    thumbIconStyles={{
                        borderWidth: 1,
                        borderColor:"black"
                    }}
                    thumbIconComponent={thumbIconComponent}
                    onSwipeFail={onSwipeFail}
                    onSwipeSuccess={onSwipeSuccess}
                    resetAfterSuccessAnimDelay={0}
                    resetAfterSuccessAnimDuration={0}
                    shouldResetAfterSuccess={false}
                />
          
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        flex: 1,
    },
    swipeContainer: {
       alignSelf:"center",
       marginBottom: 20,
    },
    receiverInfo: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection:"row",
        borderBottomWidth: 0.5,
        borderColor:"silver",
    },
    amount: {
        padding: 5,
        width: "100%",
        borderColor: "silver",
        borderWidth: .5,
        marginTop: 10,
        borderRadius: 5,
        flexDirection: "row",
    }

})

export default ConfirmPayment