import React, {useContext, useEffect, useMemo, useState} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import { useSelector } from 'react-redux';
import { blank } from 'toktokload/assets/ads'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

//components
import { HeaderBack, HeaderTitle, HeaderTabs, LoadingIndicator } from "src/ToktokLoad/components";
import { BuyLoad, Favorites, VerifyContextProvider, VerifyContext, Advertisement , LoadCategory } from "./components";

import CONSTANTS from 'common/res/constants'
const { COLOR , FONT_FAMILY: FONT , SIZE , FONT_SIZE , MARGIN , SHADOW } = CONSTANTS

const MainComponent = ({ navigation, route }) => {

  const { mobileNumber, tabList } = useContext(VerifyContext);
  const [categories, setCategories]= useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [{
    index: 0,
    id: 1,
    name: "Telco"
  },{
    index: 1,
    id: 2,
    name: "Broadband"
  },{
    index: 2,
    id: 3,
    name: "Entertainment"
  }]

  const getActiveCategoryName = (activeTab)=> {
    return categories.filter(tab=>tab.id===activeTab)[0]
  }

  useEffect(()=>{
    setActiveTab(tabs[0].id)
    setCategories(tabs)
  },[])

  const ads = [{ id: 1, image: blank },{ id: 2, image: blank },{ id: 3, image: blank }]

  return (
    <View style={styles.container}>
      <Advertisement autoplay ads={ads}/>
      <HeaderTabs
        tabs={categories}
        scrollEnabled={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fitToScreen={false}
        overLap={false}
        // loading={loading}
        // subContainerStyle={subContainerStyle}
      />
      <LoadCategory 
        navigation={navigation}
        activeTab={activeTab}
        activeCategory={()=>getActiveCategoryName(activeTab)}
      />
  
        <ActionButton fixNativeFeedbackRadius={true} hideShadow={false} spacing={15} size={50} nativeFeedbackRippleColor="transparent" degrees={0} renderIcon={()=><View><Text>gg</Text></View>} buttonColor="white" titleBgColor="transparent" bgColor="rgba(0,0,0,0.5)" offsetY={75} offsetX={14}>
              <ActionButton.Item activeOpacity={0} size={40} hideLabelShadow={true} textContainerStyle={{backgroundColor:"transparent",border: 0,borderColor:"transparent"}} textStyle={{backgroundColor:"transparent",color:"white"}} title="Activities" buttonColor="white" onPress={() => console.log("notes tapped!")}>
                <Icon name="md-create" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item size={40} hideLabelShadow={true} textContainerStyle={{backgroundColor:"transparent",border: 0,borderColor:"transparent"}} textStyle={{backgroundColor:"transparent",color:"white"}} title="toktokwallet" buttonColor="white" onPress={() => console.log("notes tapped!")}>
                <Icon name="md-create" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              {/* <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                <Icon name="md-done-all" style={styles.actionButtonIcon} />
              </ActionButton.Item> */}
        </ActionButton>
     
    </View>
  );
};

export const ToktokLoadHome = ({ navigation, route }) => {

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={"toktokload"} />,
  });

  return (
    <VerifyContextProvider>
      <MainComponent navigation={navigation} route={route} />
    </VerifyContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'orange',
  },
})


