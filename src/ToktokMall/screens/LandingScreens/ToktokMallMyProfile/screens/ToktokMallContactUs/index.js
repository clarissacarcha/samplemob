import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput, Linking, ToastAndroid
} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {MessageModal, LoadingOverlay} from '../../../../../Components'
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import * as  qs from 'qs'
import {contactus} from '../../../../../assets';

import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../../../graphql';
import { POST_CONTACT_SUPPORT } from '../../../../../../graphql/toktokmall/model';
import { useMutation } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-simple-toast";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiCall } from '../../../../../helpers';

export const ToktokMallContactUs = ({navigation}) => {
  
  const session = useSelector(state => state.session)
  const dispatch = useDispatch()
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [message, setMessage] = useState('')

  const [postInquiry, {loading}] = useMutation(POST_CONTACT_SUPPORT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    onCompleted: ({postContactSupport}) => {
      if(postContactSupport.signature){
        console.log("")
        sendMessage(postContactSupport.signature)
      }else{
        Toast.show("Something went wrong.")
      }
    },
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
  });

  const sendMessage = async (signature) => {
    try {
      const user = session.user.person
      const body = {
        signature: signature,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress,
        contact_number: session.user.username,
        message: message
      }
      const {responseData: {success}} = await ApiCall("send_contact_message", body, true, "")
      if(success == 1){
        setMessage('')
        dispatch({type:'TOKTOK_MALL_OPEN_MODAL', payload: {
          type: 'Success',
          message: "Sent!"
        }})
      }else{
        Toast.show("Something went wrong.")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const sendEmail = async ( subject, body, options= {}) => {
    const {cc, bcc} = options

    let url = 'mailto:mall@toktok.ph'

    const query = qs.stringify({
      subject: subject,
      body: body,
      cc: cc,
      bcc: bcc
    })

    if (query.length) {
      url += `?${query}`
    }

    const canOpen = await Linking.canOpenURL(url)

    if(!canOpen){
      throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url)
  }

  const onPressx = () => {
    let user = session.user.person
    if(session){
      if(message == ""){
        Toast.show("Enter message to send.")
      }else{
        sendEmail(
          message,
          '',
          {cc: '', }
        ).then(() => {
          console.log('Your message was successfully sent')
        })
      }
    }
    
  }

  const onPress = async () => {

    let user = session.user.person

    if(session){
      if(message == ""){
        Toast.show("Enter message to send.")
      }else{
        
        console.log(`${user.firstName} ${user.lastName}`, user.emailAddress, session.user.username, message)
        await postInquiry({
          variables: {
            input: {
              name: `${user.firstName} ${user.lastName}`,
              email: user.emailAddress,
              mobile: session.user.username,
              message: message
            }
          }
        })
      }
    }
    
  }

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Contact Us', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        {loading && <LoadingOverlay isVisible={loading} />}
        {messageModalShown && 
          <MessageModal 
            type="Success"
            isVisible={messageModalShown}
            setIsVisible={(val) => setMessageModalShown(val)}  
            message={'Sent'}
          />}
        <View
          style={{
            flex: 1,
            paddingVertical: 30,
            paddingHorizontal: 15
          }}>

          <View style={{alignItems: 'center'}}>
            <Image source={contactus} style={{width: 130, height: 100, resizeMode: 'contain'}} />
          </View>

          <View style={{flex: 0, flexDirection:'row', alignContent: 'center', alignItems: 'center', paddingVertical: 15}}>
            <View style={{flex: 0.8}} />
            <View style={{flex: 4, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
              <Text style={{textAlign: 'center', color: "#FDBA1C", fontSize: 25, fontWeight: "bold"}}>How</Text>
              <Text style={{textAlign: 'center', color: "#F6841F", fontSize: 25, fontWeight: "bold"}}> can we help you?</Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          <View style={{alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 12}}>Email us with any of your inquiries or contact us with the contact information provided below. We will
                  gladly discuss with you the best possible solution to your needs.</Text>
          </View>

          <View style={{height: 15}} />
          <View style={{backgroundColor: "#F7F7FA", height: 2}} />
          <View style={{height: 15}} />

          <View style={{flexDirection: 'row', paddingBottom: 8}}>
            <View style={{flex: 0.25, justifyContent: 'center' }}>
              <CustomIcon.FeIcon name="phone" size={16} color={COLOR.ORANGE} />
            </View>
            <View style={{flex: 3, justifyContent: 'center' }}>
              <Text style={{color: "#525252", fontSize: 12}}>(632) 8424 8617</Text>
            </View>
          </View>
          
          <View style={{flexDirection: 'row', paddingBottom: 8}}>
            <View style={{flex: 0.25, justifyContent: 'center' }}>
              <CustomIcon.FeIcon name="mail" size={16} color={COLOR.ORANGE} />
            </View>
            <View style={{flex: 3, justifyContent: 'center' }}>
              <Text style={{color: "#525252", fontSize: 12}}>mail@toktok.ph</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', paddingBottom: 8}}>
            <View style={{flex: 0.25, justifyContent: 'center' }}>
              <CustomIcon.MCIcon name="web" size={16} color={COLOR.ORANGE} />
            </View>
            <View style={{flex: 3, justifyContent: 'center' }}>
              <Text style={{color: "#525252", fontSize: 12}}>www.toktokmall.ph</Text>
            </View>
          </View>

          <View style={{height: 8}} />

          <Card>
            <View style={{flex: 0, padding: 15}}>

              <View
                style={{
                  flex: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                </View>
                <View>
                  <Text style={{fontSize: 11, color: "#9E9E9E"}}>Message</Text>
                </View>
                  <TextInput 
                    style={[styles.textinputLastContainer]} 
                    multiline
                    value = {message}
                    onChangeText = {(text) => {setMessage(text)}}
                    maxLength={300}
                  />
                </View>
              <View
                style={{flex: 0, marginTop: 18, alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                <TouchableOpacity disabled = {message.length > 300} onPress = {() => {onPress()}} style={message.length > 300 ?styles.disabled :styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
              <View style={{height: 30}} />
            </View>
        </Card>
      </View>
      </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textinputContainer: {
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    padding: Platform.OS === 'ios' ? 30 : 0,
    borderRadius: 5,
    justifyContent: 'flex-start',
  },
  textinput: {width: '100%', marginLeft: 10},
  textinputLastContainer: {
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 5,
    justifyContent: 'flex-start',
    height: 150,
  },
  button: {
    backgroundColor: '#F6841F',
    padding: 10,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: 'white', fontSize: 14},
  disabled: {
    backgroundColor: 'grey',
    padding: 10,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
