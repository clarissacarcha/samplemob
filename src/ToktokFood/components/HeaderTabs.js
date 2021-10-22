import React, {useState, useRef, useEffect} from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LoadingIndicator from 'toktokfood/components/LoadingIndicator';

let scrollPosition = 0;

const HeaderTabs = ({activeTab, setActiveTab, tabs, loading}) => {
  const flatListRef = useRef();

  const handleScroll = (event) => {
    scrollPosition = event.nativeEvent.contentOffset.x;
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: scrollPosition, animated: false});
    }
  }, [activeTab]);

  useEffect(() => {
    if (loading) {
      scrollPosition = 0;
    }
  }, [loading]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({offset: scrollPosition, animated: false});
  }, [activeTab]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(item)}
        style={[styles.tabContainer, activeTab.id == item.id && styles.activeTabContainer]}>
        <Text style={[styles.tabText, activeTab.id == item.id && styles.activeTabText]}>
          {item.name ?? item.categoryName}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingIndicator style={{paddingVertical: 10}} isLoading={true} size="small" />;
  }
  return (
    <View style={styles.container}>
      {/* showsHorizontalScrollIndicator={false} added for Android */}
      <FlatList
        horizontal
        data={tabs}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={flatListRef}
        keyExtractor={(val, index) => index.toString()}
      />
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
    marginTop: 12,
    marginHorizontal: 5,
  },
  tabContainer: {
    justifyContent: 'center',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  tabText: {
    fontWeight: '400',
    textTransform: 'capitalize',
  },
});
