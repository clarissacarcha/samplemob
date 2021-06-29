import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,Alert,KeyboardAvoidingView,Dimensions,TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'
import { HeaderBack, YellowButton,HeaderTitle } from '../../../../../../revamp';
import {AlertOverlay, SomethingWentWrong} from '../../../../../../components'
import { COLORS, FONTS, SIZES } from '../../../../../../res/constants';
import { Separator } from '../../Components';
import {useAlert} from '../../../../../../hooks/useAlert'
import {onErrorAlert,onError} from '../../../../../../util/ErrorUtility'
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from '../../../../../../graphql/'
import {POST_CASH_OUT_ENROLLMENT_BDO,GET_MY_ACCOUNT_GCASH_FILL} from '../../../../../../graphql/toktokwallet';
import { useMutation , useLazyQuery} from '@apollo/react-hooks';
import { FONT, FONT_SIZE ,COLOR , SIZE} from '../../../../../../res/variables';
import validator from 'validator';
import moment from 'moment'

//SELF IMPORTS
import SuccessfulModal from './SuccessfulModal';
import DatePickerModal from './DatePickerModal';

const screen = Dimensions.get('window');

 const ToktokWalletBDORegistration = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLORS.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["BDO Account"]}/>
    })

    const tokwaAccount = useSelector(state=>state.toktokWallet)
    const {accountNumber , provider} = route.params
    const [accountName,setAccountName] = useState(`${tokwaAccount.person.firstName} ${tokwaAccount.person.lastName}`)
    const [email,setEmail] = useState(tokwaAccount.person.emailAddress)
    const [showModal,setShowModal] = useState(false)
    const [firstName, setfirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setlastName] = useState(tokwaAccount.person.lastName);
    const [birthdate, setBirthdate] = useState("");
    const [streetAddress, setStreetAddress] = useState('');
    const [barangayTown, setBarangayTown] = useState('');
    const [provinceCity, setProvinceCity] = useState('');
    const [country, setCountry] = useState('Philippines');
    const [pickerVisible, setPickerVisible] = useState(false);
    const alert = useAlert()


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

    const [postCashOutEnrollmentBdo, {data, error ,loading}] = useMutation(POST_CASH_OUT_ENROLLMENT_BDO, {
        client: TOKTOK_WALLET_GRAPHQL_CLIENT,
        onError: (error)=> {
            onErrorAlert({alert,error})
        },
        onCompleted: (res) => {
            setShowModal(true)
        },
  });

    const saveAccount = ()=> {
        // if (validator.isEmpty(accountName, {ignore_whitespace: true})) {
        //     return Alert.alert("","Account Name is required.")
        // }

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

        if (validator.isEmpty(email, {ignore_whitespace: true})) {
            return Alert.alert("","Email Address is required.")
        }

        if (!validator.isEmail(email, {ignore_whitespace: true})) {
            return Alert.alert("","Email format is invalid.")
        }

        postCashOutEnrollmentBdo({
            variables: {
                input: {
                    accountNumber: accountNumber,
                    accountName: accountName,
                    emailAddress: email,
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
        <AlertOverlay visible={loading}/>
        <DatePickerModal
            visible={pickerVisible}
            hidePicker={() => setPickerVisible(false)}
            locale="en"
            onDateSelect={(value) => {
                setBirthdate(value);
                setPickerVisible(false);
            }}
        />
        <SuccessfulModal
            visible={showModal}
            setVisible={setShowModal}
            provider={provider}
        />
        <Separator/>
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "height" : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? screen.height * 0.15 : screen.height * 0.5}
                style={{ flex: 1 }}
            >
             <ScrollView style={{flex: 1,flexGrow: 1,}} showsVerticalScrollIndicator={false}>
                <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Please nominate an existing BDO account.</Text>
                <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.S,marginBottom: 10}}>Successful fund transfer will be forwarded to this BDO account.</Text>
                    <View style={{marginVertical: 10,}}>
                        <Text style={{fontFamily: FONT.BOLD,fontSize: FONT_SIZE.M}}>Account Number</Text>
                        <View style={[styles.input, {justifyContent:"center", backgroundColor:"#F0F0F0"}]}>
                            <Text style={{fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{accountNumber}</Text>
                        </View>
                    </View>

                    <View style={{marginVertical: 10}}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Enter first name here"
                            onChangeText={(value)=>setfirstName(value)}
                            value={firstName}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{marginVertical: 10}}>
                        <Text style={styles.label}>Middle Name (Optional)</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Enter middle name here"
                            onChangeText={(value)=>setMiddleName(value)}
                            value={middleName}
                            returnKeyType="done"
                        />
                    </View>

                    <View style={{marginVertical: 10}}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Enter last name here"
                            onChangeText={(value)=>setlastName(value)}
                            value={lastName}
                            returnKeyType="done"
                        />
                    </View>
                    <View style={{marginVertical: 10}}>
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

                    <View style={{marginVertical: 10,}}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[{justifyContent:"center"}]}>
                            <TextInput 
                                    style={styles.input}
                                    value={email}
                                    returnKeyType="done"
                                    placeholder="Enter Email Address here"
                                    onChangeText={(value)=>setEmail(value)}
                            />
                        </View>
                    </View>

                    <View style={{marginVertical: 10}}>
                    <Text style={styles.label}>Street Address</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter street address here"
                        onChangeText={(value)=>setStreetAddress(value)}
                        value={streetAddress}
                        returnKeyType="done"
                    />
                </View>

                <View style={{marginVertical: 10}}>
                    <Text style={styles.label}>Barangay/Town</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter barangay and town here"
                        onChangeText={(value)=>setBarangayTown(value)}
                        value={barangayTown}
                        returnKeyType="done"
                    />
                </View>


                <View style={{marginVertical: 10}}>
                    <Text style={styles.label}>Province/City</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter province and city here"
                        onChangeText={(value)=>setProvinceCity(value)}
                        value={provinceCity}
                        returnKeyType="done"
                    />
                </View>
            

                    <View style={{marginVertical: 10}}>
                    <Text style={styles.label}>Country</Text>
                    <View style={[styles.input,{flexDirection: "row",justifyContent: "center",alignItems: "center",paddingVertical: 10}]}>
                                <Text style={{ fontSize: FONT_SIZE.M,fontFamily: FONT.REGULAR,flex: 1}}>{country}</Text>
                        </View>
                    </View>

                    <View style={{height: 70,justifyContent:'flex-end'}}>
                        <YellowButton label="Save" onPress={saveAccount}/>
                    </View>
            </ScrollView>

          
            </KeyboardAvoidingView>
        </View>
        </>
     )
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
    },
    input: {
        height: 50,
        borderRadius: 5,
        backgroundColor:"#F7F7FA",
        marginTop: 5,
        fontFamily: FONT.REGULAR,
        fontSize: FONT_SIZE.M,
        paddingHorizontal: 10,
    },
    label: {
        fontFamily: FONT.BOLD,
        fontSize: FONT_SIZE.M
    },
    birthdate: {
        backgroundColor: "#F7F7FA",
        borderRadius: 5,
        paddingLeft: 10,
        height: 50,
        color: COLOR.DARK,
        justifyContent: 'center',
      },
})


 export default ToktokWalletBDORegistration