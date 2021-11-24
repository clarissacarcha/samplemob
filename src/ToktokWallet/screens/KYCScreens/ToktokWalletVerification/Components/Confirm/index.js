import React, { useState ,useRef , useContext, useEffect } from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,Linking, Alert} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import { TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql'
import {POST_KYC_REGISTER} from 'toktokwallet/graphql'
import {useMutation} from '@apollo/react-hooks'
import { useAlert } from 'src/hooks/useAlert'
import { onErrorAlert } from 'src/util/ErrorUtility'
import {AlertOverlay} from 'src/components';
import {ReactNativeFile} from 'apollo-upload-client';
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'
import {connect} from 'react-redux'
import { YellowButton } from 'src/revamp'
import { DisabledButton } from 'toktokwallet/components'
import CheckBox from 'react-native-check-box'
import RNFS from 'react-native-fs'
import CONSTANTS from 'common/res/constants'

const { COLOR , FONT_FAMILY: FONT , FONT_SIZE , SIZE } = CONSTANTS

const UserInfo = ({label,value})=> {

    return (
        <View style={{paddingVertical: 10,width:"100%", borderColor:"#F4F4F4", borderBottomWidth: 1,flexDirection:"row"}}>
            <View style={{flex: 1}}>
                <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,textAlign: "left"}}>{label}</Text>
            </View>
            <View style={{flex: 1,alignItems:"flex-end"}}>
                <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M,textAlign: "right"}}>{value}</Text>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => ({
    session: state.session,
    constants: state.constants,
});
  
const mapDispatchToProps = (dispatch) => ({
    createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
});
  

export const Confirm = connect(mapStateToProps, mapDispatchToProps)(({session})=> {

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
            removeCacheImages({
                VerifyUserData
            })
            if(result.status == 2){
                navigation.pop(2)
                navigation.navigate("ToktokWalletVerifyResult")
                // navigation.replace("ToktokWalletVerifyResult")
            }
        }
    })

    const removeCacheImages = async ({VerifyUserData})=> {
        const { selfieImage , selfieImageWithID , frontImage ,  backImage } = VerifyUserData
        try {
            if(selfieImage) await RNFS.unlink(selfieImage.uri)
            if(selfieImageWithID) await RNFS.unlink(selfieImageWithID.uri)
            if(frontImage) await RNFS.unlink(frontImage.uri)
            if(backImage) await RNFS.unlink(backImage.uri)
        }catch (error){
            throw error;
        }
    }

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

        const rnSelfieFileWithID =  new ReactNativeFile({
            ...VerifyUserData.selfieImageWithID,
            name: 'documentSelfieWithID.jpg',
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

        const input = {
            userId: session.user.id,
            mobileNumber: VerifyUserData.contactInfo.mobile_number,
            emailAddress: VerifyUserData.contactInfo.email,
            firstName: VerifyUserData.person.firstName,
            middleName: VerifyUserData.person.middleName,
            lastName: VerifyUserData.person.lastName,
            hasMiddleName: VerifyUserData.person.hasMiddleName,
            gender: VerifyUserData.person.gender,
            birthdate: moment(VerifyUserData.birthInfo.birthdate).format("YYYY-MM-DD"),
            // birthdate: VerifyUserData.birthInfo.birthdate,
            birthPlace: VerifyUserData.birthInfo.birthPlace,
            ...( rnSelfieFile ? {selfieImage: rnSelfieFile} : {} ),
            ...( rnSelfieFileWithID ? {selfieImageWithID: rnSelfieFileWithID} : {} ),
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
            sourceIncomeId: VerifyUserData.incomeInfo.source.id,
            otherSource: VerifyUserData.incomeInfo.otherSource,
            occupation: VerifyUserData.incomeInfo.occupation
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
                        <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD}}>Review Information</Text>
                        <Text style={{fontFamily: FONT.REGULAR,marginBottom: 10,fontSize: FONT_SIZE.M,color:"#929191"}}>Make sure your details are all correct.</Text>  
                        <UserInfo label="Mobile Number" value={VerifyUserData.contactInfo.mobile_number}/>
                        <UserInfo label="Email Address" value={VerifyUserData.contactInfo.email}/>
                        <UserInfo label="First Name" value={VerifyUserData.person.firstName}/>
                        <UserInfo label="Middle Name" value={VerifyUserData.person.middleName}/>
                        <UserInfo label="Last Name" value={VerifyUserData.person.lastName}/>
                        <UserInfo label="Gender" value={VerifyUserData.person.gender}/>
                        <UserInfo label="Date of Birth" value={moment(VerifyUserData.birthInfo.birthdate).format("MMM DD, YYYY")}/>
                        <UserInfo label="Place of Birth" value={VerifyUserData.birthInfo.birthPlace}/>
                        <UserInfo label="Nationality" value={VerifyUserData.nationality}/>
                        <UserInfo label="Address" value={`${VerifyUserData.address.line1} ${VerifyUserData.address.line2} ${VerifyUserData.city} ${VerifyUserData.province}, ${VerifyUserData.address.country} ${VerifyUserData.address.postalCode}`}/>
                        <UserInfo label="Source of Income" value={VerifyUserData.incomeInfo.source.description}/>
                        {
                            VerifyUserData.incomeInfo.source.description == "others" &&
                            <UserInfo label="" value={VerifyUserData.incomeInfo.otherSource}/>
                        }
                        <UserInfo label="Occupation" value={VerifyUserData.incomeInfo.occupation}/>
                        <UserInfo label="ID Type" value={VerifyUserData.verifyID.idType}/>
                        <UserInfo label="ID number" value={VerifyUserData.verifyID.idNumber}/>
                </ScrollView>

                <View style={styles.proceedBtn}>

                    <View style={{
                        flexDirection:"row",
                        flexGrow: 1,
                    }}>
                        <CheckBox
                            isChecked={isCertify}
                            onClick={()=>{
                                return setCertify(!isCertify)
                            }}
                            style={{
                                alignSelf: "center",
                                marginRight: 2,
                            }}
                        />
                        <TouchableOpacity 
                            onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")} 
                            style={{paddingHorizontal: 10,marginRight: 20,alignSelf:"center"}}
                        >
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>I hereby certify that I accept the <Text style={{color: COLOR.ORANGE,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Terms and Conditions.</Text></Text>
                        </TouchableOpacity>
                    
                    </View>
                  
                    <View style={{height: SIZE.FORM_HEIGHT}}>
                        {
                            isCertify 
                            ? <YellowButton label="Confirm" onPress={confirm}/>
                            : <DisabledButton label="Confirm" />
                        }
                    </View>
                   
                </View>
            </View>
        </>
    )
})

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