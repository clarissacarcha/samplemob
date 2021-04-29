import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,CheckBox,Linking} from 'react-native'
import {COLOR,FONT_FAMILY, DARK,FONT_COLOR, MEDIUM,ORANGE, FONT_MEDIUM, FONT_LIGHT, FONT_REGULAR, SIZES, BUTTON_HEIGHT} from '../../../../../../../res/constants'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import {VerifyContext} from './VerifyContextProvider'
import {POST_TOKTOK_WALLET_KYC} from '../../../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import {onError} from '../../../../../../../util/ErrorUtility'
import {AlertOverlay} from '../../../../../../../components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'

const UserInfo = ({label,value})=> {

    return (
        <View style={{paddingVertical: 6,width:"100%",borderBottomWidth: 0, borderColor:"silver"}}>
            <Text style={{marginBottom: 2, fontFamily: FONT_MEDIUM,fontSize: SIZES.M}}>{label}</Text>
            <Text style={{fontFamily: FONT_LIGHT,fontSize: SIZES.M}}>{value}</Text>
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
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
        }
    })


    return (
        <>
            <AlertOverlay visible={loading} />
            <View style={styles.content}>
                <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize: SIZES.M, fontFamily: FONT_MEDIUM}}>Review Information</Text>
                        <Text style={{fontFamily: FONT_LIGHT,marginBottom: 10,fontSize: SIZES.M}}>Make sure your details are all correct.</Text>  

                        <UserInfo label="Full Name" value={VerifyUserData.fullname}/>
                        <UserInfo label="Date of Birth" value={moment(VerifyUserData.birthInfo.birthdate).format("MMM DD YYYY")}/>
                        <UserInfo label="Place of Birth" value={VerifyUserData.birthInfo.birthPlace}/>
                        <UserInfo label="Nationality" value={VerifyUserData.nationality}/>
                        <UserInfo label="Address" value={`${VerifyUserData.address.streetAddress} ${VerifyUserData.address.village} ${VerifyUserData.address.city} ${VerifyUserData.address.region}, ${VerifyUserData.address.country} ${VerifyUserData.address.zipCode}`}/>
                        <UserInfo label="Valid ID" value={VerifyUserData.verifyID.idType}/>
                        <UserInfo label="Valid ID number" value={VerifyUserData.verifyID.idNumber}/>
                </ScrollView>

                <View style={styles.proceedBtn}>

                    {/* <View style={{
                        flexDirection:"row",
                        flexGrow: 1,
                    }}>
                        <CheckBox
                            value={isSelected}
                            onValueChange={setSelection}
                        />
                        <View style={{paddingHorizontal: 10,marginRight: 20}}>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.S}}>By clicking the checkbox, I hereby certify that I accept the Terms and Conditions.</Text>
                        </View>
                    
                    </View> */}
                    
                    <TouchableOpacity onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} style={{justifyContent:"flex-end",alignItems:"center",flexGrow: 1,marginBottom: 15}}>
                            <Text style={{fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>I hereby certify that I accept the <Text style={{color: ORANGE,fontFamily: FONT_REGULAR,fontSize: SIZES.M}}>Terms and Conditions.</Text></Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:"row",height: BUTTON_HEIGHT}}>
                    <TouchableOpacity onPress={()=>{
                        setCurrentIndex(oldval => oldval - 1)
                    }} style={{
                        height: "100%",
                        flex: 1,
                        marginRight: 10,
                        backgroundColor: "transparent" ,
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRadius: 5, 
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={{color: "gray",fontSize: SIZES.M,fontFamily: FONT_MEDIUM}}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={{
                        height: "100%",
                        flex: 1,
                        marginLeft: 10,
                        // backgroundColor: isSelected ? DARK : "dimgray" , 
                        backgroundColor: DARK,
                        borderRadius: 5, 
                        justifyContent: "center",
                        alignItems: "center"
                    }}
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
                        <Text style={{
                            // color: isSelected ? COLOR : "white",
                            color: COLOR,
                            fontSize: SIZES.M,
                            fontFamily: FONT_MEDIUM}
                        }>
                            Confirm
                        </Text>
                    </TouchableOpacity>

                    </View>
                   
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 10,
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