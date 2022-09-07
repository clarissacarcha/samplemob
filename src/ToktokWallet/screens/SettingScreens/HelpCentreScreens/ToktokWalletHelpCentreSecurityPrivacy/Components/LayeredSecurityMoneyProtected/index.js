import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {CheckIdleState} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

const ListItem = props => {
  return (
    <>
      <View style={{flex: 1, flexDirection: 'row', paddingVertical: 10}}>
        <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Image
            style={{
              right: props.title == 'Data encryption' ? -2 : 0,
              resizeMode: props.resizeMode || 'contain',
              width: '100%',
              height: 35,
            }}
            source={props.imageSource ? props.imageSource : require('toktokwallet/assets/icons/magnifying.png')}
          />
        </View>
        <View style={{flex: 4, paddingHorizontal: 18}}>
          <Text style={styles.textTitle}>{props.title}</Text>
          <Text style={styles.textContent}>{props.content}</Text>
        </View>
      </View>
    </>
  );
};

export const LayeredSecurityMoneyProtected = () => {
  return (
    <CheckIdleState>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, backgroundColor: COLOR.WHITE}}>
            <View style={{flex: 1, paddingHorizontal: 16, marginTop: 25}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Layered Security</Text>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, marginVertical: 10}}>
                Toktokwallet has its multi-layered security features that prevent threats intrusions, keeping your
                personal information and transaction details safe and protected.
              </Text>
              <View style={{flex: 1, marginBottom: 10}}>
                {[
                  {
                    title: 'Fraud Prevention',
                    content: 'Your account transactions are protected 24/7 by a Fraud Detection Engine.',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/shield.png'),
                    resizeMode: 'contain',
                  },
                  {
                    title: 'OTP/TPIN for Online Transactions',
                    content:
                      'For safer and secure online transactions, toktokwallet integrates security features such as a One-time Password (OTP) for validation and authentication of every e-money transaction.',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/phone.png'),
                    resizeMode: 'contain',
                  },
                  {
                    title: 'Instant Payment Alerts',
                    content:
                      'SMS, Push Notifications, and Emails are sent out as a receipt of confirmation to every transaction.',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/bell.png'),
                    resizeMode: 'contain',
                  },
                  {
                    title: 'Data Encryption',
                    content: 'All data are encrypted to keep information protected and secure.',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/data.png'),
                    resizeMode: 'contain',
                  },
                  {
                    title: 'Data Privacy',
                    content:
                      'Your provided personal information is kept in a database where accessing, use for external gain, and sharing is not allowed except for the agreed purposes only such as online transactions where personal information is needed.',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/privacy_new.png'),
                    resizeMode: 'contain',
                  },
                ].map((data, i) => (
                  <ListItem
                    title={data.title}
                    content={data.content}
                    imageSource={data.imageSource}
                    resizeMode={data.resizeMode}
                  />
                ))}
              </View>
            </View>
            <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8}}>
              <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.M}}>Money Protection</Text>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, marginTop: 15}}>
                All transactions via toktokwallet are successfully completed through One-time Password (OTP) and
                Transaction PIN. These added an extra layer of security that prevents others from compromising your
                toktokwallet account and the money that is stored in it.
              </Text>
              <View style={{flex: 1, marginTop: 12, marginBottom: 10}}>
                {[
                  {
                    title: 'Regulated by the local monetary authority',
                    content: 'Toktokwallet is regulated by Bangko Sentral ng Pilipinas (BSP).',
                    imageSource: require('toktokwallet/assets/images/SecurityAndPrivacy/bank.png'),
                    resizeMode: 'contain',
                  },
                ].map((data, i) => (
                  <ListItem
                    title={data.title}
                    content={data.content}
                    imageSource={data.imageSource}
                    resizeMode={data.resizeMode}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </CheckIdleState>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  textTitle: {
    fontFamily: FONT.REGULAR,
    fontWeight: 'bold',
    fontSize: 12.5,
    color: '#F6841F',
  },
  textContent: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.S,
  },
});
