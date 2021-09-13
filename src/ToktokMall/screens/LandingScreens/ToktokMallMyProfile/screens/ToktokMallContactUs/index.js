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
  TextInput, Linking
} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {MessageModal} from '../../../../../Components'
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import * as  qs from 'qs'

export const ToktokMallContactUs = ({navigation}) => {
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [message, setMessage] =useState('')

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

  const onPress = () => {
    sendEmail(
      message,
      '',
      {cc: 'sample text', }
    ).then(() => {
      console.log('Your message was successfully sent')
    })
  }

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Contact Us', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
      <View style={styles.container}>
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
            paddingHorizontal: 15,
          }}>
          <Card>
            <View style={{flex: 0, padding: 15}}>
              <View
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
              </View>

              <View
                style={{
                  flex: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
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
                  </View>
                  <View
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
                  </View>
                </View>
                <View style={styles.textinputContainer}>
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
                </View>
                <View style={styles.textinputLastContainer}>
                  <TextInput style={styles.textinput} placeholder={'Message'} 
                    value = {message}
                    onChangeText = {(text) => {setMessage(text)}}
                  />
                </View>
              </View>
              <View
                style={{flex: 0, marginTop: 18, alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                <TouchableOpacity onPress = {() => {onPress()}} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
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
    backgroundColor: 'transparent',
  },
  textinputContainer: {
    backgroundColor: '#F8F8F8',
    marginTop: 10,
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 5,
    justifyContent: 'flex-start',
  },
  textinput: {marginLeft: 10},
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
    width: '40%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: 'white', fontSize: 14},
});
