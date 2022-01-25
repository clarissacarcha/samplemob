import React, {useState, useContext , useEffect,useCallback} from 'react'
import {StyleSheet,View,BackHandler,TouchableHighlight,Text,KeyboardAvoidingView,Platform,Alert} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect} from '@react-navigation/native'
import {Separator,LeavePromptModal,FlagSecureScreen} from 'toktokwallet/components'
import RNFS from 'react-native-fs'
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS 
import {
    Confirm,
    VerifyAddress,
    VerifyContextProvider,
    VerifyContext,
    VerifyFullname,
    VerifyID,
    VerifySelfie,
    VerifySelfieWithID,
    VerifySourceOfIncome
} from "./Components";

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE } = CONSTANTS

const HeaderBackClose = ({currentIndex,setCurrentIndex, setPromptVisible})=> {

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

      useFocusEffect(useCallback(() => {
        const backAction = () => {
            closeScreen() 
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      });

      return (
        <TouchableHighlight onPress={closeScreen} underlayColor={'white'} style={styles.button}>
            <View style={styles.iconBox}>
                <FIcon5 name={'chevron-left'} size={13} color={COLOR.YELLOW} />
            </View>
        </TouchableHighlight>
      )
}

const HeaderTitle = ({label})=> {
    return (
    <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
      <Text style={{fontFamily: FONT.BOLD ,fontSize: 16}}>{label}</Text>
    </View>
    )
}


const MainSetupComponent = ()=> {

    const {currentIndex,setCurrentIndex} = useContext(VerifyContext)
    const navigation = useNavigation()
    const [visible,setVisible] = useState(false)

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose setPromptVisible={(value)=>setVisible(true)} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>,
        headerTitle: ()=> <HeaderTitle label={"Verification"} />,
        headerRight: ()=>  <TouchableHighlight style={{paddingRight: 16}} underlayColor={'white'} onPress={cancelSetup}>
                                <View style={{justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR ,color:'#929191'}}>Cancel</Text>
                                </View>
                            </TouchableHighlight>
    })

 
    const [screenSlides,setScreenSlides] = useState(["Fullname","Address","IDPic","SelfiePic","SelfiePicWithID","Confirm"])
 
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
            // case 2:
            //     return <VerifySourceOfIncome/>
            case 2:
                return <VerifyID/>
            case 3:
                return <VerifySelfie/>
            case 4:
                return <VerifySelfieWithID/>
            default:
                return <Confirm/>
        }
    }
    

    return (
        <>
        <LeavePromptModal
            visible={visible}
            setVisible={setVisible}
            onConfirm={()=>{
                if(RNFS.CachesDirectoryPath) RNFS.unlink(RNFS.CachesDirectoryPath)
                navigation.goBack()
            }}
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

export const ToktokWalletVerification = ()=> {
    return (
        <FlagSecureScreen>
            <VerifyContextProvider>
                <MainSetupComponent/>
            </VerifyContextProvider>
        </FlagSecureScreen>
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
        backgroundColor:"#F7F7FA"
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
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
})
