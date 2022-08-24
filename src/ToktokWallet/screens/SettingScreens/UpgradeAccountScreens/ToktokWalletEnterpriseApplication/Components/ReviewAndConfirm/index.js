import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions, Image} from 'react-native';
import {ContextEnterpriseApplication} from '../ContextProvider';
import CheckBox from 'react-native-check-box';

import {useMutation} from '@apollo/react-hooks';
import {useAlert} from 'src/hooks/useAlert';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {AlertOverlay} from 'src/components';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {connect} from 'react-redux';

import {TransactionUtility} from 'toktokwallet/util';
import {usePrompt} from 'src/hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_ENTERPRISE_UPGRADE_REQUEST} from 'toktokwallet/graphql';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

//COMPONENTS
import {PreviousNextButton} from 'toktokwallet/components';

//UTIL
import {moderateScale} from 'toktokwallet/helper';
const {width, height} = Dimensions.get('window');

const CROP_AREA_WIDTH = width * 0.9;
const CROP_AREA_HEIGHT = CROP_AREA_WIDTH + 50;

const UserInfo = ({label, value}) => {
  return (
    <View style={{paddingVertical: 10, width: '100%', flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M, textAlign: 'right'}}>{value}</Text>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const ReviewAndConfirm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({session}) => {
  const prompt = usePrompt();
  const navigation = useNavigation();

  const [isCertify, setCertify] = useState(false);
  const {forms, validID1, validID2, setFileError, setValidID1, setValidID2, pepInfo, setCurrentIndex} =
    useContext(ContextEnterpriseApplication);
  const [visible, setVisible] = useState(false);

  const [postEnterpriseUpgradeRequest, {data, error, loading}] = useMutation(POST_ENTERPRISE_UPGRADE_REQUEST, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      console.log(error);
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: ({postEnterpriseUpgradeRequest}) => {
      prompt({
        type: 'success',
        title: 'Business Documents Submitted',
        message: 'Your business documents have been submitted. These documents are for review and approval.',
        event: 'TOKTOKBILLSLOAD',
        onPress: () => {
          navigation.replace('ToktokWalletEnterpriseApplication');
        },
      });
      // return setVisible(true); // Open Successful Modal Prompt
    },
  });

  const Back = async () => {
    setCurrentIndex(oldstate => oldstate - 1);
  };

  const confirm = async () => {
    if (isCertify) {
      const input = {
        businessPermitFile: forms[0].file,
        dtiCrFile: forms[1].file,
        birFile: forms[2].file,
        barangayPermitFile: forms[3].file,
        firstIdentificationCardId: +validID1.IDType,
        firstGovtIdFront: validID1.frontFile,
        firstGovtIdBack: validID1.backFile,
        secondIdentificationCardId: +validID2.IDType,
        secondGovtIdFront: validID2.frontFile,
        secondGovtIdBack: validID2.backFile,
        pepQuestionnaire: {
          isPep: pepInfo.questionnaire.isPep,
          pepPosition: pepInfo.questionnaire.pepPosition,
          isFamilyPep: pepInfo.questionnaire.isFamilyPep,
          familyPepPosition: pepInfo.questionnaire.familyPepPosition,
          sourceOfIncomeId: JSON.stringify(pepInfo.questionnaire.sourceOfIncomeId),
          sourceOfIncome: pepInfo.questionnaire.sourceOfIncome,
          sourceOfWealthId: JSON.stringify(pepInfo.questionnaire.sourceOfWealthId),
          sourceOfWealth: pepInfo.questionnaire.sourceOfWealth,
        },
      };
      postEnterpriseUpgradeRequest({
        variables: {
          input,
        },
      });
    }
  };

  const ViewPrivacyPolicy = () => {
    return Linking.openURL('https://wallet.toktok.ph/privacy-policy');
  };

  return (
    <>
      <AlertOverlay visible={loading} />

      <ScrollView style={styles.mainInput} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={ViewPrivacyPolicy} style={styles.policyView}>
          <View>
            <Image
              style={styles.policyIcon}
              source={require('toktokwallet/assets/icons/walletVerify.png')}
              resizeMode="contain"
            />
          </View>
          <View style={styles.privacyPolicyContainer}>
            <Text style={styles.detailsText}>
              Review all the details provided before clicking "Confirm".{' '}
              <Text style={styles.privacyPolicy}>Privacy Policy.</Text>
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={{fontSize: FONT_SIZE.M, fontFamily: FONT.BOLD, color: '#525252'}}>Review and Confirm</Text>
          <Text style={{fontFamily: FONT.REGULAR, marginBottom: 10, fontSize: FONT_SIZE.M, color: '#525252'}}>
            Review the details that you enter before clicking ‘Confirm’.
          </Text>

          <Text style={styles.titleText}>PEP Information</Text>
          <UserInfo
            label="Have you ever been categorized as PEP (Political Exposed Person) by a bank, brokerage firm or any financial institution?"
            value={
              pepInfo.questionnaire.isPep === '1'
                ? `Yes, ${pepInfo.questionnaire.pepPosition}`
                : pepInfo.questionnaire.isPep === '2'
                ? 'No'
                : "I don't know"
            }
          />
          <UserInfo
            label="Do you have an immediate family member or business/close associate which is currently/formally qualified as PEP?"
            value={
              pepInfo.questionnaire.isFamilyPep === '1'
                ? `Yes, ${pepInfo.questionnaire.familyPepPosition}`
                : pepInfo.questionnaire.isFamilyPep === '2'
                ? 'No'
                : "I don't know"
            }
          />
          <UserInfo label="Source of Income" value={pepInfo.questionnaire.sourceOfIncomeDes.join(', ')} />
          <UserInfo label="Source of Wealth" value={pepInfo.questionnaire.sourceOfWealthDes.join(', ')} />
          <Text style={styles.titleText}>Upload Documents</Text>
          <UserInfo label={forms[0].name} value={forms[0].filename} />
          <UserInfo label={forms[1].name} value={forms[1].filename} />
          <UserInfo label={forms[2].name} value={forms[2].filename} />
          <UserInfo label={forms[3].name} value={forms[3].filename} />
          <Text style={[styles.label, {marginVertical: moderateScale(10)}]}>Valid Government-Issued ID</Text>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <View style={[styles.previewImage]}>
              <Image source={{uri: validID1.frontFile.uri}} style={[styles.imageStyle, {height: moderateScale(50)}]} />
            </View>
            {validID1?.backFile != null && (
              <View style={styles.previewImage}>
                <Image source={{uri: validID1.backFile.uri}} style={[styles.imageStyle, {height: moderateScale(50)}]} />
              </View>
            )}
            <View style={[styles.previewImage]}>
              <Image source={{uri: validID2.frontFile.uri}} style={[styles.imageStyle, {height: moderateScale(50)}]} />
            </View>
            {validID2?.backFile != null && (
              <View style={styles.previewImage}>
                <Image source={{uri: validID2.backFile.uri}} style={[styles.imageStyle, {height: moderateScale(50)}]} />
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginVertical: moderateScale(20),
            }}>
            <CheckBox
              isChecked={isCertify}
              onClick={() => {
                return setCertify(!isCertify);
              }}
              checkBoxColor={COLOR.ORANGE}
            />
            <TouchableOpacity
              // onPress={()=>Linking.openURL("https://toktok.ph/terms-and-conditions")}
              onPress={() => navigation.navigate('ToktokWalletTermsConditions')}
              style={{paddingLeft: 10, flexShrink: 1}}>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
                I hereby certify that the above information is true and correct. I have also read, understood, and
                accepts the{' '}
                <Text style={{color: COLOR.ORANGE, fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
                  Terms and Conditions
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <PreviousNextButton
        label="Previous"
        labelTwo="Confirm"
        onPressNext={confirm}
        onPressPrevious={Back}
        hasShadow
        isPrevious
      />
    </>
  );
});

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flex: 1,
  },
  mainInput: {
    flex: 1,
  },
  proceedBtn: {
    height: 90,
    width: '100%',
    justifyContent: 'flex-end',
    // flexDirection: "row",
  },
  titleText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
    paddingVertical: moderateScale(16),
  },
  input: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'silver',
    marginTop: 20,
  },
  imageStyle: {
    resizeMode: 'cover',
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(5),
  },
  policyView: {
    flexDirection: 'row',
    backgroundColor: '#FFFCF4',
    padding: 16,
    alignItems: 'center',
  },
  policyIcon: {
    height: 21,
    width: 21,
    alignSelf: 'center',
  },
  privacyPolicyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsText: {
    marginHorizontal: moderateScale(10),
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.REGULAR,
    color: COLOR.ORANGE,
  },
  privacyPolicy: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.S,
    fontFamily: FONT.SEMI_BOLD,
    textDecorationLine: 'underline',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  previewImage: {
    height: moderateScale(82),
    width: moderateScale(82),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: COLOR.ORANGE,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    marginRight: moderateScale(5),
  },
  label: {
    fontFamily: FONT.SEMI_BOLD,
    fontSize: FONT_SIZE.M,
    color: '#525252',
    textAlign: 'left',
  },
});
