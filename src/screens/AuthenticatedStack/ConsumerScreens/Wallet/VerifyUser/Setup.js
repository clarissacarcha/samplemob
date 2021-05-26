import React, {useState, useContext , useEffect} from 'react'
import {StyleSheet,View,Dimensions,BackHandler,TouchableHighlight,KeyboardAvoidingView,Platform,Alert} from 'react-native'
import VerifyContextProvider from './Context/VerifyContextProvider'
import { HeaderTitle} from '../../../../../components'
import VerifyFullname from './VerifyFullname'
import VerifyNationality from './VerifyNationality'
import VerifyBirth from './VerifyBirth'
import VerifyAddress from './VerifyAddress'
import VerifyID from './VerifyID'
import VerifySelfie from './VerifySelfie'
import Confirm from './Confirm'
import {VerifyContext} from './Context/VerifyContextProvider'
import {useNavigation} from '@react-navigation/native'
import FIcon from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native'

const {height,width} = Dimensions.get("window")

const HeaderBackClose = ({currentIndex,setCurrentIndex})=> {

    const navigation = useNavigation()


     const closeScreen = ()=> {
        if(currentIndex == 0){
            PromptQuestionCloseMessage()
        }else{
            setCurrentIndex(oldstate=>oldstate-1);
        }
      }

      const PromptQuestionCloseMessage = ()=>{
        Alert.alert(
            "",
            "Are you sure you want to leave?",
            [
              {
                text: "No",
                onPress: () => null,
                style: "cancel"
              },
              { text: "Yes", onPress: () =>navigation.goBack() }
            ]
          );
      
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
        <TouchableHighlight onPress={PromptQuestionCloseMessage} underlayColor={'white'} style={styles.button}>
            <View style={styles.iconBox}>
                <FIcon name={'x'} size={24} color={'#212529'} />
            </View>
        </TouchableHighlight>
      )
}


const MainSetupComponent = ()=> {

    const {currentIndex,setCurrentIndex} = useContext(VerifyContext)
    const navigation = useNavigation()

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>,
        headerTitle: ()=> <HeaderTitle label={['Verification','']}/>,
    })

 
    const [screenSlides,setScreenSlides] = useState(["Fullname","Birthday","Address","IDPic","SelfiePic"])

    const DisplayComponents = ()=> {

        switch(currentIndex){
            case 0:
                return <VerifyFullname/>
            case 1:
                return <VerifyBirth/>
            case 2:
                return <VerifyAddress/>
            case 3:
                return <VerifyID/>
            case 4: 
                return <VerifySelfie/>
            default:
                return <Confirm/>
        }
    }
    

    return (
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
    )


}

const SetupVerify = ()=> {
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

export default SetupVerify