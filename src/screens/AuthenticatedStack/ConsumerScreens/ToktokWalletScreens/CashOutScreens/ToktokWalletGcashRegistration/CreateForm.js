import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,Alert,TouchableOpacity,Modal,StatusBar,TouchableOpacityBase,Image} from 'react-native'
import { HeaderBack, YellowButton } from '../../../../../../revamp';
import {AlertOverlay, HeaderTitle} from '../../../../../../components'
import { FONT, FONT_SIZE , COLOR } from '../../../../../../res/variables';
import { Separator } from '../../Components';
import validator from 'validator';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql';
import { POST_CASH_OUT_ENROLLMENG_GCASH } from '../../../../../../graphql/toktokwallet';
import {useMutation} from '@apollo/react-hooks';
import {onError, onErrorAlert} from '../../../../../../util/ErrorUtility';
import { useAlert } from '../../../../../../hooks';

//SELF IMPORTS
import DatePickerModal from './DatePickerModal';
import ModalCountry from './ModalCountry';


const PromptMessage = ({
    visible,
    setVisible,
    navigation,
    provider,
})=> {

    const redirect = ()=> {
        setVisible(false)
        navigation.navigate("ToktokWalletGcashHomePage", {provider})
        return navigation.replace("ToktokWalletGcashHomePage", {provider})
    }

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor={visible ? "rgba(34, 34, 34, 0.5)" : "transparent"} />
        <Modal
            visible={visible}
            onRequestClose={redirect}
            transparent={true}
            style={styles.promptMessage}
        >

            <View style={styles.promptMessageContent}>
                <View style={styles.promptContent}>
                    <Image style={{height: 90,width: 90}} resizeMode="contain" source={require('../../../../../../assets/icons/gcash.png')}/>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Success!</Text>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Your application has been submitted. Please wait for your GCash disbursement account to be verified.</Text>
                    </View>
                    <TouchableOpacity 
                        style={{
                            width: "100%",
                            paddingVertical: 2,
                            alignItems:"center"
                        }}
                        onPress={redirect}
                    >
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>Ok</Text>
                    </TouchableOpacity>
                  
                </View>
            </View>

        </Modal>
        </>
    )
}

const CreateForm = ({navigation,session,mobile,provider})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash Account"]}/>
    })
    const alert = useAlert()
    const [pickerVisible, setPickerVisible] = useState(false);

    const [mobileNumber, setMobileNumber] = useState(mobile);
    const [errorMessage,setErrorMessage] = useState("");
    const [firstName, setfirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setlastName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [barangayTown, setBarangayTown] = useState('');
    const [provinceCity, setProvinceCity] = useState('');
    const [country, setCountry] = useState('Philippines');
   

    const [promptVisible,setPromptVisible] = useState(false);
    const [modalCountryVisible,setModalCountryVisible] = useState(false);

    const [postCashOutEnrollmentGcash, {data, error ,loading}] = useMutation(POST_CASH_OUT_ENROLLMENG_GCASH, {
            client: TOKTOK_WALLET_GRAPHQL_CLIENT,
            onError: (error)=> {
                onErrorAlert({alert,error})
            },
            onCompleted: (res) => {
            setPromptVisible(true)
            },
      });

    const changeMobileNumber = (value)=>{
        let mobile = value.replace(/[^0-9]/g, "")

         if(mobile.length == 0){
            setErrorMessage("")
            setMobileNumber(mobile)
            return
         }

        if(mobile.length > 10 && mobile.slice(0,2) == "09"){
            setErrorMessage("")
        }else{
            setErrorMessage("Mobile number must be valid.")
        }

        if(mobile.length > 11) return

        if(value[0] == "9"){
            setMobileNumber("09")
        }else{
            setMobileNumber(mobile)
        }
    } 
    
    const saveGcashAccount = ()=> {
        if (validator.isEmpty(mobileNumber, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Mobile Number.');
            return;
          }
      
          if (validator.isEmpty(firstName, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter First Name.');
            return;
          }
      
          if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Last Name.');
            return;
          }

          if (validator.isEmpty(birthdate, {ignore_whitespace: true})) {
            Alert.alert('', 'Please select Birthdate.');
            return;
          }
      
          if (validator.isEmpty(streetAddress, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Street Address.');
            return;
          }

          if (validator.isEmpty(barangayTown, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Barangay Town.');
            return;
          }

          if (validator.isEmpty(provinceCity, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Province City.');
            return;
          }

          if (validator.isEmpty(country, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Country.');
            return;
          }


          postCashOutEnrollmentGcash({
              variables: {
                  input: {
                        mobile: mobileNumber,
                        firstName: firstName,
                        lastName: lastName,
                        streetAddress: streetAddress,
                        barangayTown: barangayTown,
                        provinceCity: provinceCity,
                        country: country,
                        birthdate: birthdate,
                  }
              }
          })
        

        //   postGCashAccount({
        //     variables: {
        //       input: {
        //         mobileNumber,
        //         firstName,
        //         middleName,
        //         lastName,
        //         streetAddress,
        //         birthdate,
        //         personId: session.user.person.id,
        //       },
        //     },
        //   });
      
    }

    return (
       <>
        <AlertOverlay visible={loading} />
        <PromptMessage provider={provider} visible={promptVisible} setVisible={setPromptVisible} navigation={navigation}/>
        <ModalCountry visible={modalCountryVisible} setVisible={setModalCountryVisible} setCountry={setCountry}/>
        <DatePickerModal
            visible={pickerVisible}
            hidePicker={() => setPickerVisible(false)}
            locale="en"
            onDateSelect={(value) => {
                setBirthdate(value);
                setPickerVisible(false);
            }}
        />
       <View style={styles.container}>
            <ScrollView style={{flex: 1,flexGrow: 1,}} showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter mobile number here"
                        value={mobileNumber}
                        onChangeText={(value)=>changeMobileNumber(value)}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                    { errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,color:"red",fontSize: FONT_SIZE.S}}>{errorMessage}</Text> }
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter first name here"
                        onChangeText={(value)=>setfirstName(value)}
                        value={firstName}
                        returnKeyType="done"
                    />
                </View>

                {/* <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Middle Name ( Optional )</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter middle name here"
                        onChangeText={(value)=>setMiddleName(value)}
                        value={middleName}
                        returnKeyType="done"
                    />
                </View> */}

                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter last name here"
                        onChangeText={(value)=>setlastName(value)}
                        value={lastName}
                        returnKeyType="done"
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Birthdate</Text>
                    <TouchableOpacity onPress={() => setPickerVisible(true)}>
                        <View style={styles.birthdate}>
                        {birthdate === '' ? (
                            <Text style={{color: COLOR.DARK,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Select Birthdate</Text>
                        ) : (
                            <Text style={{color: COLOR.DARK,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{birthdate}</Text>
                        )}
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Street Address</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter street address here"
                        onChangeText={(value)=>setStreetAddress(value)}
                        value={streetAddress}
                        returnKeyType="done"
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Barangay Town</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter barangay and town here"
                        onChangeText={(value)=>setBarangayTown(value)}
                        value={barangayTown}
                        returnKeyType="done"
                    />
                </View>


                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Province City</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter province and city here"
                        onChangeText={(value)=>setProvinceCity(value)}
                        value={provinceCity}
                        returnKeyType="done"
                    />
                </View>


                <View style={{marginVertical: 20}}>
                    <Text style={styles.label}>Country</Text>
                    {/* <TextInput 
                        style={styles.input}
                        placeholder="Enter Country here"
                        onChangeText={(value)=>setCountry(value)}
                        value={country}
                        returnKeyType="done"
                    /> */}
                  <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                            <Text style={{ fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,flex: 1}}>{country}</Text>
                            <TouchableOpacity
                                    onPress={()=>setModalCountryVisible(true)}
                                    style={{
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: COLOR.YELLOW,
                                        borderRadius: 5,
                                        height: 20,
                                        marginRight: 10,
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


                
                
                <YellowButton label="Save" onPress={saveGcashAccount}/>

                
            </ScrollView>

            {/* <YellowButton label="Save" onPress={saveGcashAccount}/> */}

       </View>
       </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    proceedBtn: {
       height: 70,
       justifyContent:"flex-end",
    },
    input: {
        height: 50,
        backgroundColor: "#F7F7FA",
        borderRadius: 5,
        fontSize: FONT_SIZE.M,
        fontFamily: FONT.REGULAR,
        paddingLeft: 10,
    },
    label: {
        fontFamily: FONT.BOLD,
        fontSize: FONT.M
    },
    birthdate: {
        backgroundColor: "#F7F7FA",
        borderRadius: 5,
        paddingLeft: 10,
        height: 50,
        color: COLOR.DARK,
        justifyContent: 'center',
      },
    promptMessage: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    promptMessageContent: {
        flex:1,
        backgroundColor:"rgba(34,34,34,0.5)",
        justifyContent:"center",
        alignItems:"center"
    },
    promptContent: {
        height: 250,
        width: 280,
        backgroundColor:"white",
        borderRadius: 10,
        alignItems:"center",
        justifyContent: "space-between",
        padding: 16,
    }
})

export default CreateForm