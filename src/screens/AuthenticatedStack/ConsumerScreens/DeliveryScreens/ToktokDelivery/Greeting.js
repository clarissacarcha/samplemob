import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {FONT_REGULAR} from '../../../../../res/constants';
import {FONT, COLOR} from '../../../../../res/variables';

const Greeting = ({session}) => {
  return (
    <View style={styles.greetingBox}>
      <View>
        <Text style={{fontSize: 17, marginBottom: 5, fontFamily: FONT.BOLD}}>
          Hello, <Text style={{color: COLOR.YELLOW, fontSize: 17}}>{session.user.person.firstName}</Text>!
        </Text>
        <Text style={{fontSize: 13, fontFamily: FONT.BOLD, color: COLOR.MEDIUM}}>
          Basta may ipapadala, ipa-toktok mo na yan!
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(Greeting);

const styles = StyleSheet.create({
  greetingBox: {
    height: 50,
    justifyContent: 'center',
    marginVertical: 10,
  },
  greetingText: {
    fontSize: 40,
    fontFamily: FONT_REGULAR,
  },
});
