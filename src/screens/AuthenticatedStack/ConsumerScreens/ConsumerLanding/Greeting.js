import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {FONT_SIZE_LARGE, FONT_SIZE_SMALL, FONT_REGULAR} from '../../../../res/constants';

const Greeting = ({session}) => {
  return (
    <View style={styles.greetingBox}>
      <Text style={styles.greetingText}>
        Hello, {session.user.person.firstName} {session.user.person.lastName}
      </Text>
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
  },
  greetingText: {
    fontSize: 14,
    fontFamily: FONT_REGULAR,
  },
});
