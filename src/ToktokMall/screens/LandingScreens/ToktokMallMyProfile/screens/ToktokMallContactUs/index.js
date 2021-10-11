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
      {cc: '', }
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
        <View style = {{alignItems: 'center', justifyContent: 'center',}}>
          <Image 
            source = {require('../../../../../assets/images/contact-us-img.png')}
            style = {{height: 100, width: 135}}
          />
          <Image 
            source = {require('../../../../../assets/images/contact-us-text.png')}
          />
          <Text style={{fontSize: 12, textAlign: 'center', marginTop: 10, marginBottom: 10}}>
            Email us with any of your inquiries or contact us with the contact information provided below. We will
            gladly discuss with you the best possible solution to your needs.
          </Text>
        </View>
        <View style = {{borderBottomColor:  "#F7F7FA", borderBottomWidth: 3, padding: 1}} />
        <View style={{ flexDirection: 'row' , marginTop: 15}}>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 15 }}>
            <CustomIcon.FeIcon name="phone" size={18} color={COLOR.ORANGE} />
          </View>
          <View  style={{ justifyContent: 'center',  alignItems: 'flex-end', }}>
            <Text>(02) 84-248-617</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 15}}>
            <CustomIcon.FeIcon name="mail" size={18} color={COLOR.ORANGE} />
          </View>
          <View  style={{ justifyContent: 'center',  alignItems: 'flex-end', }}>
            <Text>mall@toktok.ph</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end',marginRight: 15  }}>
            <CustomIcon.FoIcon name="world-o" size={18} color={COLOR.ORANGE} />
          </View>
          <View  style={{ justifyContent: 'center',  alignItems: 'flex-end', marginBottom: 15 }}>
            <Text>www.toktokmall.ph</Text>
          </View>
        </View>
        <Card>
          <View style = {{padding: 15}}>
            
            <Text style = {{fontSize: 12, color: '#9E9E9E'}}>Message</Text>
            <View style={styles.textinputLastContainer}>
              <TextInput style={styles.textinput} 
                value = {message}
                onChangeText = {(text) => {setMessage(text)}}
              />
            </View>
          </View>
          <View
                style={{flex: 0, marginTop: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginBottom: 15}}>
                <TouchableOpacity onPress = {() => {onPress()}} style={styles.button}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15
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
    height: 150,
  },
  button: {
    backgroundColor: '#F6841F',
    padding: 10,
    width: '93%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: 'white', fontSize: 14},
});
