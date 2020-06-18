import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {MEDIUM, COLOR, LIGHT} from '../../res/constants';

export const DataRow = ({header, body, rightContent}) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View>
          <Text style={styles.header}>{header}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
        <View>
          {rightContent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: MEDIUM,
    paddingVertical: 5,
  },
  header: {
    color: MEDIUM,
  },
  body: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
});
