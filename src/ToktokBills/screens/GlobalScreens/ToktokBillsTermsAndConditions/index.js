import React from 'react';
import {Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';

// Components
import {HeaderBack, HeaderTitle, Separator} from 'toktokbills/components';
import {ListContent, SectionContent} from './components';

// Helpers
import {moderateScale, verticalScale, termsAndConditionsDetails} from 'toktokbills/helper';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

export const ToktokBillsTermsAndConditions = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={'Terms and Conditions'} />,
  });

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Terms and Conditions</Text> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_1} />
          <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_2} />
          <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_3} />
          <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_4} />
          <SectionContent contents={termsAndConditionsDetails.WM_PARAGRAPH_5} />
          <ListContent contents={termsAndConditionsDetails.DEFINITION_OF_TERMS} />
          <ListContent contents={termsAndConditionsDetails.ACCESS_TO_TOKTOKLOAD} />
          <ListContent contents={termsAndConditionsDetails.REGISTRATION} />
          <ListContent contents={termsAndConditionsDetails.OTHER_TERMS} />
          <ListContent contents={termsAndConditionsDetails.OBLIGATIONS_OF_THE_USER} />
          <ListContent contents={termsAndConditionsDetails.SERVICES} />
          <SectionContent contents={termsAndConditionsDetails.LIMITS} />
          <ListContent contents={termsAndConditionsDetails.FEES_AND_OTHER_CHARGES} />
          <SectionContent contents={termsAndConditionsDetails.TRANSACTION_HISTORY} />
          <ListContent contents={termsAndConditionsDetails.DISPUTE_AND_UNAUTHORIZED_TRANSACTIONS} />
          <ListContent contents={termsAndConditionsDetails.USERS_ACCOUNTABILITY} />
          <ListContent contents={termsAndConditionsDetails.PERSONAL_IDENTIFICATION_NUMBER} />
          <ListContent contents={termsAndConditionsDetails.TERMINATION_AND_SUSPENSION_OF_ACCOUNT} />
          <ListContent contents={termsAndConditionsDetails.LIMITATION_OF_LIABILITY} />
          <ListContent contents={termsAndConditionsDetails.DATA_PRIVACY_POLICY_AND_INFORMATION_COLLECTION} />
          <ListContent contents={termsAndConditionsDetails.DATA_SHARING} />
          <SectionContent contents={termsAndConditionsDetails.SECURITY} />
          <SectionContent contents={termsAndConditionsDetails.PUBLICITY} />
          <ListContent contents={termsAndConditionsDetails.GOVERNING_LAW} />
          <SectionContent contents={termsAndConditionsDetails.VENUE} />
          <SectionContent contents={termsAndConditionsDetails.NON_WAIVER_OF_RIGHTS} />
          <SectionContent contents={termsAndConditionsDetails.SEVERABILITY} />
          <SectionContent contents={termsAndConditionsDetails.AMENDMENT} />
          <ListContent contents={termsAndConditionsDetails.AGREEMENT} />
          <ListContent contents={termsAndConditionsDetails.CUSTOMER_CARE} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  shadow: {
    margin: 16,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    color: '#F6841F',
    fontFamily: FONT.BOLD,
    fontSize: 20,
    paddingVertical: 10,
  },
  contentWrapper: {
    flex: 1,
    margin: 6,
    paddingBottom: verticalScale(10),
  },
  tnc: {
    textAlign: 'center',
    fontSize: FONT_SIZE.M,
  },
});
