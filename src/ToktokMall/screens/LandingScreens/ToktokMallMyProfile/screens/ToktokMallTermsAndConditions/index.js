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

export const ToktokMallTermsAndConditions = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Terms and Conditions', '']} />,
    headerRight: () => <HeaderRight hidden={true} />,
  });

  return (
    <>
      <ScrollView> 
        <View style={styles.container}>
          <Text style = {styles.title}>GENERAL TERMS</Text>
          <Text style = {styles.text}>
          These Terms and Conditions govern your use of our platform Toktok Mall (the “Platform”), an online shopping platform operated 
          by Cloud Panda PH Inc. (Cloud Panda). Please read these Terms and Conditions carefully before using the platform 
          so that you are aware of your rights and obligations with respect to Cloud Panda, including its affiliates and subsidiaries 
          {'\n'}{'\n'}By accessing or using the Platform, you agree to be bound by these Terms.  These Terms govern your use and access of Toktok Mall. 
          These Terms apply to all visitors, users and others who access or use the Platform. 
          {'\n'}{'\n'}The actual contract of sale is directly between the user and our Partner merchants. 
          Cloud Panda is not a party to that or any other contract between the aforementioned parties. As such, 
          it has no obligations in connection with any such contract. Parties to the transaction will be
          entirely responsible for the sales contract between them, the listing of goods, returns, refund, warranty of purchase and the like.
          {'\n'}{'\n'}Cloud Panda PH Inc., reserves the right to modify these Terms and 
          Conditions without prior notice. Any changes hereto will be effective immediately upon posting. 
          Continuous access or use of this Platform after any modifications have been made, signifies your consent to the changes.
          {'\n'}{'\n'}You agree that you will have no claim against Cloud Panda PH Inc, 
          for any statement which is not explicitly set out in these Terms. In the event that any of 
          the provisions of these Terms are deemed invalid or invalidated subsequently by any rules or regulations, 
          the remaining provisions will not be affected, and the validity or enforceability of any other provision (or the remaining parts of that provision) 
          will remain. If a court holds that we cannot enforce any part of these Terms as drafted, we may replace those terms with similar 
          terms to the extent enforceable under applicable laws and regulations, without changing the remaining terms of these Terms. 
          No delay in enforcing any provision of these Terms will be construed to be a waiver of any rights under that provision.
          {'\n'}{'\n'}Cloud Panda reserves the right to refuse access to the Platform for whatever reason.
          </Text>
          <Text style = {styles.indented}>
          {'\n'}a)	Processing and conducting analysis for research purposes
          {'\n'}{'\n'}b)	Provision of customer care showing of relevant ads based on the user’s preference
          {'\n'}{'\n'}c)	Conduct of statistical analysis based on the user’s usage and preference
          {'\n'}{'\n'}d)	Other than as described in these Terms and Conditions, we will not give any  
          information about you to others without your express permission.
          </Text>
  
          <Text style = {styles.title}>{'\n'}PAYMENT</Text>
          <Text style = {styles.text}>
          The Platform supports the following modes of payment:
          {'\n'}{'\n'}Credit Card
          {'\n'}{'\n'}PayPanda
          {'\n'}{'\n'}Bank Transfer/Over the Counter
          </Text>

          <Text style = {styles.title}>{'\n'}DELIVERY</Text>
          <Text style = {styles.text}>
          The delivery of your orders shall be made to the address specified in your account or order, by the seller’s choice of courier service. 
          You may track the status of the delivery by accessing the Platform.
          {'\n'}{'\n'}The delivery of your order is subject to its availability. 
          Our Partner seller will make every reasonable effort to deliver your order within the timeframe stated on the relevant page. 
          Timeframes given are estimates only and delays can occur. If delivery is delayed, the partner seller will inform you accordingly via e-mail, 
          and your order will be  dispatched as soon as possible. 
          Delivery is borne solely by the Partner seller. Cloud Panda will not be responsible or liable for any delays.
          {'\n'}{'\n'}If you fail to receive the delivery of your order, without fault from the seller, the Seller may terminate the Customer Contract.
          </Text>
          
          <Text style = {styles.title}>{'\n'}RETURNS</Text>
          <Text style = {styles.text}>
          Returns, refunds or exchanges shall be settled by you, the user, and the Partner seller. Please check their rules on returns. 
          </Text>
          <Text style = {styles.title}>{'\n'}DISPUTES</Text>
          <Text style = {styles.text}>Disputes relating to any transaction conducted on the Platform shall be resolved by you and the seller. 
          The user agrees that no suit or claim shall be asserted against Cloud Panda. 
          </Text>
          <Text style = {styles.title}>{'\n'}INTELLECTUAL PROPERTY</Text>
          <Text style = {styles.text}>
          The Platform and its original content, features and functionality are and will remain the exclusive property of Cloud Panda.  
          and its licensors. The Platform is protected by copyright, trademark, and other laws of both the Philippines and foreign countries. 
          Our trademarks and trade name may not be used in connection with any product or service without the prior written consent of Cloud Panda.
          Restricted or unauthorized use are included, but not limited to, the following:
          {'\n'}{'\n'}Republishing the Service material;
          {'\n'}{'\n'}Reproducing, duplicating, or copying the Service material;
          {'\n'}{'\n'}Selling, sublicensing and/or otherwise commercializing any Service material;
          {'\n'}{'\n'}Using the website in any way that is or may be damaging to the Service;
          {'\n'}{'\n'}Using the website in any way that negatively impacts user access to the Service;
          {'\n'}{'\n'}Using the website contrary to applicable laws and regulations, or in any way may cause harm to the Service, or to any person or business entity;
          </Text>
          <Text style = {styles.title}>{'\n'}WARRANTIES ON THE USE OF PLATFORM</Text>
          <Text style = {styles.text}>
          You, as the user, warrants that you are of legal age. In case that you are a minor, you warrant that you have parental (or guardian) consent.
          {'\n'}{'\n'}You further warrant that any activities undertaken on the use of this Platform is in accordance with the Terms and Conditions, 
          as well as all rules, laws, and regulations of the Philippines. 
          </Text>
          <Text style = {styles.title}>{'\n'}LINKS TO OTHER WEBSITES</Text>
          <Text style = {styles.text}>
          Our Service may contain links to third-party web sites or services that are not owned or controlled by Cloud Panda.
          {'\n'}{'\n'}Cloud Panda.  has no control over, and assumes no responsibility for, the content, privacy policies, 
          or practices of any third party web sites or services. You further acknowledge and agree that Cloud Panda shall not be responsible or liable, 
          directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or 
          reliance on any such content, goods or services available on or through any such web sites or services.
          {'\n'}{'\n'}We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit
          </Text>
          <Text style = {styles.title}>{'\n'}TERMINATION</Text>
          <Text style = {styles.text}>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without 
          limitation if you breach the Terms.
          {'\n'}{'\n'}Upon termination, your right to use the Platform will immediately cease. If you wish to terminate your account, 
          you may simply discontinue using the Platform. 
          </Text>
          <Text style = {styles.title}>{'\n'}LIMITATION OF LIABILITY</Text>
          <Text style = {styles.text}>
          In no event shall Cloud Panda nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
          incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
          intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content 
          of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your 
          transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we 
          have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose. 
          </Text>
          <Text style = {styles.title}>{'\n'}SEVERABILITY</Text>
          <Text style = {styles.text}>
          If any provision of this Agreement, or the application thereof to any Party hereto, is held illegal, null, void, unenforceable or otherwise 
          invalid by any law, decree ordinance or judicial or administrative decision, such holding shall not affect the other provisions of this Agreement 
          which can be given effect without the invalid provision and to this end the Parties agree that the provisions of this Agreement are and shall be 
          severable, provided that if such invalidation affects any other provision deemed essential by any Party to the satisfactory performance of this Agreement 
          then, upon  written notice being given by such Party to the other, the Parties shall promptly negotiate in good faith to the end that this Agreement may be 
          amended in such manner as may be deemed necessary to make it fair and equitable to both Parties.
          </Text>
          <Text style = {styles.title}>{'\n'}GOVERNING LAW</Text>
          <Text style = {styles.text}>
          Any dispute or claim arising out of or in connection with the use of this Platform, shall be governed by, 
          and construed in accordance with the laws of the Philippines.
          </Text>
          <Text style = {styles.title}>{'\n'}CONTACT US</Text>
          <Text style = {styles.text}>
          Your queries, suggestions, and feedback are important to us. 
          If you have any questions or concerns regarding our online platform and its use, you may contact _______________________.
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
