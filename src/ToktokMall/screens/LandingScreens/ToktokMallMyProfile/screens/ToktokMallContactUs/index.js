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

import { useSelector } from 'react-redux';

export const ToktokMallContactUs = ({navigation}) => {
  
  const session = useSelector(state => state.session)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [message, setMessage] = useState('')

  const [postInquiry, {loading}] = useMutation(POST_CONTACT_SUPPORT, {
    client: TOKTOK_MALL_GRAPHQL_CLIENT,
    onCompleted: ({postContactSupport}) => {
      if(postContactSupport.success == 1){
        setMessageModalShown(true)
      }else{
        ToastAndroid.show("Something went wrong.")
      }
    },
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
  });

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
    sendEmail(
      message,
      '',
      {cc: 'sample text', }
    ).then(() => {
      console.log('Your message was successfully sent')
    })
  }

  const onPress = async () => {

    let user = session.user.person

    if(session){
      if(message == ""){
        Toast.show("Enter message to send.")
      }else{
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
              <Text style={{textAlign: 'center', color: "#FDBA1C", fontSize: 25, fontWeight: FONT.BOLD}}>How</Text>
              <Text style={{textAlign: 'center', color: "#F6841F", fontSize: 25, fontWeight: FONT.BOLD}}> can we help you?</Text>
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
              {/* <View
                style={{
                  flex: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: FONT.BOLD,
                    color: COLOR.ORANGE,
                  }}>
                  Contact Us
                </Text>
              </View>
              <View
                style={{
                  flex: 0,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                }}>
                <Text style={{fontSize: 12}}>
                  Email us with any of your inquiries or contact us with the contact information provided below. We will
                  gladly discuss with you the best possible solution to your needs.
                </Text>
              </View> */}

              <View
                style={{
                  flex: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  {/* <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginLeft: 15,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                      <CustomIcon.FeIcon name="phone" size={25} color={COLOR.ORANGE} />
                    </View>
                    <View
                      style={{
                        flex: 3,
                        justifyContent: 'center',
                      }}>
                      <Text>(632) 8424 8617</Text>
                    </View>
                  </View> */}
                  {/* <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginRight: 15,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <CustomIcon.FeIcon name="mail" size={25} color={COLOR.ORANGE} />
                    </View>
                    <View
                      style={{
                        flex: 4,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Text>mall@toktok.ph</Text>
                    </View>
                  </View> */}
                </View>
                {/* <View style={styles.textinputContainer}>
                  <TextInput
                    style={styles.textinput}
                    placeholder={'Name'}
                    // onChangeText ={(text) => {setlandmark(text)}}
                  />
                </View>
                <View style={styles.textinputContainer}>
                  <TextInput
                    style={styles.textinput}
                    placeholder={'Email'}
                    // onChangeText ={(text) => {setlandmark(text)}}
                  />
                </View> */}
                <View>
                  <Text style={{fontSize: 11, color: "#9E9E9E"}}>Message</Text>
                </View>
                <View style={styles.textinputLastContainer}>
                  <TextInput 
                    style={styles.textinput} 
                    // placeholder={'Message'} 
                    multiline={true}
                    value = {message}
                    onChangeText = {(text) => {setMessage(text)}}
                  />
                </View>
              </View>
              <View
                style={{flex: 0, marginTop: 18, alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                <TouchableOpacity onPress = {() => {onPress()}} style={styles.button}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={{height: 120}}></View> */}
            </View>
          </Card>
        </View>
      </View>
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
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 5,
    justifyContent: 'flex-start',
  },
  textinput: {width: '100%', marginLeft: 10},
  textinputLastContainer: {
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    borderRadius: 5,
    justifyContent: 'flex-start',
    height: 100,
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
});
