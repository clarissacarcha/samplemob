import React, {useState,useMemo, useEffect} from 'react'
import {StyleSheet,View,Text,TextInput,Image,TouchableOpacity,Alert,ActivityIndicator,FlatList,Animated,Dimensions} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE} from '../../../../../res/constants'
import {onError} from '../../../../../util/ErrorUtility'
import {HeaderBack, HeaderTitle} from '../../../../../components'
import VerifyFullname from './VerifyFullname'
import VerifyNationality from './VerifyNationality'
import VerifyBirth from './VerifyBirth'
import VerifyAddress from './VerifyAddress'
import VerifyID from './VerifyID'
import VerifySelfie from './VerifySelfie'

const {height,width} = Dimensions.get("window")

const SetupVerify = ({navigation})=> {
    navigation.setOptions({
        headerLeft: ()=> <HeaderBack icon="x"/>,
        headerTitle: ()=> <HeaderTitle label={['Verify ToktokPay Wallet','']}/>,
    })

    const [currentIndex,setCurrentIndex] = useState(0)
    const [fullname,setFullname] = useState("")
    const [nationality,setNationality] = useState("")
    const [birthInfo,setBirthInfo] = useState({
        birthdate: "",
        birthPlace: "",
    })
    const [address,setAddress] = useState({
        country: "",
        streetAddress: "",
        village: "",
        city: "",
        region: "",
        zipCode: ""
    })
    const [idImage,setIDImage] = useState(null)
    const [selfieImage,setSelfieImage] = useState(null)
    const [screenSlides,setScreenSlides] = useState(["Fullname","Nationality","Birthday","Address","IDPic","SelfiePic"])

    const changeBirthInfo = (key,value)=> {
        birthInfo[key] = value
        setBirthInfo(oldstate=>({
            ...oldstate,
        }))
    }

    const changeAddress = (key,value)=> {
        address[key] = value
        setAddress(oldstate=>({
            ...oldstate,
        }))
    }

    const DisplayComponents = ()=> {
        switch(currentIndex){
            case 0:
                return <VerifyFullname fullname={fullname} setFullname={setFullname} setCurrentIndex={setCurrentIndex}/>
            case 1:
                return <VerifyNationality nationality={nationality} setNationality={setNationality} setCurrentIndex={setCurrentIndex} changeBirthInfo={changeBirthInfo} changeAddress={changeAddress}/>
            case 2:
                return <VerifyBirth setCurrentIndex={setCurrentIndex} birthInfo={birthInfo} changeBirthInfo={changeBirthInfo}/>
            case 3:
                return <VerifyAddress setCurrentIndex={setCurrentIndex} address={address} changeAddress={changeAddress}/>
            case 4:
                return <VerifyID image={idImage} setImage={setIDImage} setCurrentIndex={setCurrentIndex}/>
            default:
                return <VerifySelfie image={selfieImage} setImage={setSelfieImage} setCurrentIndex={setCurrentIndex}/>
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