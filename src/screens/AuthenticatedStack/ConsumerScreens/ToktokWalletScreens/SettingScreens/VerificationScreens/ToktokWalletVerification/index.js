import React, {useState, useContext , useEffect} from 'react'
import {StyleSheet,View,Dimensions,BackHandler,TouchableHighlight,Text,KeyboardAvoidingView,Platform,Alert} from 'react-native'
import { HeaderTitle} from '../../../../../../../revamp'

import {useNavigation} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native'
import {Separator,LeavePromptModal} from '../../../Components'

//SELF IMPORTS
import VerifyContextProvider , {VerifyContext} from './VerifyContextProvider'
import VerifyFullname from './VerifyFullname'
import VerifyBirth from './VerifyBirth'
import VerifyAddress from './VerifyAddress'
import VerifyID from './VerifyID'
import VerifySelfie from './VerifySelfie'
import Confirm from './Confirm'
import { COLORS, FONTS, SIZES } from '../../../../../../../res/constants';

const {height,width} = Dimensions.get("window")

const HeaderBackClose = ({currentIndex,setCurrentIndex, setPromptVisible})=> {

    const navigation = useNavigation()


     const closeScreen = ()=> {
        if(currentIndex == 0){
            PromptQuestionCloseMessage()
        }else{
            setCurrentIndex(oldstate=>oldstate-1);
        }
      }

      const PromptQuestionCloseMessage = ()=>{
        setPromptVisible(true)
      }

      useFocusEffect(() => {
        const backAction = () => {
            closeScreen() 
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

      return (
        <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
            <View style={styles.iconBox}>
                <FIcon5 name={'chevron-left'} size={13} color={COLORS.YELLOW} />
            </View>
        </TouchableHighlight>
      )
}


const MainSetupComponent = ()=> {

    const {currentIndex,setCurrentIndex} = useContext(VerifyContext)
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose setPromptVisible={(value)=>setVisible(true)} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>,
        headerTitle: ()=> <HeaderTitle label={['Verify toktokwallet','']}/>,
        headerRight: ()=>  <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
                                <View style={{justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize: SIZES.M,fontFamily: FONTS.REGULAR ,color:'#929191'}}>Cancel</Text>
                                </View>
                            </TouchableHighlight>
    })

 
    const [screenSlides,setScreenSlides] = useState(["Fullname","Address","IDPic","SelfiePic"])
 
    const cancelSetup = ()=> {
      console.log("Cancelling")
      setVisible(true)
    }

    const DisplayComponents = ()=> {

        switch(currentIndex){
            case 0:
                return <VerifyFullname/>
            case 1:
                return <VerifyAddress/>
            case 2:
                return <VerifyID/>
            case 3:
                return <VerifySelfie/>
            default:
                return <Confirm/>
        }
    }
    

    return (
        <>
        <LeavePromptModal
            visible={visible}
            setVisible={setVisible}
            onConfirm={()=>navigation.goBack()}
        />
        <Separator />
        <View 
            style={styles.container}
        >
            <View style={styles.progressBar}>
                {
                    screenSlides.map((item,index)=> {
                        if(index < screenSlides.length - 1) return <View style={[styles.progressBarItem,{backgroundColor: index < currentIndex ? "#F6841F" : "transparent"}]} />
                    })
                }
            </View>

            {DisplayComponents()}

        </View>
        </>
    )


}

const ToktokWalletVerification = ()=> {
    return (
        <VerifyContextProvider>
             <MainSetupComponent/>
        </VerifyContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    progressBar: {
        height: 2,
        width: "100%",
        flexDirection: "row",
    }, 
    progressBarItem: {
        flex: 1,
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

export default ToktokWalletVerification
