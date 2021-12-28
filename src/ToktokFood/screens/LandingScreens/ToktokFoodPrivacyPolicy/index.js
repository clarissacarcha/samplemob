import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';
// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';
import Separator from 'toktokfood/components/Separator';
import {getStatusbarHeight, moderateScale, verticalScale} from 'toktokfood/helper/scale';
import {PrivacyPolicy} from 'toktokfood/helper/strings';

const ToktokFoodPrivacyPolicy = ({navigation}) => {
  const SectionContent = (props) => {
    const {contents} = props;
    return (
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>{contents.title}</Text>
        <Text style={styles.sectionText}>{contents.content}</Text>
      </View>
    );
  };

  const ListContent = (props) => {
    const {contents, extented} = props;
    return (
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>{contents.title}</Text>
        <Text style={styles.sectionText}>{contents.content}</Text>
        {typeof contents.listContent !== 'undefined' &&
          contents.listContent.map((v) => (
            <Text style={[styles.sectionText, styles.listTextContent]}>{'● ' + v.content}</Text>
          ))}
        {extented && (
          <Text style={[styles.sectionText, {marginTop: moderateScale(15)}]}>{contents.extentedContent}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => {
            navigation.goBack();
          }}>
          <FIcon5 name="chevron-left" size={15} />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Privacy Policy</Text>
      </View>
      <Separator />
      <View style={[styles.shadow, {flex: 1}]}>
        <Text style={styles.title}>Privacy Policy</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <SectionContent contents={PrivacyPolicy.ACCOUNT_AND_DATA_PRIVACY} />
            <ListContent contents={PrivacyPolicy.DATA_COLLECTED} />
            <ListContent contents={PrivacyPolicy.USE_OF_INFORMATION} />
            <SectionContent contents={PrivacyPolicy.WITHDRAWAL_OF_CONSENT} />
            <SectionContent contents={PrivacyPolicy.CONTACT_US} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ToktokFoodPrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  header: {
    paddingHorizontal: 16,
    alignItems: 'center',
    height: Platform.OS === 'android' ? moderateScale(70) + getStatusbarHeight : moderateScale(70),
    flexDirection: 'row',
    paddingTop: getStatusbarHeight,
  },
  headerLabel: {
    flex: 1,
    color: COLOR.BLACK,
    textAlign: 'center',
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.XL,
    marginRight: 15,
  },
  title: {
    textAlign: 'center',
    color: '#FFA700',
    fontFamily: FONT.BOLD,
    fontSize: 20,
    paddingVertical: 10,
  },
  hitSlop: {
    top: moderateScale(50),
    bottom: moderateScale(50),
    left: moderateScale(50),
    right: moderateScale(50),
  },
  contentWrapper: {
    flex: 1,
    margin: 6,
    paddingBottom: verticalScale(20),
  },
  sectionWrapper: {
    width: '100%',
    marginTop: moderateScale(30),
  },
  sectionTitle: {
    marginBottom: 8,
    fontFamily: FONT.BOLD,
  },
  sectionText: {
    textAlign: 'left',
  },
  listTextContent: {
    marginTop: moderateScale(15),
    marginLeft: moderateScale(18),
  },
});
