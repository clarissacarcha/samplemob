import React from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';

const HeaderTabs = ({activeTab, setActiveTab, tabs}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(item)}
        style={[styles.tabContainer, activeTab.id === item.id && styles.activeTabContainer]}>
        <Text style={[styles.tabText, activeTab.id === item.id && styles.activeTabText]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList horizontal data={tabs} renderItem={renderItem} />

      <View style={styles.divider} />
    </View>
  );
};

export default HeaderTabs;

const styles = StyleSheet.create({
  activeTabContainer: {
    backgroundColor: '#FFA700',
    borderColor: '#FFA700',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    marginHorizontal: 5,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  activeTabText: {
    color: 'white',
  },
  container: {
    // borderWidth: 1,
    // borderColor: '#E6E6E6',
    // borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  divider: {
    borderColor: '#E6E6E6',
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 5,
  },
  tabContainer: {
    justifyContent: 'center',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
  },
  tabText: {
    fontWeight: '400',
  },
});
