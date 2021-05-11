import React , {useState,useEffect} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,Alert,BackHandler,KeyboardAvoidingView,Platform} from 'react-native'
import { HeaderTitle } from '../../../../../../../components'
import {PATCH_PINCODE_TOKTOK_WALLET} from '../../../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import { Separator , LeavePromptModal} from '../../../Components';
import { COLORS, FONTS, SIZES } from '../../../../../../../res/constants'

//SELF IMPORTS
import NewPin from './NewPin'
import ConfirmPin from './ConfirmPin'
import SuccessModal from './SuccessModal'

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
            <FIcon5 name="chevron-left" color={COLORS.YELLOW} size={13}/>
        </View>
      </TouchableHighlight>
    )
}

const ToktokWalletUpdatePin =  ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack pageIndex={pageIndex} setPageIndex={setPageIndex} navigation={navigation}/>,
        // headerTitle: ()=> <HeaderTitle label={['Update PIN','']}/>,
        headerTitle: ()=> <HeaderTitle label={['','']}/>,
        headerRight: ()=> <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
                                <View style={{paddingVertical: 20}}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR ,color:'#929191'}}>Cancel</Text>
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



    const [patchPincodeToktokWallet, {data,error,loading}] = useMutation(PATCH_PINCODE_TOKTOK_WALLET, {
      variables: {
          input: {
              pincode: pinCode
          }
      },
      onError: (err)=> {

      },
      onCompleted: ({patchPincodeToktokWallet})=> {
          setSuccessModalVisible(true)
      }
  })


  const proceed = ()=> {
    patchPincodeToktokWallet()
  }


    const DisplayComponent = () => {
        switch(pageIndex){
            case 0:
                return <NewPin pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 1:
                return <ConfirmPin  pinCode={pinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} patchPincodeToktokWallet={proceed}/>
            default: 
                return null
        }
    }

    return (
        <>
            <LeavePromptModal
                visible={LeaveModalvisible}
                setVisible={setLeaveModalVisible}
                onConfirm={()=>navigation.pop(2)}
            />
            <SuccessModal modalVisible={successModalVisible} />
            <Separator />
             <KeyboardAvoidingView 
                // keyboardVerticalOffset={Platform.OS == "ios" ? 50 : 90} 
                keyboardVerticalOffset={90}  
                style={styles.container} 
                behavior={Platform.OS == "ios" ? "padding" : "height"}>
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

export default ToktokWalletUpdatePin
