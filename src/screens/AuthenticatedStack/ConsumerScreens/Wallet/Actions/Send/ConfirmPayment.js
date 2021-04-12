import React, {useState,useEffect} from 'react'
import {View,Text,StyleSheet,Image,Alert,TouchableOpacity,TextInput,ActivityIndicator,KeyboardAvoidingView,Platform} from 'react-native'
import SwipeButton from 'rn-swipe-button';
import {HeaderBack, HeaderTitle} from '../../../../../../components'
import { COLOR, FONT_LIGHT, FONT_MEDIUM, FONT_REGULAR } from '../../../../../../res/constants';
import {numberFormat} from '../../../../../../helper'
import { PATCH_FUND_TRANSFER} from '../../../../../../graphql'
import {useQuery,useMutation} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { onError } from '../../../../../../util/ErrorUtility';
import SuccessfulModal from './SuccessfulModal'

const ConfirmPayment = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack />,
        headerTitle: ()=> <HeaderTitle label={['Send money using toktok wallet','']}/>,
    })

    

    const recipientInfo = route.params.recipientInfo
    const walletinfo = route.params.walletinfo
    const session = useSelector(state=>state.session)
    const [tempAmount,setTempAmount] = useState("")
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [showpinModal,setShowPinModal] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })
    
    const [patchFundTransfer] = useMutation(PATCH_FUND_TRANSFER, {
        variables: {
            input: {
                amount: +amount,
                note: note,
                sourceUserId: session.user.id,
                destinationUserId: recipientInfo.id,
            }
        },
        onError: (error)=> {
            onError(error)
            setShowPinModal(false)
        },
        onCompleted: (response)=> {
            setWalletinfoParams(response.patchFundTransfer.walletLog)
            setSuccessModalVisible(true)
        }
    })

    // const {data,error,loading} = useQuery(GET_TOKTOK_WALLET, {
    //     fetchPolicy: "network-only",
    //     variables: {
    //         input: {
    //             userId: session.user.id
    //         }
    //     }
    // })

  
    // if (loading) {
    //     return (
    //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //         <ActivityIndicator size={24} color={COLOR} />
    //       </View>
    //     );
    //   }
    
    // if (error) {
    // return (
    //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <Text>Something Went Wrong</Text>
    //     </View>
    // );
    // }

    const changeAmount = (value)=>{
        let num = value.replace(/[^0-9]/g, '')
        setTempAmount(num)
        setAmount(num * 0.01)
        if((num * 0.01) >= 1 && (num * 0.01) <= walletinfo.balance){
            setSwipeEnabled(true)
            setErrorMessage("")
        }else if((num * 0.01) < 1 && num != ""){
            setSwipeEnabled(false)
            setErrorMessage(`Please Enter atleast ${'\u20B1'} 1.00`)
        }else{
            setSwipeEnabled(false)
            setErrorMessage(num == "" ? "" : "You do not have enough balance")
        }

    }

    const onSwipeSuccess = ()=> {
        if(walletinfo.pincode != null){
            navigation.push("TokTokWalletPinCodeSecurity", {onConfirm: ()=> patchFundTransfer()})
        }else{
            patchFundTransfer()
        }
       
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
        <> 
        <SuccessfulModal 
                successModalVisible={successModalVisible}
                amount={amount} 
                recipient={{
                    name: `${recipientInfo.person.firstName} ${recipientInfo.person.middleName ? recipientInfo.person.middleName + " " : ""}${recipientInfo.person.lastName}`,
                    mobileNo: recipientInfo.username
                }}
                walletinfoParams={walletinfoParams}
        />
        <View style={styles.container}>
            <View style={styles.content}>
                    <Text style={{marginLeft: 20, marginTop: 20, fontFamily: FONT_MEDIUM ,fontSize: 16}}>Send to</Text>
                    <View style={styles.receiverInfo}>
                        <Image style={{height: 50,width: 50,marginRight: 10}} resizeMode="contain" source={{uri: recipientInfo.person.avatar}}/>
                        <View style={{justifyContent: "center"}}>
                            <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>{`${recipientInfo.person.firstName} ${recipientInfo.person.middleName ? recipientInfo.person.middleName + "" : ""}${recipientInfo.person.lastName}`}</Text>
                            <Text style={{fontSize:12,color:"#A6A8A9",fontFamily: FONT_REGULAR,}}>{recipientInfo.username}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>navigation.navigate("TokTokWalletActionsSend")} style={{flex: 1,alignItems: "flex-end",justifyContent: "center"}}>
                            <Text style={{color: "#F6841F",fontSize: 10, fontFamily: FONT_MEDIUM}}>Change Contact</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 20}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 16,marginBottom: 10}}>Balance: {'\u20B1'} {numberFormat(walletinfo.balance)}</Text>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>Enter Amount</Text>
                        <View style={styles.amount}>
                                <Text style={{fontSize: 16,fontFamily: FONT_MEDIUM,alignSelf:"center"}}>{'\u20B1'} </Text>
                                <TextInput
                                        caretHidden
                                        value={tempAmount}
                                        onChangeText={changeAmount}
                                        style={{height: '100%', width: '100%', position: 'absolute', color: 'transparent',zIndex: 1}}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                />
                                <View style={{fontSize: 12,fontFamily: FONT_REGULAR,paddingVertical: 5,marginLeft: 5,alignSelf: "center",flex: 1}}>
                                    <Text style={{fontFamily: FONT_MEDIUM}}>{amount ? numberFormat(amount) : "0.00"}</Text>
                                </View>
                        </View>
                         {
                             errorMessage != "" && <Text style={{fontFamily: FONT_REGULAR , color: "red",fontSize: 12,marginTop: 5}}>{errorMessage}</Text>
                         }
                    </View>
                    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={{paddingHorizontal: 20}}>
                        <Text style={{fontFamily: FONT_MEDIUM,fontSize: 14}}>Note <Text style={{fontFamily: FONT_REGULAR,fontSize: 11}}>( Optional )</Text></Text>
                        <View style={styles.amount}>
                                <TextInput
                                        value={note}
                                        multiline={true}
                                        height={50}
                                        onChangeText={value=>setNote(value)}
                                        placeholder="Remarks" 
                                        returnKeyType="done"
                                        maxLength={60}
                                        style={{fontSize: 12,fontFamily: FONT_REGULAR,padding: 0,marginLeft: 5,alignSelf: "center",flex: 1}}
                                />
                        </View>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 5,fontSize: 12}}>{note.length}/60</Text>
                    </View>
            </View>
            <SwipeButton 
                    //enableReverseSwipe={true}
                    disabled={!swipeEnabled}
                    disabledRailBackgroundColor="dimgray"
                    containerStyles={styles.swipeContainer}
                    width={250}
                    title={`Swipe to Send ${'\u20B1'} ${amount != "" ? numberFormat(amount) : "0"}`}
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