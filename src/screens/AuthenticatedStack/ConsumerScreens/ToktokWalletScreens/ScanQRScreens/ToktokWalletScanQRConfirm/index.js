import React, {useState,useEffect,useRef} from 'react'
import {View,Text,StyleSheet,Image,Alert,TextInput,KeyboardAvoidingView,Platform,ScrollView , ImageBackground , TouchableOpacity} from 'react-native'
import { HeaderTitle} from '../../../../../../components'
import {HeaderBack} from '../../../../../../revamp'
import { BUTTON_HEIGHT, FONT_MEDIUM, FONT_REGULAR, SIZES, INPUT_HEIGHT, FONTS, COLORS } from '../../../../../../res/constants'
import {numberFormat} from '../../../../../../helper'
import { PATCH_FUND_TRANSFER , GET_DAILY_MONTHLY_YEARLY_INCOMING , GET_DAILY_MONTHLY_YEARLY_OUTGOING} from '../../../../../../graphql'
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks'
import {useSelector} from 'react-redux'
import { onError , onErrorAlert} from '../../../../../../util/ErrorUtility';
import SuccessfulModal from '../../SendMoneyScreens/ToktokWalletSendMoney/SuccessfulModal'
import {useAlert} from '../../../../../../hooks/useAlert'
import { BlackButton, YellowButton } from '../../../../../../revamp';
import ConfirmBottomSheet from '../../Components/ConfirmBottomSheet';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import Separator from '../../Components/Separator'

//SELF IMPORTS
import ConfirmModalContent from './ConfirmModalContent'
import RecipientInfo from './RecipientInfo'
import EnterAmount from './EnterAmount'
import EnterNote from './EnterNote'
import SwipeButtonComponent from './SwipeButtonComponent'

export default ({navigation,route})=> {

    navigation.setOptions({
      headerShown:false,
    })
    const alert = useAlert()
    const { recipientInfo, walletinfo } = route.params
    const session = useSelector(state=>state.session)
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [swipeEnabled,setSwipeEnabled] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)
    const [walletinfoParams,setWalletinfoParams] = useState({
        id: "",
        referenceNumber: "",
        createdAt: ""
    })
    const [recipientDetails,setRecipientDetails] = useState(null)
    const [senderDetails,setSenderDetails] = useState(null)
    const bottomSheetRef = useRef()

    const [patchFundTransfer] = useMutation(PATCH_FUND_TRANSFER, {
        variables: {
            input: {
                note: note,
                amount: +amount,
                sourceUserId: session.user.id,
                destinationUserId: recipientInfo.id,
            }
        },
        onError: (error)=> {
            onErrorAlert({alert , error})
            navigation.pop()
        },
        onCompleted: (response)=> {
            setWalletinfoParams(response.patchFundTransfer.walletLog)
            setSuccessModalVisible(true)
        }
    })


    const [getDailyMonthlyYearlyIncoming] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_INCOMING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setRecipientDetails(response.getDailyMonthlyYearlyIncoming)
        }
    })

    const [getDailyMonthlyYearlyOutgoing] = useLazyQuery(GET_DAILY_MONTHLY_YEARLY_OUTGOING, {
        fetchPolicy: 'network-only',
        onError: (error)=>{

        },
        onCompleted: (response)=> {
            setSenderDetails(response.getDailyMonthlyYearlyOutgoing)
        }
    })

    useEffect(()=>{
        // getDailyMonthlyYearlyIncoming({
        //     variables: {
        //         input: {
        //             userID: recipientInfo.id
        //         }
        //     }
        // })

        // getDailyMonthlyYearlyOutgoing({
        //     variables: {
        //         input: {
        //             userID: session.user.id
        //         }
        //     }
        // })
    },[])

    const onSwipeSuccess = ()=> {
        bottomSheetRef.current.snapTo(0)
        return navigation.push("ToktokWalletSecurityPinCode", {onConfirm: patchFundTransfer})
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
                    name: `${recipientInfo.name}`,
                    mobileNo: recipientInfo.contactNo,
                }}
                walletinfoParams={walletinfoParams}
        />
        <View style={styles.container}>
            <View style={styles.headings}>
                <ImageBackground imageStyle={[]} style={styles.walletbackgroundimage} source={require('../../../../../../assets/toktokwallet-assets/header-bg.png')}>

                    <View style={styles.header}>
                            <View style={{flex: 1}}>
                                <HeaderBack />
                            </View>
                            <View style={{width: 150,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontSize: SIZES.L,fontFamily: FONTS.BOLD,color: COLORS.DARK}}>Send Money</Text>
                            </View>
                            <View style={{flex: 1}}>

                            </View>
                    </View>
                    <View style={{height: 38}}/>
                    <View style={styles.walletContent}>
                            <View>
                                <Text style={{fontSize: 24,fontFamily: FONTS.BOLD}}>PHP {numberFormat(walletinfo.balance ? walletinfo.balance : 0)}</Text>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR,color: COLORS.DARK}}>Available Balance</Text>
                            </View>
                            <TouchableOpacity onPress={()=> navigation.navigate("ToktokWalletPaymentOptions" , {walletinfo})} style={styles.topUp}>
                                <View style={styles.topUpbtn}>
                                        <FIcon5 name={'plus'} size={12} color={COLORS.DARK}/> 
                                </View>
                            </TouchableOpacity>
                    </View>

                    </ImageBackground>
                    <RecipientInfo recipientInfo={recipientInfo}/>
            </View>


            <EnterAmount 
                amount={amount} 
                setAmount={setAmount} 
                setSwipeEnabled={setSwipeEnabled}
                walletinfo={walletinfo}
            />

            <EnterNote
                note={note}
                setNote={setNote}
            />

            <View style={{paddingHorizontal: 10}}> 
            {/* UNCOMMENT IF NEED BOTTOM SHEET REVIEW AND CONFIRM */}
            {
                // swipeEnabled
                // ? <YellowButton label="Send" onPress={()=>bottomSheetRef.current.snapTo(1)} />
                // : <View style={{width: "100%", height: BUTTON_HEIGHT,justifyContent:"center",alignItems: "center", backgroundColor:"gray",borderRadius: 5}}>
                //         <Text style={{fontFamily: FONT_MEDIUM, fontSize: SIZES.M,color:"white"}}>Send</Text>
                // </View>
                swipeEnabled
                ? <SwipeButtonComponent amount={amount} swipeEnabled={swipeEnabled} note={note} session={session} recipientInfo={recipientInfo}/>
                : null
            }
            </View>   

            <ConfirmBottomSheet
                 bottomSheetRef={bottomSheetRef}
                 headerTitle="Review and Confirm" 
                 btnLabel="Confirm"
                 SwipeButtonEnabled
                 SwipeButtonArgs={
                  {
                    enabled: swipeEnabled,
                    title: `Swipe to send PHP ${amount != "" ? numberFormat(amount) : "0"}`,
                    onSwipeFail: onSwipeFail,
                    onSwipeSuccess: onSwipeSuccess
                  }
                 }
            >
                    <ConfirmModalContent amount={amount} recipientDetails={recipientInfo}/>
            </ConfirmBottomSheet> 
        </View>
      </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    headings: {
        height: 170,
        backgroundColor:"black"
    },  
    header: {
        marginTop: 20,
        height: 24,
        width: "100%",
        flexDirection:"row"
    },
    walletbackgroundimage: {
        flex: 1,
        resizeMode: "cover",
    },
    walletContent: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 16,
        alignItems:"flex-start",
        justifyContent:"flex-start"
    },
    content: {
        flex: 1,
    },
    swipeContainer: {
       alignSelf:"center",
       marginBottom: 20,
    },
    receiverInfo: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection:"row",
    },
    amount: {
        height: INPUT_HEIGHT,
        width: "100%",
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        borderRadius: 5,
        flexDirection: "row",
    },
    topUp: {
        justifyContent:"flex-start",
        alignItems: "center",
        width: 40,
        marginLeft: 5,
        paddingTop: 10,
    },
    topUpbtn: {
        height: 34,
        width: 34,
        borderRadius: 100,
        borderColor: COLORS.DARK,
        borderWidth: 2,
        justifyContent:"center",
        alignItems:"center",
    },

})
