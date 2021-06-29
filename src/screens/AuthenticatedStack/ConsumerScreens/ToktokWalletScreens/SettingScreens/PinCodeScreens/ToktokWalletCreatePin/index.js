import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,Alert,BackHandler,KeyboardAvoidingView,Platform,Image,Dimensions} from 'react-native'
import { AlertOverlay, HeaderTitle } from '../../../../../../../components'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../../graphql'
import { PATCH_PIN_CODE} from '../../../../../../../graphql/toktokwallet'
import {useMutation} from '@apollo/react-hooks'
import {Separator,LeavePromptModal} from '../../../Components'
import { COLORS, FONTS, SIZES } from '../../../../../../../res/constants';
import {useSelector} from 'react-redux'
import { onErrorAlert } from '../../../../../../../util/ErrorUtility';
import {useAlert  } from '../../../../../../../hooks'

//SELF IMPORTS
import CreatePin from './CreatePin'
import CreateConfirmPin from './CreateConfirmPin'
import VerifyPin from './VerifyPin'
import SuccessModal from './SuccessModal'

const {width,height} = Dimensions.get("window")

const HeaderBack = ({pageIndex,setPageIndex,navigation,tokwaAccount})=> {

    const backAction = () => {
      closeScreen()
      return true;
    };

    const closeScreen = ()=> {
      const landingPage = tokwaAccount.pinCode ? 0 : 1
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
          <FIcon5 name="chevron-left" color={COLORS.YELLOW} size={13}/>
        </View>
      </TouchableHighlight>
    )
}

const ToktokWalletCreatePin = ({navigation,route})=> {

    // const walletinfo = route.params.walletinfo
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [pinCode,setPinCode] = useState("")
    const [pageIndex,setPageIndex] = useState(tokwaAccount.pinCode ? 0 : 1)
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
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR ,color:'#929191'}}>Cancel</Text>
                              </View>
                          </TouchableHighlight>
    })

    const [patchPinCode, {data, error, loading}] = useMutation(PATCH_PIN_CODE, {
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onCompleted: ({patchPinCode})=>{
        setSuccessModalVisible(true)
      },
      onError: (error)=> {
        onErrorAlert({alert,error})
      }
    })

    const proceed = ()=> {
      patchPinCode({
        variables: {
          input: {
            pinCode: pinCode
          }
        }
      })
    }


    const DisplayComponent = ()=> {
        switch(pageIndex){
            case 0:
                return <VerifyPin pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 1:
                return <CreatePin pinCode={pinCode} tokwaAccount={tokwaAccount} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 2:
                return <CreateConfirmPin tokwaAccount={tokwaAccount} pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} patchPincodeToktokWallet={proceed}/>
            default: 
                return
        }
    }
    

    return (
      <>
        <AlertOverlay visible={loading} />
        <LeavePromptModal
            visible={LeaveModalvisible}
            setVisible={setLeaveModalVisible}
            onConfirm={()=>navigation.goBack()}
        />
        <SuccessModal modalVisible={successModalVisible} tokwaAccount={tokwaAccount}/>
        <Separator />
        <KeyboardAvoidingView
            // keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 90} 
            keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 80}  
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container} 
        >
                {DisplayComponent()}
        </KeyboardAvoidingView> 
      </>
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

export default ToktokWalletCreatePin