import React , {useState , useEffect} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,Alert,BackHandler,KeyboardAvoidingView,Platform} from 'react-native'
import { HeaderTitle } from '../../../../../../../components'
import FIcon from 'react-native-vector-icons/Feather';
import {PATCH_PINCODE_TOKTOK_WALLET} from '../../../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import Separator from '../../../Components/Separator'


//SELF IMPORTS
import CreatePin from './CreatePin'
import CreateConfirmPin from './CreateConfirmPin'
import VerifyPin from './VerifyPin'
import SuccessModal from './SuccessModal'


const HeaderBack = ({pageIndex,setPageIndex,navigation,walletinfo})=> {

    const backAction = () => {
      closeScreen()
      return true;
    };

    const closeScreen = ()=> {
      const landingIndex = walletinfo.pincode == null ? 1 :0
      if(pageIndex == landingIndex){
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
          <FIcon name="arrow-left" size={24} color={'#212529'} />
        </View>
      </TouchableHighlight>
    )
}

export default ({navigation,route})=> {

    const walletinfo = route.params.walletinfo
    const [pinCode,setPinCode] = useState("")
    const [pageIndex,setPageIndex] = useState(walletinfo.pincode == null ? 1 : 0)
    const [successModalVisible,setSuccessModalVisible] = useState(false)

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack pageIndex={pageIndex} setPageIndex={setPageIndex} navigation={navigation} walletinfo={walletinfo}/>,
        headerTitle: ()=> <HeaderTitle label={['Set up PIN','']}/>,
    })

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


    const DisplayComponent = ()=> {
        switch(pageIndex){
            case 0:
                return <VerifyPin pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 1:
                return <CreatePin pinCode={pinCode} setPinCode={setPinCode} walletinfo={walletinfo} pageIndex={pageIndex} setPageIndex={setPageIndex}/>
            case 2:
                return <CreateConfirmPin pinCode={pinCode} setPinCode={setPinCode} pageIndex={pageIndex} setPageIndex={setPageIndex} walletinfo={walletinfo} patchPincodeToktokWallet={proceed}/>
            default: 
                return
        }
    }
    

    return (
      <>
        <SuccessModal modalVisible={successModalVisible} />
        <Separator />
        <KeyboardAvoidingView 
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 80}  
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