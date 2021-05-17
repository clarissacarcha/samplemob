import React, {useContext, useState} from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity,Linking,ScrollView} from 'react-native'
import {FONTS, SIZES, COLORS} from '../../../../../../../res/constants'
import {VerifyContext} from './VerifyContextProvider'
import validator from 'validator';
import { BlackButton, YellowButton } from '../../../../../../../revamp'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'

//SELF IMPORTS
import ModalCountry from './ModalCountry'
import {DateBirthModal} from './VerifyBirth'
import ModalNationality from './ModalNationality'

const VerifyFullname = ()=> {

    const {
        nationality ,
        setCurrentIndex , 
        person , 
        changePersonInfo , 
        birthInfo , 
        changeBirthInfo, 
        setModalCountryVisible
     } = useContext(VerifyContext)

    const [modalVisible,setModalVisible] = useState(false)
    const [modalNationalityVisible, setModalNationalityVisible] = useState(false)
    const [modaltype,setModaltype] = useState("")

    const NextPage = ()=> {
        if (validator.isEmpty(person.lastName, {ignore_whitespace: true})) {
            return Alert.alert("","Last Name is required.")
        }
        if (validator.isEmpty(person.firstName, {ignore_whitespace: true})) {
            return Alert.alert("","first Name is required.")
        }
        if(birthInfo.birthdate == "") return Alert.alert("","Date of Birth is required.")
        if(birthInfo.birthPlace == "") return Alert.alert("","Place of Birth is required.")

        setCurrentIndex(oldval => oldval + 1)
    }

    const ViewPrivacyPolicy = ()=> {
        return Linking.openURL("https://toktok.ph/privacy-policy")
    }

    return (
        <>
         <DateBirthModal modalVisible={modalVisible} setModalVisible={setModalVisible} birthInfo={birthInfo} changeBirthInfo={changeBirthInfo}/>
         <ModalNationality 
                visible={modalNationalityVisible}
                setVisible={setModalNationalityVisible}
         />
        <ScrollView style={styles.content}>

        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
                <View>
                <Image style={styles.policyIcon} source={require('../../../../../../../assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center",marginRight: 20,}}>
                    <Text style={{marginHorizontal: 10,fontSize: SIZES.S,fontFamily: FONTS.REGULAR}}>All your details are protected in accordance with our <Text style={{color: COLORS.YELLOW}}>privacy policy.</Text></Text>
                </View>
        </TouchableOpacity>

            <View style={styles.mainInput}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Fill up the information</Text>
                    <Text style={{fontFamily: FONTS.REGULAR,fontSize: SIZES.S,color:"#929191"}}>Please enter the name that appears on your Valid ID.</Text>


                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Last Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.lastName}
                            onChangeText={(value)=>changePersonInfo("lastName",value)}
                            placeholder="Enter last name here"
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>First Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.firstName}
                            onChangeText={(value)=>changePersonInfo("firstName",value)}
                            placeholder="Enter first name here"
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Middle Name ( Optional )</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.middleName}
                            onChangeText={(value)=>changePersonInfo("middleName",value)}
                            placeholder="Enter middle name here"
                        />
                    </View>
                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Date of Birth</Text>
                             <TouchableOpacity onPress={()=>setModalVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                <Text style={{flex: 1,fontFamily: FONTS.REGULAR,color: "gray",fontSize: SIZES.M}}>{birthInfo.birthdate == "" ? "mm/dd/yy" : moment(birthInfo.birthdate).format("MM/DD/YYYY")}</Text>
                                <FIcon5 color="#CCCCCC" name="calendar" size={15}/>
                            </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Place of Birth</Text>
                        <TextInput 
                            style={styles.input}
                            value={birthInfo.birthPlace}
                            onChangeText={(value)=>changeBirthInfo("birthPlace",value)}
                            placeholder={"Enter place of birth here"}
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONTS.BOLD,fontSize: SIZES.M}}>Nationality</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,color: "gray",fontSize: SIZES.M,fontFamily: FONTS.REGULAR}}>{nationality}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                      setModalNationalityVisible(true)
                                    }}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: COLORS.YELLOW,
                                        borderRadius: 5,
                                        height: 20
                                    }}
                                >
                                    <View style={{
                                         flex: 1,
                                         justifyContent:"center",
                                         alignItems:"center",
                                    }}>
                                        <Text style={{color: COLORS.YELLOW,fontFamily: FONTS.REGULAR,fontSize: SIZES.S}}>Change</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    </View>
                    <View style={{marginBottom: 16,marginTop: 20,}}>
                    <YellowButton label="Next" onPress={NextPage}/>
                    </View>
                    
            </View>

         
        </ScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    policyView: {
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 20,
        // paddingHorizontal: 16,
        // paddingVertical: 18,
    },  
    policyIcon: {
        height: 30,
        width: 30, 
        alignSelf: "center"
    },
    progressBar: {
        height: 2,
        width: "100%",
        flexDirection: "row",
    }, 
    progressBarItem: {
        flex: 1,
    },
    content: {
        padding: 16,
        flex: 1,
    },
    mainInput: {
        flex: 1,
    },
    proceedBtn: {
        height: 40,
        width: "100%",
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONTS.REGULAR,
        fontSize: SIZES.M,
        paddingHorizontal: 10,
    }
})

export default VerifyFullname