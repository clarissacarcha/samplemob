import React, {useState, useRef, useEffect} from 'react';
import {FlatList, Image, View, StyleSheet, Text, TouchableOpacity, Dimensions, TouchableHighlight} from 'react-native';
import { LoadingIndicator } from 'src/ToktokLoad/components';
import { COLOR, FONT, FONT_SIZE } from "src/res/variables"; 

//HELPER
import { moderateScale } from "toktokload/helper";

const {width, height} = Dimensions.get('window');
let scrollPosition = 0;

export const HeaderTabs = (props) => {

  const {activeTab, setActiveTab, tabs, loading, fitToScreen = true, selectedLoad, subContainerStyle , overLap = true } = props;
  const [has25Chars, setHas25Chars] = useState(false);
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

  const renderItem = ({item, index}) => {
    const itemTabWidth = fitToScreen ? width / tabs.length : moderateScale(127);
    const tabName = item?.name ?? item?.categoryName;

    if(tabName.length > 15){ setHas25Chars(true) }
    return (
      <TouchableOpacity onPress={() => setActiveTab(item)}>
        <View  style={[{ width: itemTabWidth, height: has25Chars ? moderateScale(65) : moderateScale(46), paddingHorizontal: moderateScale(10), justifyContent: "center" }]}>
          <Text style={[styles.tabText, { color: activeTab?.id == item?.id ? "#F6841F" : "#707070"} ]}>
            { tabName }
          </Text>
        </View>
        <View style={activeTab?.id == item?.id && styles.activeTabContainer} />
      </TouchableOpacity>
    );
  };

  if(loading){
    return(
      <View style={styles.container}>
        <LoadingIndicator isLoading={true} isFlex />
      </View>
    )
  }
  return (
    <View style={[styles.mainContainer, subContainerStyle , {...(overLap ? {zIndex: 1} : {})}]}>
      <View style={[styles.shadow]}>
        <FlatList
          extraData={props}
          horizontal
          data={tabs}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={flatListRef}
          keyExtractor={(val, index) => index.toString()}
          contentContainerStyle={{ alignItems: "center" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    overflow: "hidden",
    paddingBottom: 5,
  },
  container: {
    flex: 1,
  },
  activeTabContainer: {
    backgroundColor: '#F6841F',
    height: 3,
  },
  inactiveTabContainer: {
    backgroundColor: '#F7F7FA',
    height: 3,
  },
  activeTabText: {
    color: '#FFA700',
  },
  divider: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 1,
    height: 2
  },
  tabText: {
    textAlign: "center",
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
    marginVertical: moderateScale(15),
    flexShrink: 1
  },
  hitSlop: {
    top: moderateScale(30),
    bottom: moderateScale(30),
    left: moderateScale(30),
    right: moderateScale(30)
  },
  shadow: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
});
