import React, { useState ,useRef , useContext } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,CheckBox,Linking} from 'react-native'
import {SIZES, BUTTON_HEIGHT, FONTS, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import {POST_TOKTOK_WALLET_KYC} from '../../../../../../../graphql'
import {useMutation} from '@apollo/react-hooks'
import {onError} from '../../../../../../../util/ErrorUtility'
import {AlertOverlay} from '../../../../../../../components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { YellowButton } from '../../../../../../../revamp'

const UserInfo = ({label,value})=> {

    return (
        <View style={{paddingVertical: 10,width:"100%", borderColor:"#F4F4F4", borderBottomWidth: 1,flexDirection:"row"}}>
            {/* <Text style={{marginBottom: 2, fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>{label}</Text>
            <View style={{paddingHorizontal: 10, height: 50, justifyContent:"center",backgroundColor:"#F7F7FA"}}>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>{value}</Text>
            </View> */}
            <View style={{flex: 1}}>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>{label}</Text>
            </View>
            <View style={{flex: 1,alignItems:"flex-end"}}>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>{value}</Text>
            </View>
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
            navigation.pop()
            navigation.navigate("ToktokWalletHomePage")
            navigation.replace("ToktokWalletHomePage")
        }
    })

    const confirm = ()=> {
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
                    fullname: `${VerifyUserData.person.lastName}, ${VerifyUserData.person.firstName}${VerifyUserData.person.middleName ? " " + VerifyUserData.person.middleName : ""}`,
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
    }


    return (
        <>
            <AlertOverlay visible={loading} />
            <View style={styles.content}>
                <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize: SIZES.M, fontFamily: FONTS.BOLD,color:COLORS.DARK}}>Review Information</Text>
                        <Text style={{fontFamily: FONTS.REGULAR,marginBottom: 10,fontSize: SIZES.M,color:"#929191"}}>Make sure your details are all correct.</Text>  
                        <UserInfo label="Last Name" value={VerifyUserData.person.lastName}/>
                        <UserInfo label="First Name" value={VerifyUserData.person.firstName}/>
                        <UserInfo label="Middle Name" value={VerifyUserData.person.middleName}/>
                        <UserInfo label="Date of Birth" value={moment(VerifyUserData.birthInfo.birthdate).format("MMM DD YYYY")}/>
                        <UserInfo label="Place of Birth" value={VerifyUserData.birthInfo.birthPlace}/>
                        <UserInfo label="Nationality" value={VerifyUserData.nationality}/>
                        <UserInfo label="Address" value={`${VerifyUserData.address.streetAddress} ${VerifyUserData.address.village} ${VerifyUserData.address.city} ${VerifyUserData.address.region}, ${VerifyUserData.address.country} ${VerifyUserData.address.zipCode}`}/>
                        <UserInfo label="ID Type" value={VerifyUserData.verifyID.idType}/>
                        <UserInfo label="ID number" value={VerifyUserData.verifyID.idNumber}/>
                    <TouchableOpacity 
                        onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                        style={{justifyContent:"flex-end",alignItems:"flex-start",flexGrow: 1,marginBottom: 15,marginTop: 20,}}
                    >
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>I hereby certify that I accept the <Text style={{color: COLORS.ORANGE,fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Terms and Conditions.</Text></Text>
                    </TouchableOpacity>
            
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
                  
                    <View style={{height: BUTTON_HEIGHT}}>
                        <YellowButton label="Confirm" onPress={confirm}/>
                    </View>
                   
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 100,
        width: "100%",
        justifyContent:"flex-end"
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