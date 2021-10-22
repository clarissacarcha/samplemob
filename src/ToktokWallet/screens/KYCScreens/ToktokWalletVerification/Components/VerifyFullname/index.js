import React, {useContext, useEffect, useState,useRef} from 'react'
import {Text,View,StyleSheet,Alert,Image,TextInput,TouchableOpacity,Linking,ScrollView,KeyboardAvoidingView,Dimensions,Platform} from 'react-native'
import {VerifyContext} from '../VerifyContextProvider'
import validator from 'validator';
import {YellowButton } from 'src/revamp'
import FIcon5 from 'react-native-vector-icons/FontAwesome5'
import moment from 'moment'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import BottomSheetGender from './BottomSheetGender'
import DateBirthModal from './DateBirthModal'
import ModalNationality from './ModalNationality'


const {COLOR, FONT_FAMILY: FONT ,SIZE,FONT_SIZE} = CONSTANTS

const screen = Dimensions.get('window');

export const VerifyFullname = ()=> {

    const {
        nationality ,
        nationalityId,
        setCurrentIndex , 
        person , 
        changePersonInfo , 
        contactInfo,
        changeContactInfo,
        birthInfo , 
        changeBirthInfo, 
        setModalCountryVisible
     } = useContext(VerifyContext)

    const [modalVisible,setModalVisible] = useState(false)
    const [modalNationalityVisible, setModalNationalityVisible] = useState(false)
    const [modaltype,setModaltype] = useState("")
    const [mobile, setMobile] = useState(contactInfo.mobile_number.replace("+63", ""))
    const genderRef = useRef()

    // const {loading, error, data} = useQuery(GET_COUNTRIES, {
    //     client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT
    // })

    // useEffect(() => {

    //     console.log("Countries List", typeof data)
    // }, [])

    const NextPage = ()=> {
        if (validator.isEmpty(person.lastName, {ignore_whitespace: true})) {
            return Alert.alert("","Last Name is required.")
        }

        if (validator.isEmpty(person.middleName, {ignore_whitespace: true})) {
            return Alert.alert("","Middle Name is required.")
        }

        if (validator.isEmpty(person.firstName, {ignore_whitespace: true})) {
            return Alert.alert("","First Name is required.")
        }

        if (validator.isEmpty(person.gender, {ignore_whitespace: true})) {
            return Alert.alert("","Gender is required.")
        }

        if (!validator.isEmail(contactInfo.email, {ignore_whitespace: true})) {
            return Alert.alert("","Email format is invalid.")
        }

        if(mobile == "") return Alert.alert("","Mobile Number is required.")
        if(contactInfo.email == "") return Alert.alert("","Email is required.")
        if(birthInfo.birthdate == "") return Alert.alert("","Date of Birth is required.")
        if(birthInfo.birthPlace == "") return Alert.alert("","Place of Birth is required.")
        if(nationalityId == "") return Alert.alert("","Nationality is required.")

        changeContactInfo("mobile_number", "+63" + mobile)
        setCurrentIndex(oldval => oldval + 1)
    }

    const ViewPrivacyPolicy = ()=> {
        return Linking.openURL("https://toktok.ph/privacy-policy")
    }

    const onMobileChange = (val) => {
        const value = val.replace(/[^0-9]/g,"")
        if (value.length === 1 && value === '0') {
          setMobile('');
          return;
        }
    
        if (value.length > 10) {
          setMobile(mobile);
          return;
        }
    
        setMobile(value);
      };

      const setGender = (gender)=>{
        genderRef.current.close()
        changePersonInfo("gender",gender)
      }

    return (
        <>
         <DateBirthModal modalVisible={modalVisible} setModalVisible={setModalVisible} birthInfo={birthInfo} changeBirthInfo={changeBirthInfo}/>
         <ModalNationality 
                visible={modalNationalityVisible}
                setVisible={setModalNationalityVisible}
         />
     
        <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "height" : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.25 : screen.height * 0.5}
                style={{ flex: 1 }}
        >
                   <ScrollView style={{padding: 16}} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
                <View>
                <Image style={styles.policyIcon} source={require('toktokwallet/assets/icons/walletVerify.png')} resizeMode="contain" />
                </View>
                <View style={{justifyContent: "center", alignItems: "center",marginRight: 20,}}>
                    <Text style={{marginHorizontal: 10,fontSize: FONT_SIZE.S,fontFamily: FONT.REGULAR}}>All your details are protected in accordance with our <Text style={{color: COLOR.YELLOW}}>privacy policy.</Text></Text>
                </View>
        </TouchableOpacity>

                <View style={styles.mainInput}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Fill up the information</Text>
                    <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S,color:"#929191"}}>Please enter the name that appears on your Valid ID.</Text>

                    
                    <View style={{marginTop: 20}}>
                      <Text style={{fontFamily: FONT.BOLD, marginBottom: 2}}>Mobile Number</Text>
                      <View
                        style={{
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            overflow: 'hidden',
                            height: 50,
                            marginBottom: FONT_SIZE.MARGIN,
                            backgroundColor: COLOR.LIGHT,
                        }}>
                        <View
                          style={{
                            height: SIZE.FORM_HEIGHT,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 4.3,
                            backgroundColor:"lightgray",
                          }}>
                          <Text style={{ marginHorizontal: 6,fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>+63</Text>
                        </View>
                        <View style={{paddingLeft: 5, flex: 1, ...styles.input,justifyContent:"center"}}>
                            <Text style={{ marginHorizontal: 6,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{mobile}</Text>
                        </View>
                        {/* <TextInput
                            value={mobile}
                            onChangeText={onMobileChange}
                            placeholder="9151234567"
                            keyboardType="number-pad"
                            returnKeyType="done"
                            style={{paddingLeft: 5, flex: 1, ...styles.input}}
                            placeholderTextColor={COLOR.DARK}
                        /> */}
                      </View>
                    </View>


                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>First Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.firstName}
                            onChangeText={(value)=>changePersonInfo("firstName",value)}
                            placeholder="Enter first name here"
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Middle Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.middleName}
                            onChangeText={(value)=>changePersonInfo("middleName",value)}
                            placeholder="Enter middle name here"
                            returnKeyType="done"
                        />
                    </View>


                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Last Name</Text>
                        <TextInput 
                            style={styles.input}
                            value={person.lastName}
                            onChangeText={(value)=>changePersonInfo("lastName",value)}
                            placeholder="Enter last name here"
                            returnKeyType="done"
                        />
                    </View>


                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Gender</Text>
                        <TouchableOpacity 
                            style={[styles.input, {flex: 1,justifyContent:'center'}]}
                            onPress={()=>genderRef.current.expand()}
                        >
                               {/* {
                                     person.gender == ""
                                     ? <Text style={{flex: 1,fontFamily: FONT.REGULAR,color: COLOR.DARK,fontSize: FONT_SIZE.M}}>-Select Gender-</Text>
                                     : <Text style={{flex: 1,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{person.gender}</Text>
                               } */}
                                {/* <Text>gg</Text> */}
                                {
                                    person.gender == ""
                                    ? <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M,color: COLOR.DARK}}>-Select Gender-</Text>
                                    : <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{person.gender}</Text>
                                }
                        </TouchableOpacity>

                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={contactInfo.email}
                            onChangeText={(value)=>changeContactInfo("email",value)}
                            placeholder="Enter email here"
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Date of Birth</Text>
                             <TouchableOpacity onPress={()=>setModalVisible(true)} style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center"}]}>
                                 {
                                     birthInfo.birthdate == ""
                                     ? <Text style={{flex: 1,fontFamily: FONT.REGULAR,color: COLOR.DARK,fontSize: FONT_SIZE.M}}>mm/dd/yy</Text>
                                     : <Text style={{flex: 1,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{moment(birthInfo.birthdate).format("MM/DD/YYYY")}</Text>
                                 }
                                <FIcon5 color="black" name="calendar" size={15}/>
                            </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Place of Birth</Text>
                        <TextInput 
                            style={styles.input}
                            value={birthInfo.birthPlace}
                            onChangeText={(value)=>changeBirthInfo("birthPlace",value)}
                            placeholder={"Enter place of birth here"}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{marginTop: 20,}}>
                    <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Nationality</Text>
                            <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{flex: 1,fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR}}>{nationality}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                      setModalNationalityVisible(true)
                                    }}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: COLOR.YELLOW,
                                        borderRadius: 5,
                                        height: 20
                                    }}
                                >
                                    <View style={{
                                         flex: 1,
                                         justifyContent:"center",
                                         alignItems:"center",
                                    }}>
                                        <Text style={{color: COLOR.YELLOW,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.S}}>Change</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                    </View>
                    <View style={{marginBottom: 16,marginTop: 20,height: 70}}>
                    <YellowButton label="Next" onPress={NextPage}/>
                    </View>
                    
            </View>
                 </ScrollView>
            </KeyboardAvoidingView>

            <BottomSheetGender ref={genderRef} onChange={setGender}/>
       
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
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    }
})
