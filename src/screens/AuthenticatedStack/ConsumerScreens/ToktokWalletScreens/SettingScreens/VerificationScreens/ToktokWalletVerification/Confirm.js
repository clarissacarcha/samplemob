import React, { useState ,useRef , useContext, useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,CheckBox,Linking, Alert} from 'react-native'
import {SIZES, BUTTON_HEIGHT, FONTS, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from '../../../../../../../graphql'
import {POST_KYC_REGISTER} from '../../../../../../../graphql/toktokwallet'
import {useMutation} from '@apollo/react-hooks'
import {onError} from '../../../../../../../util/ErrorUtility'
import { useAlert } from '../../../../../../../hooks/useAlert'
import { onErrorAlert } from '../../../../../../../util/ErrorUtility'
import {AlertOverlay} from '../../../../../../../components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import {connect} from 'react-redux'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import { YellowButton } from '../../../../../../../revamp'
import { DisabledButton } from '../../../Components'

const UserInfo = ({label,value})=> {

    return (
        <View style={{paddingVertical: 10,width:"100%", borderColor:"#F4F4F4", borderBottomWidth: 1,flexDirection:"row"}}>
            {/* <Text style={{marginBottom: 2, fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>{label}</Text>
            <View style={{paddingHorizontal: 10, height: 50, justifyContent:"center",backgroundColor:"#F7F7FA"}}>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>{value}</Text>
            </View> */}
            <View style={{flex: 1}}>
                <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M,textAlign: "left"}}>{label}</Text>
            </View>
            <View style={{flex: 1,alignItems:"flex-end"}}>
                <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M,textAlign: "right"}}>{value}</Text>
            </View>
        </View>
    )
}

const Confirm = ({session})=> {

    const VerifyUserData = useContext(VerifyContext)
    const navigation = useNavigation()
    const alert = useAlert()

    const [isCertify, setCertify] = useState(false)

    const [postKYCRegister,{data,error,loading}] = useMutation(POST_KYC_REGISTER, {
        client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
        onError: (error) => {
            onErrorAlert({alert , error})
        },
        onCompleted: (response)=> {
            let result = response.postKycRegister
            if(result.status == 2){
                navigation.pop()
                navigation.navigate("ToktokWalletVerifyResult")
                // navigation.replace("ToktokWalletVerifyResult")
            }
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

        const rnFrontIDFile = VerifyUserData.frontImage 
        ? new ReactNativeFile({
            ...VerifyUserData.frontImage,
            name: 'documentValidIDFront.jpg',
            type: 'image/jpeg'
        })
        : null

        const rnBackIDFile = VerifyUserData.backImage 
        ? new ReactNativeFile({
            ...VerifyUserData.backImage,
            name: 'documentValidIDBack.jpg',
            type: 'image/jpeg'
        })
        : null

        console.log(rnBackIDFile)

        const input = {
            userId: session.user.id,
            mobileNumber: VerifyUserData.contactInfo.mobile_number,
            emailAddress: VerifyUserData.contactInfo.email,
            firstName: VerifyUserData.person.firstName,
            middleName: VerifyUserData.person.middleName,
            lastName: VerifyUserData.person.lastName,
            birthdate: moment(VerifyUserData.birthInfo.birthdate).format("YYYY-MM-DD"),
            // birthdate: VerifyUserData.birthInfo.birthdate,
            birthPlace: VerifyUserData.birthInfo.birthPlace,
            ...( rnSelfieFile ? {selfieImage: rnSelfieFile} : {} ),
            nationality:  VerifyUserData.nationalityId.toString(),
            line1: VerifyUserData.address.line1,
            line2: VerifyUserData.address.line2,
            postalCode: VerifyUserData.address.postalCode,
            cityId: VerifyUserData.cityId,
            provinceId: VerifyUserData.provinceId,
            ...( rnFrontIDFile ? {frontImage: rnFrontIDFile} : {} ),
            ...( rnBackIDFile ? {backImage: rnBackIDFile} : {} ),
            identificationCardNumber: VerifyUserData.verifyID.idNumber,
            identificationCardId: VerifyUserData.identificationId,
        }

        postKYCRegister({
            variables: {
                input: input
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
                        <UserInfo label="Mobile Number" value={VerifyUserData.contactInfo.mobile_number}/>
                        <UserInfo label="Email Address" value={VerifyUserData.contactInfo.email}/>
                        <UserInfo label="Last Name" value={VerifyUserData.person.lastName}/>
                        <UserInfo label="First Name" value={VerifyUserData.person.firstName}/>
                        <UserInfo label="Middle Name" value={VerifyUserData.person.middleName}/>
                        <UserInfo label="Date of Birth" value={moment(VerifyUserData.birthInfo.birthdate).format("MMM DD YYYY")}/>
                        <UserInfo label="Place of Birth" value={VerifyUserData.birthInfo.birthPlace}/>
                        <UserInfo label="Nationality" value={VerifyUserData.nationality}/>
                        <UserInfo label="Address" value={`${VerifyUserData.address.line1} ${VerifyUserData.address.line2} ${VerifyUserData.city} ${VerifyUserData.province}, ${VerifyUserData.address.country} ${VerifyUserData.address.postalCode}`}/>
                        <UserInfo label="ID Type" value={VerifyUserData.verifyID.idType}/>
                        <UserInfo label="ID number" value={VerifyUserData.verifyID.idNumber}/>
                    {/* <TouchableOpacity 
                        onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                        style={{justifyContent:"flex-end",alignItems:"flex-start",flexGrow: 1,marginBottom: 15,marginTop: 20,}}
                    >
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>I hereby certify that I accept the <Text style={{color: COLORS.ORANGE,fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Terms and Conditions.</Text></Text>
                    </TouchableOpacity> */}
            
                </ScrollView>

                <View style={styles.proceedBtn}>

                    <View style={{
                        flexDirection:"row",
                        flexGrow: 1,
                    }}>
                        <CheckBox
                            value={isCertify}
                            onValueChange={setCertify}
                        />
                        <TouchableOpacity 
                            onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                            style={{paddingHorizontal: 10,marginRight: 20}}
                        >
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>I hereby certify that I accept the <Text style={{color: COLORS.ORANGE,fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Terms and Conditions.</Text></Text>
                        </TouchableOpacity>

                         {/* <TouchableOpacity 
                        onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                        style={{justifyContent:"flex-end",alignItems:"flex-start",flexGrow: 1,marginBottom: 15,marginTop: 20,}}
                    >
                            <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>I hereby certify that I accept the <Text style={{color: COLORS.ORANGE,fontFamily: FONTS.REGULAR,fontSize: SIZES.M}}>Terms and Conditions.</Text></Text>
                    </TouchableOpacity> */}
                    
                    </View>
                  
                    <View style={{height: BUTTON_HEIGHT}}>
                        {
                            isCertify 
                            ? <YellowButton label="Confirm" onPress={confirm}/>
                            : <DisabledButton label="Confirm" />
                        }
                        {/* <YellowButton label="Confirm" onPress={() => {
                            if(isCertify) confirm()
                            else return
                        }}/> */}
                    </View>
                   
                </View>
            </View>
        </>
    )
}

const mapStateToProps = (state) => ({
    session: state.session,
    constants: state.constants,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(Confirm);

const styles = StyleSheet.create({
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 90,
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