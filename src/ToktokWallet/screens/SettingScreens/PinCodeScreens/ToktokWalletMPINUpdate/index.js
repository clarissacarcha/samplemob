import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,Alert,BackHandler,KeyboardAvoidingView,Platform} from 'react-native'
import { AlertOverlay, HeaderTitle } from 'src/components'
import { TOKTOK_WALLET_GRAPHQL_CLIENT } from 'src/graphql'
import { PATCH_MPIN_CODE } from 'toktokwallet/graphql'
import {useMutation} from '@apollo/react-hooks'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { Separator , LeavePromptModal , CheckIdleState} from 'toktokwallet/components';
import { onErrorAlert } from 'src/util/ErrorUtility';
import {useAlert  } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    Confirm,
    New,
    SuccessModal,
} from "./Components"

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const HeaderBack = ({pageIndex,setPageIndex,navigation})=> {

    const backAction = () => {
      closeScreen()
      return true;
    };

    const closeScreen = ()=> {
      pageIndex == 0 ? navigation.pop() : setPageIndex(oldstate=>oldstate-1);
    }

    useEffect(()=>{
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return ()=> backHandler.remove()
    },[pageIndex])

    return (
     <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
        <View style={styles.iconBox}>
            <FIcon5 name="chevron-left" color={COLOR.YELLOW} size={13}/>
        </View>
      </TouchableHighlight>
    )
}

export const ToktokWalletMPINUpdate =  ({navigation , route})=> {

    const {event,otp} = route.params

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack pageIndex={pageIndex} setPageIndex={setPageIndex} navigation={navigation}/>,
        // headerTitle: ()=> <HeaderTitle label={['Update PIN','']}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
        headerRight: ()=> <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
                                 <View style={{justifyContent:"center",alignItems:"center"}}>
                                    <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR ,color:'#929191'}}>Cancel</Text>
                                </View>
                            </TouchableHighlight>
    })

    const cancelSetup = ()=> {
        console.log("Cancelling")
        setLeaveModalVisible(true)
    }


    const [pageIndex,setPageIndex] = useState(0)
    const [pinCode,setPinCode] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [LeaveModalvisible,setLeaveModalVisible] = useState(false)
    const alert = useAlert();

    const [patchMPinCode, {data, error, loading}] = useMutation(PATCH_MPIN_CODE, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onCompleted: ({patchMPinCode})=>{
          setSuccessModalVisible(true)
        },
        onError: (error)=> {
          onErrorAlert({alert,error})
        }
      })
  


    const proceed = ()=> {
        patchMPinCode({
            variables: {
            input: {
                pinCode: pinCode,
                otp: otp
            }
            }
        })
    }


    const DisplayComponent = () => {
        switch(pageIndex){
            case 0:
                return <New pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 1:
                return <Confirm  pinCode={pinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} patchPincodeToktokWallet={proceed}/>
            default: 
                return null
        }
    }

    return (
        <CheckIdleState>
            <AlertOverlay visible={loading} />
            <LeavePromptModal
                visible={LeaveModalvisible}
                setVisible={setLeaveModalVisible}
                onConfirm={()=>navigation.pop(2)}
            />
            <SuccessModal modalVisible={successModalVisible} setModalVisible={setSuccessModalVisible} event={event}/>
            <Separator />
            <KeyboardAvoidingView style={{flex: 1,}}
             keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80}  
             behavior={Platform.OS == "ios" ? "padding" : "height"}
             >
            {DisplayComponent()}
            </KeyboardAvoidingView>
        </CheckIdleState>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    button: {
        borderRadius: 10,
        marginLeft: 10,
        overflow: 'hidden',
    
        height: 30,
        width: 30,
      },
    iconBox: {
    // backgroundColor: DARK,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    },
})
