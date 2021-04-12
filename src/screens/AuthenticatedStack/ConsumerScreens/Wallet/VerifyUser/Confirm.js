import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,CheckBox} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR} from '../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './Context/VerifyContextProvider'
import {POST_TOKTOK_WALLET_KYC} from '../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import {onError} from '../../../../../util/ErrorUtility'
import {AlertOverlay} from '../../../../../components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'

const UserInfo = ({label,value})=> {

    return (
        <View style={{paddingVertical: 10,width:"100%",borderTopWidth: .5, borderColor:"silver"}}>
            <Text style={{marginBottom: 2, fontFamily: FONT_MEDIUM,color:"gray",fontSize: 12}}>{label}</Text>
            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>{value}</Text>
        </View>
    )
}

const Confirm = ()=> {

    const VerifyUserData = useContext(VerifyContext)
    const {setCurrentIndex} = VerifyUserData

    const navigation = useNavigation()

    const [isSelected,setSelection] = useState(false)

    const [postToktokWalletKYC,{data,error,loading}] = useMutation(POST_TOKTOK_WALLET_KYC, {
        onError: onError,
        onCompleted: (response)=> {
            // navigation.pop()
            navigation.replace("TokTokWallet")
        }
    })


    return (
        <>
            <AlertOverlay visible={loading} />
            <View style={styles.content}>
                <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize: 14, fontFamily: FONT_MEDIUM}}>Review Information</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginTop: 8,fontSize: 12}}>Make sure your details are all correct.</Text>  

                        <UserInfo label="FULL NAME" value={VerifyUserData.fullname}/>
                        <UserInfo label="DATE OF BIRTH" value={moment(VerifyUserData.birthInfo.birthdate).format("MMM DD YYYY")}/>
                        <UserInfo label="PLACE OF BIRTH" value={VerifyUserData.birthInfo.birthPlace}/>
                        <UserInfo label="NATIONALITY" value={VerifyUserData.nationality}/>
                        <UserInfo label="CURRENT ADDRESS" value={`${VerifyUserData.address.streetAddress} ${VerifyUserData.address.village} ${VerifyUserData.address.city} ${VerifyUserData.address.region}, ${VerifyUserData.address.country} ${VerifyUserData.address.zipCode}`}/>
                        <UserInfo label="VALID ID" value={VerifyUserData.verifyID.idType}/>
                        <UserInfo label="VALID ID NUMBER" value={VerifyUserData.verifyID.idNumber}/>
                </ScrollView>

                <View style={styles.proceedBtn}>

                    <View style={{
                        flexDirection:"row",
                        flexGrow: 1,
                    }}>
                        <CheckBox
                            value={isSelected}
                            onValueChange={setSelection}
                        />
                        <View style={{paddingHorizontal: 10,marginRight: 20}}>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: 12}}>By clicking the checkbox, I hereby certify that I accept the Terms and Conditions.</Text>
                        </View>
                        
                    </View>

                    <View style={{marginVertical: 10,justifyContent:"center",alignItems:"center"}}>
                        <Text style={{fontSize: 12 ,fontFamily: FONT_LIGHT}}>Go back if you need to change some details</Text>
                    </View>

                    <View style={{flexDirection:"row",height: 40}}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{
                        height: "100%",
                        flex: 1,
                        marginRight: 5,
                        backgroundColor: "transparent" ,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 10, 
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{color: "gray",fontSize: 12,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={{
                        height: "100%",
                        flex: 1,
                        marginLeft: 5,
                        backgroundColor: isSelected ? DARK : "dimgray" , 
                        borderRadius: 10, 
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    disabled={!isSelected}
                    onPress={()=>{

                        const rnValidIDFile = new ReactNativeFile({
                            ...VerifyUserData.verifyID.idImage,
                            name: 'documentValidID.jpg',
                            type: 'image/jpeg',
                        });

                        const rnSelfieFile = new ReactNativeFile({
                            ...VerifyUserData.selfieImage,
                            name: 'documentSelfie.jpg',
                            type: 'image/jpeg'
                        })

                        postToktokWalletKYC({
                            variables: {
                                input: {
                                    fullname: VerifyUserData.fullname,
                                    nationality: VerifyUserData.nationality,
                                    address: `${VerifyUserData.address.streetAddress} ${VerifyUserData.address.village} ${VerifyUserData.address.city} ${VerifyUserData.address.region}, ${VerifyUserData.address.country} ${VerifyUserData.address.zipCode}`,
                                    birthdate: VerifyUserData.birthInfo.birthdate,
                                    birthPlace: VerifyUserData.birthInfo.birthPlace,
                                    validIdType: VerifyUserData.verifyID.idType,
                                    validIdNumber: VerifyUserData.verifyID.idNumber,
                                    validIdCountry: VerifyUserData.verifyID.idCountry,
                                    validIdPicture: rnValidIDFile,
                                    picture: rnSelfieFile
                                }
                            }
                        })
                    }}>
                        <Text style={{color: isSelected ? COLOR : "white",fontSize: 12,fontFamily: FONT_MEDIUM}}>Confirm</Text>
                    </TouchableOpacity>

                    </View>
                   
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 100,
        width: "100%",
        // flexDirection: "row",
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "silver",
        marginTop: 20,
    },

})

export default Confirm