import React, {useEffect,useState} from 'react'
import {View,Text,StyleSheet,ScrollView,TextInput,Alert,TouchableOpacity,Modal,StatusBar,TouchableOpacityBase,Image} from 'react-native'
import { HeaderBack, YellowButton } from 'src/revamp';
import {HeaderTitle} from 'src/components'
import { Separator , CheckIdleState , FlagSecureScreen } from 'toktokwallet/components';
import validator from 'validator';
import {UPDATE_GCASH_ACCOUNT} from 'src/graphql';
import {useMutation} from '@apollo/react-hooks';
import {onError} from 'src/util/ErrorUtility';
import moment from 'moment'
import CONSTANTS from 'common/res/constants'

//SELF IMPORtS
import DatePickerModal from '../ToktokWalletGcashRegistration/Components/CreateForm/DatePickerModal';

const { FONT_FAMILY: FONT , COLOR , SIZE , FONT_SIZE } = CONSTANTS

const PromptMessage = ({
    visible,
    setVisible,
    navigation
})=> {

    return (
        <>
        <StatusBar barStyle="dark-content" backgroundColor={visible ? "rgba(34, 34, 34, 0.5)" : "transparent"} />
        <Modal
            visible={visible}
            onRequestClose={()=>setVisible(false)}
            transparent={true}
            style={styles.promptMessage}
        >

            <View style={styles.promptMessageContent}>
                <View style={styles.promptContent}>
                    <Image style={{height: 90,width: 90}} resizeMode="contain" source={require('toktokwallet/assets/images/cash-out-providers/gcash.png')}/>
                    <View style={{alignItems:"center"}}>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Successfully updated</Text>
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.DARK}}>Gcash Account.</Text>
                    </View>
                    <TouchableOpacity 
                        style={{
                            width: "100%",
                            paddingVertical: 2,
                            alignItems:"center"
                        }}
                        onPress={()=>{
                            setVisible(false)
                            navigation.navigate("ToktokWalletGcashRegistration")
                            return navigation.replace("ToktokWalletGcashRegistration")
                        }}
                    >
                        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M,color: COLOR.ORANGE}}>OK</Text>
                    </TouchableOpacity>
                  
                </View>
            </View>

        </Modal>
        </>
    )
}

export const ToktokWalletGcashUpdate = ({navigation,route})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBack color={COLOR.YELLOW}/>,
        headerTitle: ()=> <HeaderTitle label={["GCash Account"]}/>
    })

    const record = route.params.record

    const [pickerVisible, setPickerVisible] = useState(false);

    const [mobileNumber, setMobileNumber] = useState(record.mobileNumber);
    const [firstName, setfirstName] = useState(record.firstName);
    const [middleName, setMiddleName] = useState(record.middleName);
    const [lastName, setlastName] = useState(record.lastName);
    const [streetAddress, setStreetAddress] = useState(record.streetAddress);
    const [birthdate, setBirthdate] = useState(moment(record.birthdate, 'MM-DD-YYYY').tz('Asia/Manila').format('YYYY-MM-DD'));

    const [promptVisible,setPromptVisible] = useState(false);

    const [updateGCashAccount, {loading: updateLoading}] = useMutation(UPDATE_GCASH_ACCOUNT, {
        onError,
        onCompleted: (res) => {
            setPromptVisible(true)
        },
      });

    const changeMobileNumber = (value)=>{
        let mobile = value.replace(/[^0-9]/g, "")
        if(mobile.length > 11) return

        if(value[0] == "9"){
            setMobileNumber("09")
        }else{
            setMobileNumber(mobile)
        }
    } 
    
    const saveGcashAccount = ()=> {
        if (validator.isEmpty(mobileNumber, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter mobile number.');
            return;
          }
      
          if (validator.isEmpty(firstName, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter first name.');
            return;
          }
      
          if (validator.isEmpty(lastName, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter last name.');
            return;
          }
      
          if (validator.isEmpty(streetAddress, {ignore_whitespace: true})) {
            Alert.alert('', 'Please enter street address.');
            return;
          }
      
          if (validator.isEmpty(birthdate, {ignore_whitespace: true})) {
            Alert.alert('', 'Please select birthdate.');
            return;
          }

          updateGCashAccount({
            variables: {
              input: {
                mobileNumber,
                firstName,
                middleName,
                lastName,
                streetAddress,
                birthdate,
                id: record.id,
              },
            },
          });
      
    }

    return (
        <FlagSecureScreen>
       <CheckIdleState>
        <PromptMessage visible={promptVisible} setVisible={setPromptVisible} navigation={navigation}/>
        <DatePickerModal
            visible={pickerVisible}
            hidePicker={() => setPickerVisible(false)}
            locale="en"
            onDateSelect={(value) => {
                setBirthdate(value);
                setPickerVisible(false);
            }}
        />
        <Separator/>
       <View style={styles.container}>
            <ScrollView style={{flex: 1,flexGrow: 1,}}>

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
                    <Text style={styles.label}>Middle Name ( Optional )</Text>
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
                    <Text style={styles.label}>Birthdate</Text>
                    <TouchableOpacity onPress={() => setPickerVisible(true)}>
                        <View style={styles.birthdate}>
                        {birthdate === '' ? (
                            <Text style={{color: COLOR.LIGHT,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>Select Birthdate</Text>
                        ) : (
                            <Text style={{color: COLOR.MEDIUM,fontFamily: FONT.REGULAR,fontSize: FONT_SIZE.M}}>{birthdate}</Text>
                        )}
                        </View>
                    </TouchableOpacity>
                </View>

                

                
            </ScrollView>

            <YellowButton label="Save" onPress={saveGcashAccount}/>

            
       </View>
       </CheckIdleState>
       </FlagSecureScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor:"white"
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
        height: 227,
        width: 280,
        backgroundColor:"white",
        borderRadius: 10,
        alignItems:"center",
        justifyContent: "space-between",
        padding: 16,
    }
})
