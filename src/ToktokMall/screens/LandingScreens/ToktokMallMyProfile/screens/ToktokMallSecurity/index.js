import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {HeaderBack, HeaderTitle, HeaderRight, Card} from '../../../../../Components';
import CustomIcon from '../../../../../Components/Icons';
import {AlertOverlay} from '../../../../../../components';
import {COLOR, FONT, FONT_SIZE} from '../../../../../../res/variables';
import { WebView } from 'react-native-webview'

export const ToktokMallSecurity = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Security and Privacy', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
      <ScrollView> 
        <View style={styles.container}>
          <Text style = {styles.title}>ACCOUNT AND DATA PRIVACY</Text>
          <Text style = {styles.text}>
          Use of the Platform may require registration and the creation of an account. The user shall provide a unique username and password. 
          Cloud Panda has the right to deny registration for the use of offensive or inappropriate usernames. agents, affiliates, lawyers, subsidiaries,
           and third party in order to conduct activities, such as, but not limited to:  
          {'\n'}{'\n'}You agree to safeguard your username and password. Cloud Panda shall not be liable for 
          any damages arising from the use and access of your account. 
          {'\n'}{'\n'}As a condition for use of the Platform, the user consents, agrees and permits Cloud Panda, including its subsidiaries, 
          affiliates, lawyers, consultants and authorized subcontractors to process or disclose personal data,  including data that may be 
          classified as personal information and/or sensitive personal information under the Data Privacy Act of 2012 to Cloud Panda’s employees, 
          agents, affiliates, lawyers, subsidiaries, and third party in order to conduct activities, such as, but not limited to:
          </Text>
          <Text style = {styles.indented}>
          {'\n'}a)	Processing and conducting analysis for research purposes
          {'\n'}{'\n'}b)	Provision of customer care showing of relevant ads based on the user’s preference
          {'\n'}{'\n'}c)	Conduct of statistical analysis based on the user’s usage and preference
          {'\n'}{'\n'}d)	Other than as described in these Terms and Conditions, we will not give any  
          information about you to others without your express permission.
          </Text>
          <Text style = {styles.text}>
          The Platform uses forms in which you give us contact information (including your name, address, telephone number, and email address) 
          so you can use the application, request information and support, and make product suggestions.
          For certain services, we may also request a government identification number, or other financial information. 
          We will then create an account for you. 
          {'\n'}{'\n'}We receive and store any information you enter on our platform or give us in any other way, including through email, telephone, 
          or other communications with our customer service department. 
          If you contact us for support, we will keep an internal record of what support was given.
          {'\n'}{'\n'}We use your information to contact you regarding functionality changes to our products, services, and special offers we think you'll find valuable.
          {'\n'}{'\n'}Cloud Panda shall maintain and keep the user’s information with due diligence and strict confidence.
          </Text>
          <Text style = {styles.title}>{'\n'}DATA COLLECTED</Text>
          <Text style = {styles.text}>
          In the course of accessing and using toktokmall, Cloud Panda may collect the following data:
          </Text>
          <Text style = {styles.indented}>
          {'\n'}a.)	Personal data, such as your name, gender, age, legal status, citizenship and birthday;
          {'\n'}{'\n'}b.)	Contact data, such as billing address, shipping address, email address, and phone numbers;
          {'\n'}{'\n'}c.)	Payment data, such as debit card details, bank details, online wallet details, and credit card details;
          {'\n'}{'\n'}d.)	Transaction data, such as orders and item inventory;
          {'\n'}{'\n'}e.)	Internet protocol (IP) address, operating system and platform, international mobile equipment identity, device identifier, IMEI, MAC address, cookies (where applicable) and other information and technology on the devices you use to access toktokmalll;
          {'\n'}{'\n'}f.)	Time and location data;
          {'\n'}{'\n'}g.)	Your preferences based on your recent transactions;

          </Text>
          <Text style = {styles.title}>{'\n'}USE OF THE INFORMATION</Text>
          <Text style = {styles.text}>
          Cloud Panda may use the information you provided for one or more of the following purposes:
          </Text>
          <Text style = {styles.indented}>
          {'\n'}a.)	Processing of your account and application;
          {'\n'}{'\n'}b.)	Managing and control of your use and access to the site;
          {'\n'}{'\n'}c.)	Enforcement of the terms of use, as well as the conditions of your transaction within the platform;
          {'\n'}{'\n'}d.)	Updating of your profile, preferences, and setting;
          {'\n'}{'\n'}e.)	For identification and communication purposes;
          {'\n'}{'\n'}f.)	Processing, update, and recording of your past and present orders;
          {'\n'}{'\n'}g.)	To verify your identity and for background checks;
          {'\n'}{'\n'}h.)	To store and back up your personal data
          {'\n'}{'\n'}i.)	Any other purposes which we notify you of at the time of obtaining your consent;
          </Text>
          <Text style = {styles.title}>{'\n'}WITHDRAWAL OF CONSENT (TO THE USE AND PROCESSING OF PERSONAL DATA)</Text>
          <Text style = {styles.text}>
          You may withdraw your consent for the collection, processing, storing, use and/or disclosure of your 
          personal data by contacting us or by sending a message or email through our help channels.
          </Text>
          <Text style = {styles.title}>{'\n'}UPDATE/CORRECTION OF DATA</Text>
          <Text style = {styles.text}>
          You may request to update or the correction of your entries in your personal data currently in our control and possession by 
          submitting a written request through our help channels. You may also request correction or deletion of any entry in your personal data for 
          the reason that it is wrong or erroneous. In order to facilitate your request, it may be necessary for us to request further 
          information relating to your request. 
          Cloud Panda reserves the right to refuse the correction of personal data in accordance with the provisions as set out in our local laws.
          </Text>
          <Text style = {styles.title}>{'\n'}COOKIES AND USAGE DATA</Text>
          <Text style = {styles.text}>
          Usage Data. We may collect information on how the Service is accessed and used ("Usage Data"). 
          This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser 
          type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, 
          unique device identifiers and other diagnostic data.
          </Text>
          <Text style = {styles.title}>{'\n'}TRACKING AND USAGE DATA</Text>
          <Text style = {styles.text}>
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
          {'\n'}{'\n'}Cookies are files with small amount of data which may include an anonymous unique identifier. 
          Cookies are sent to your browser from a website and stored on your device.
          Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
          {'\n'}{'\n'}You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
          However, if you do not accept cookies, you may not be able to use some portions of our Service.
          Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
          {'\n'}{'\n'}Examples of Cookies we use: Session Cookies. We use Session Cookies to operate our Service. Preference Cookies. 
          We use Preference Cookies to remember your preferences and various settings. Security Cookies. We use Security Cookies for security purposes.
          </Text>
          <Text style = {styles.title}>{'\n'}SECURITY OF DATA</Text>
          <Text style = {styles.text}>
          The security of your data is important to us, but remember that no method of transmission over the Internet, 
          or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
          your Personal Data, we cannot guarantee its absolute security.
          </Text>
          <Text style = {styles.title}>{'\n'}SERVICE PROVIDERS</Text>
          <Text style = {styles.text}>
          We may employ third party companies and individuals to facilitate our Service ("Service Providers"), 
          to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
          {'\n'}{'\n'}These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not 
          to disclose or use it for any other purpose.
          </Text>
          <Text style = {styles.title}>{'\n'}CHILDREN’S PRIVACY</Text>
          <Text style = {styles.text}>
          Our Service does not address anyone under the age of 18 ("Children").
          {'\n'}{'\n'}We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or 
          guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected 
          Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
          </Text>
          <Text style = {styles.title}>{'\n'}AMENDMENTS</Text>
          <Text style = {styles.text}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          {'\n'}{'\n'}You are advised to review this Privacy Policy periodically for any changes. 
          Changes to this Privacy Policy are effective when they are posted on this page.
          </Text>
        </View>
        
    </ScrollView>
     
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    padding: 20
  },
  text: {
    textAlign: 'justify', fontFamily: FONT.REGULAR, letterSpacing:0.5, marginTop: 10, fontSize: 14
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: 16
  },
  indented: {textAlign: 'justify', fontFamily: FONT.REGULAR, letterSpacing:0.5, fontSize: 14, paddingLeft: 15, paddingRight: 15},
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
