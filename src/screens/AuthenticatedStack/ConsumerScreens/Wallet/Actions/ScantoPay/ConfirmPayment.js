import React, {useState} from 'react'
import {View,Text,StyleSheet,Image,Alert,TextInput} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import { FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants'
import {numberFormat} from '../../../../../../helper'
import { PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import {useQuery,useMutation} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { onError } from '../../../../../../util/ErrorUtility';
import SuccessfulModal from '../Send/SuccessfulModal'

const ConfirmPayment = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Send money using toktok wallet','']}/>,
    })
    const { recipientInfo, walletinfo } = route.params
    const session = useSelector(state=>state.session)
    const [amount,setAmount] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [showpinModal,setShowPinModal] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")

    const [patchFundTransfer] = useMutation(PATCH_FUND_TRANSFER, {
        variables: {
            input: {
                amount: +amount,
                sourceUserId: session.user.id,
                destinationUserId: recipientInfo.id,
            }
        },
        onError: (error)=> {
            onError(error)
            setShowPinModal(false)
        },
        onCompleted: (response)=> {
            setSuccessModalVisible(true)
        }
    })

    const onSwipeSuccess = ()=> {
        if(amount.slice(-1) == ".") setAmount(amount.slice(0,-1))
        if(walletinfo.pincode != null){
            navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: ()=> patchFundTransfer()})
        }else{
            patchFundTransfer()
        }
    }

    const onSwipeFail = (e)=> {
        console.log(e)
    }

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9.]/g, '')
        let finalnum = num.substring(0,1) == 0 ? num.slice(1) : num

        // used if decimals are allowed
        let numberRegexPattern = /^[0-9]*(\.{1}\d{1,2})?$/g
        let checkPattern = finalnum.match(numberRegexPattern)
        if(!checkPattern){
            if(finalnum.slice(-2) == ".." || finalnum.slice(-1) != "."){
                finalnum = finalnum.slice(0, -1)
            }
            let doubleDecimalpoint = finalnum.match(/[.]/g)
            if(doubleDecimalpoint.length == 2){
                let amountaRRay = finalnum.split(".")
                finalnum = amountaRRay[1].length > 2 ? `${amountaRRay[0]}.${amountaRRay[1].slice(0,2)}` : `${amountaRRay[0]}.${amountaRRay[1]}`
            }
        }

        setAmount(finalnum)
        if(finalnum > 0 && finalnum <= walletinfo.balance){
            setSwipeEnabled(true)
            setErrorMessage("")
        }else{
            setSwipeEnabled(false)
            setErrorMessage(finalnum == "" ? "" : "You do not have enough balance")
        }
    }



    const thumbIconComponent = ()=> (
        <View>
            <Image style={{height: 15,width: 20}} source={require('../../../../../../assets/icons/walletSwipenext.png')}/>
        </View>
    )


    return (
        <>
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
                recipient={`${recipientInfo.name}`}
        />
        <View style={styles.container}>
            <View style={styles.content}>
                    <Text style={{marginLeft: 20, marginTop: 20, fontFamily: FONT_MEDIUM ,fontSize: 16}}>Send to</Text>
                    <View style={styles.receiverInfo}>
                        <Image style={{height: 50,width: 50,marginRight: 10}} resizeMode="contain" source={{uri: recipientInfo.image}}/>
                        <View>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>{recipientInfo.name}</Text>
                            <Text style={{fontSize:12,color:"#A6A8A9",fontFamily: FONT_REGULAR, marginTop:5,}}>{recipientInfo.contactNo}</Text>
                        </View>
                    </View>

                    <View style={{padding: 20}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16}}>Balance: {'\u20B1'} {numberFormat(walletinfo.balance)}</Text>
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
                         {
                             errorMessage != "" && <Text style={{fontFamily: FONT_REGULAR , color: "red",fontSize: 12,marginTop: 5}}>{errorMessage}</Text>
                         }
                    </View>
            </View>
            <SwipeButton 
                    disabled={!swipeEnabled}
                    disabledRailBackgroundColor="dimgray"
                    containerStyles={styles.swipeContainer}
                    width={250}
                    title={`Swipe to Pay ${'\u20B1'} ${amount != "" ? numberFormat(amount) : "0"}`}
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
                    shouldResetAfterSuccess={true}
                />
          
        </View>
      </>
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
        borderColor:"silver"
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