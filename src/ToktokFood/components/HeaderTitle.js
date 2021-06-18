import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

const HeaderTitle = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBack}>
        <FIcon5 name="chevron-left" size={15} />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerLabel}>TokTok PH</Text>
        <Text>Home</Text>
      </View>
    </View>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingVertical: 40,
  },
  headerBack: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerLabel: {
    fontWeight: '500',
    fontSize: 15,
  },
});
