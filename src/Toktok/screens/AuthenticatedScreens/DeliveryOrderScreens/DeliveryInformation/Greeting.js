import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {FONT_SIZE_LARGE, COLOR} from '../../../../../res/constants';

const Greeting = ({session}) => {
  return (
    <View style={styles.greetingBox}>
      <View>
        {/* <Text style={{fontSize: 18, marginBottom: 5}}>Delivery Details</Text> */}
        <Text style={{fontSize: 14}}>Please fill out the required fields.</Text>
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
    // marginVertical: 10,
  },
  greetingText: {
    fontSize: 40,
  },
});
