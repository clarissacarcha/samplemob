import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,Alert,BackHandler,KeyboardAvoidingView,Platform,Image,Dimensions} from 'react-native'
import {useAccount} from 'toktokwallet/hooks'
import { ICON_SET , VectorIcon } from 'src/revamp'
import {Separator,LeavePromptModal,CheckIdleState} from 'toktokwallet/components'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql'
import { PATCH_MPIN_CODE} from 'toktokwallet/graphql'
import {useMutation} from '@apollo/react-hooks'
import { AlertOverlay, HeaderTitle } from 'src/components'
import { onErrorAlert } from 'src/util/ErrorUtility';
import {useAlert  } from 'src/hooks'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import {
    Confirm,
    Create,
    SuccessfulModal,
    Verify
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const HeaderBack = ({pageIndex,setPageIndex,navigation,tokwaAccount})=> {

    const backAction = () => {
      closeScreen()
      return true;
    };

    const closeScreen = ()=> {
      const landingPage = tokwaAccount.mpinCode ? 0 : 1
      if(pageIndex == landingPage){
        navigation.pop();
      }else{
        setPageIndex(oldstate=>oldstate-1);
      }
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
          <VectorIcon size={13} iconSet={ICON_SET.FontAwesome5} name="chevron-left"/>
        </View>
      </TouchableHighlight>
    )
}


export const ToktokWalletMPINCreate = ({navigation,route})=> {
    const { tokwaAccount } = useAccount();
    const [pageIndex,setPageIndex] = useState(tokwaAccount.mpinCode ? 0 : 1)
    const [pinCode,setPinCode] = useState("")
    const [oldMPIN,setOldMPIN] = useState("")
    const [successModalVisible,setSuccessModalVisible] = useState(false)
    const [LeaveModalvisible,setLeaveModalVisible] = useState(false)
    const alert = useAlert()

    const cancelSetup = ()=> {
        console.log("Cancelling")
        setLeaveModalVisible(true)
      }


    navigation.setOptions({
        headerLeft: ()=> <HeaderBack pageIndex={pageIndex} setPageIndex={setPageIndex} navigation={navigation} tokwaAccount={tokwaAccount}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
        headerRight: ()=> <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
                              <View style={{justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR ,color:'#929191'}}>Cancel</Text>
                              </View>
                          </TouchableHighlight>
    })

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
            oldMPIN: oldMPIN,
          }
        }
      })
    }
  
    const DisplayComponent = ()=> {
        switch(pageIndex){
            case 0:
                return <Verify pageIndex={pageIndex} setPageIndex={setPageIndex} setOldMPIN={setOldMPIN}/>
            case 1:
                return <Create pinCode={pinCode} tokwaAccount={tokwaAccount} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 2:
                return <Confirm tokwaAccount={tokwaAccount} pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} patchPincodeToktokWallet={proceed}/>
            default: 
                return
        }
    }

    return(
        <CheckIdleState>
            <AlertOverlay visible={loading} />
            <SuccessfulModal modalVisible={successModalVisible} tokwaAccount={tokwaAccount}/>
            <LeavePromptModal
                visible={LeaveModalvisible}
                setVisible={setLeaveModalVisible}
                onConfirm={()=>navigation.goBack()}
            />
            <Separator/>
            <KeyboardAvoidingView
                // keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 90} 
                keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80}  
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container} 
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
    },
})