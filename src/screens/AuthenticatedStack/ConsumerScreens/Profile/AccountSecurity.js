import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {COLOR, FONT, FONT_SIZE, SIZE} from '../../../../res/variables';
import RightArrow from '../../../../assets/icons/profileMenu-arrow-rightIcon.png';
import {useSelector} from 'react-redux';

const AccountSecurity = ({navigation}) => {
  const session = useSelector(state => state.session);
  const constants = useSelector(state => state.constants);
  const userName = session.user.username;

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Account', 'Security']} />,
  });

  const DrawerButton = ({label, onPress, restrict}) => {
    if (restrict && restrict != APP_FLAVOR) {
      return null;
    }

    return (
      <TouchableHighlight onPress={onPress} underlayColor={COLOR.WHITE_UNDERLAY} style={styles.submitBox}>
        <View style={styles.submit}>
          <Text style={styles.headerText}>{label}</Text>
          {/* <VectorIcon
            iconSet={ICON_SET.Entypo}
            name="chevron-thin-right"
            color={COLOR.BLACK}
            size={16}
            style={{marginRight: 2}}
          /> */}
          <Image source={RightArrow} style={{color: 'red', height: 12, width: 15}} resizeMode={'contain'} />
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <DrawerButton
          label="Change Password"
          onPress={() => {
            navigation.push('EnterPassword', {userName});
          }}
        />
        {constants.showAccountDeletion == 1 && (
          <DrawerButton
            label="Account Deletion"
            onPress={() => {
              navigation.push('AccountDeletion');
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default AccountSecurity;

const styles = StyleSheet.create({
  submitBox: {
    marginHorizontal: 13,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT,
  },
  submit: {
    backgroundColor: COLOR.WHITE,
    // height: 50,
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: SIZE.MARGIN / 2,
  },

  headerText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    lineHeight: FONT_SIZE.L,
  },
});
