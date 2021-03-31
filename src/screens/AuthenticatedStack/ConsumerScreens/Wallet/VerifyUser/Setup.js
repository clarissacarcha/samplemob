import React, {useState, useContext} from 'react'
import {StyleSheet,View,Dimensions} from 'react-native'
import VerifyContextProvider from './Context/VerifyContextProvider'
import {HeaderBackClose, HeaderTitle} from '../../../../../components'
import VerifyFullname from './VerifyFullname'
import VerifyNationality from './VerifyNationality'
import VerifyBirth from './VerifyBirth'
import VerifyAddress from './VerifyAddress'
import VerifyID from './VerifyID'
import VerifySelfie from './VerifySelfie'
import Confirm from './Confirm'
import {VerifyContext} from './Context/VerifyContextProvider'

const {height,width} = Dimensions.get("window")


const MainSetupComponent = ()=> {

    const {currentIndex,setCurrentIndex} = useContext(VerifyContext)

    // const [screenSlides,setScreenSlides] = useState(["Fullname","Nationality","Birthday","Address","IDPic","SelfiePic","Confirm"])
    const [screenSlides,setScreenSlides] = useState(["Fullname","Birthday","Address","IDPic","SelfiePic","Confirm"])

    const DisplayComponents = ()=> {
        // switch(currentIndex){
        //     case 0:
        //         return <VerifyFullname/>
        //     case 1:
        //         return <VerifyNationality/>
        //     case 2:
        //         return <VerifyBirth/>
        //     case 3:
        //         return <VerifyAddress/>
        //     case 4:
        //          return <VerifyID/>
        //     case 5:
        //          return <VerifySelfie/>
        //     default:
        //         return <Confirm/>
        // }

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
        <View style={styles.container}>
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

const SetupVerify = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Verify toktok wallet','']}/>,
    })

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
})

export default SetupVerify