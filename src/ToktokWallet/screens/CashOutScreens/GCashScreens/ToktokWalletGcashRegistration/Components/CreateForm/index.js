import React, {useEffect,useState,useRef} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,Alert,TouchableOpacity,Modal,StatusBar,TouchableOpacityBase,Image,KeyboardAvoidingView,Platform,Dimensions,ActivityIndicator} from 'react-native'
import { HeaderBack, YellowButton } from 'src/revamp';
import {AlertOverlay, HeaderTitle} from 'src/components'
import validator from 'validator';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import { POST_CASH_OUT_ENROLLMENG_GCASH , GET_MY_ACCOUNT_GCASH_FILL } from 'toktokwallet/graphql';
import {useMutation, useQuery,useLazyQuery} from '@apollo/react-hooks';
import {onError, onErrorAlert} from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';
import moment from 'moment'
import {useSelector,useDispatch} from 'react-redux'
import CONSTANTS from 'common/res/constants'

//SELF IMPORTS
import DatePickerModal from './DatePickerModal';
import ModalCountry from './ModalCountry';
import BottomSheetGender from './BottomSheetGender'

const { FONT_FAMILY: FONT , FONT_SIZE , COLOR , SIZE } = CONSTANTS

const screen = Dimensions.get('window');

const PromptMessage = ({
    visible,
    setVisible,
    navigation,
    provider,
    tokwaAccount
})=> {

    const dispatch = useDispatch()
    
    const redirect = ()=> {
        setVisible(false)
        if(tokwaAccount.events.upgradeAccount){
            dispatch({
                type: "SET_EVENTS_UPGRADE_ACCOUNT",
                payload: false
            })
            navigation.navigate("ToktokWalletFullyVerifiedApplication")
            return navigation.replace("ToktokWalletFullyVerifiedApplication")
        }
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
                    <Image source={require('toktokwallet/assets/images/success.png')}/>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.L}}>Success!</Text>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK,textAlign:"center"}}>Your application has been submitted. Please wait for your GCash disbursement account to be verified.</Text>
                    </View>
                    <View style={{width: "50%",alignSelf:"center"}}>
                        <YellowButton label="Ok" onPress={redirect}/>
                    </View>
                </View>
            </View>

        </Modal>
        </>
    )
}

const LoadingScreen = ()=> {
    return (
        <View style={{flex: 1,justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size={24} color={COLOR.YELLOW}/>
        </View>
    )
}

export const CreateForm = ({navigation,session,mobile,provider})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash Account"]}/>
    })
    const alert = useAlert()
    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const [pickerVisible, setPickerVisible] = useState(false);

    const [mobileNumber, setMobileNumber] = useState(mobile);
    const [errorMessage,setErrorMessage] = useState("");
    const [firstName, setfirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setlastName] = useState(tokwaAccount.person.lastName);
    const [birthdate, setBirthdate] = useState("");
    const [streetAddress, setStreetAddress] = useState('');
    const [barangayTown, setBarangayTown] = useState('');
    const [provinceCity, setProvinceCity] = useState('');
    const [country, setCountry] = useState('Philippines');
    const [gender,setGender] = useState("")
   

    const [promptVisible,setPromptVisible] = useState(false);
    const [modalCountryVisible,setModalCountryVisible] = useState(false);
    const genderRef = useRef()

    const [getMyAccount, {data: accountData, error: accountError, loading: accountLoading}] = useLazyQuery(GET_MY_ACCOUNT_GCASH_FILL, {
        fetchPolicy: 'network-only',
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: ({getMyAccount})=> {
            setfirstName(getMyAccount.person.firstName)
            setMiddleName(getMyAccount.person.middleName)
            setlastName(getMyAccount.person.lastName)
            setBirthdate(moment(+getMyAccount.person.birthdate).format("yyyy-MM-DD"))
            setStreetAddress(`${getMyAccount.person.address.line1}`)
            setBarangayTown(`${getMyAccount.person.address.line2}`)
            setProvinceCity(`${getMyAccount.person.address.province.provDesc}, ${getMyAccount.person.address.city.citymunDesc}`)
        }
    })

    useEffect(()=>{
        getMyAccount()
    },[])
    

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

        if(mobile.length > 8){
            setErrorMessage("")
        }else{
            setErrorMessage("Mobile number must be valid.")
        }
        if(mobile.length > 9) return

        setMobileNumber(mobile)

        // if(mobile.length > 10 && mobile.slice(0,2) == "09"){
        //     setErrorMessage("")
        // }else{
        //     setErrorMessage("Mobile number must be valid.")
        // }

        // if(mobile.length > 11) return

        // if(value[0] == "9"){
        //     setMobileNumber("09")
        // }else{
        //     setMobileNumber(mobile)
        // }
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
            Alert.alert('', 'Please enter Barangay/Town.');
            return;
          }

          if (validator.isEmpty(provinceCity, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Province/City.');
            return;
          }

          if (validator.isEmpty(country, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter Country.');
            return;
          }


          postCashOutEnrollmentGcash({
              variables: {
                  input: {
                        mobile: `09${mobileNumber}`,
                        firstName: firstName,
                        middleName: middleName,
                        lastName: lastName,
                        streetAddress: streetAddress,
                        barangayTown: barangayTown,
                        provinceCity: provinceCity,
                        country: country,
                        birthdate: birthdate,
                  }
              }
          })
      
    }

    return (
       <>
        <AlertOverlay visible={loading} />
        <PromptMessage tokwaAccount={tokwaAccount} provider={provider} visible={promptVisible} setVisible={setPromptVisible} navigation={navigation}/>
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
       <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "height" : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.15 : screen.height * 0.5}
            style={{ flex: 1 }}
        >
            <ScrollView style={{flex: 1,flexGrow: 1,}} showsVerticalScrollIndicator={false}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Please nominate an existing GCash account.</Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S,marginBottom: 10}}>Successful fund transfer will be forwarded to this GCash account.</Text>
                <View>
                    <Text style={styles.label}>Mobile Number</Text>
                      <View style={{flexDirection:"row",alignItems:"center",width:"100%",justifyContent:"center"}}>
                        <View style={{ backgroundColor:'#F7F7FA', borderTopLeftRadius: SIZE.BORDER_RADIUS,borderBottomLeftRadius: SIZE.BORDER_RADIUS,justifyContent:"center",alignItems:"center", height: SIZE.FORM_HEIGHT,paddingHorizontal: 10,marginTop: 5}}>
                            <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.L,paddingBottom: 2.5}}>09</Text>
                        </View>
                        <View style={[styles.input, {flex: 1,justifyContent:"center",backgroundColor:"#F0F0F0",borderTopLeftRadius: 0 , borderBottomLeftRadius: 0}]}>
                                <Text style={ {fontSize: FONT_SIZE.L + 1,fontFamily: FONT.REGULAR}}>{mobileNumber}</Text>
                        </View>
                        {/* <TextInput 
                                style={[styles.input, {fontSize: FONT_SIZE.L + 1,fontFamily: FONT.REGULAR, flex: 1,borderTopLeftRadius: 0,borderBottomLeftRadius: 0, borderWidth: 1, borderColor: errorMessage != "" ? COLOR.RED : "transparent"}]} 
                                placeholder="00-000-0000"
                                keyboardType="number-pad"
                                placeholderTextColor={COLOR.DARK}
                                value={mobileNumber}
                                returnKeyType="done"
                                onChangeText={(value)=>changeMobileNumber(value)}
                        /> */}
                    </View>
                    { errorMessage != "" && <Text style={{fontFamily: FONT.REGULAR,color:COLOR.RED,fontSize: FONT_SIZE.S}}>{errorMessage}</Text> }
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

                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Middle Name (Optional)</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter middle name here"
                        onChangeText={(value)=>setMiddleName(value)}
                        value={middleName}
                        returnKeyType="done"
                    />
                </View>

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
                            <Text style={{color: COLOR.DARK,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{moment(birthdate,"yyyy-mm-DD").format("mm/DD/yyyy")}</Text>
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
                    <Text style={styles.label}>Barangay/Town</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter barangay and town here"
                        onChangeText={(value)=>setBarangayTown(value)}
                        value={barangayTown}
                        returnKeyType="done"
                    />
                </View>


                <View style={{marginTop: 20}}>
                    <Text style={styles.label}>Province/City</Text>
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
                  <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                            <Text style={{ fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,flex: 1}}>{country}</Text>
                    </View>
                </View>


                
                
                <YellowButton label="Save" onPress={saveGcashAccount}/>

                
            </ScrollView>

            {/* <YellowButton label="Save" onPress={saveGcashAccount}/> */}

       </KeyboardAvoidingView>
       <BottomSheetGender ref={genderRef} onChange={(gender)=>{setGender(gender); genderRef.current.close()}}/>
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
        paddingHorizontal: 10,
        height: SIZE.FORM_HEIGHT,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR
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
        height: 270,
        width: 280,
        backgroundColor:"white",
        borderRadius: 10,
        alignItems:"center",
        justifyContent: "space-between",
        padding: 16,
    }
})
