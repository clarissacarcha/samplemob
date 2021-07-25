import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Toast from 'react-native-simple-toast';
import {LandingSubHeader, Dropdown, Product, MessageModal} from '../../../Components';
import {Tab, Store} from './components';

export const ToktokMallStore = () => {

  const [activeTab, setActiveTab] = useState(0)
  const [showCategories, setShowCategories] = useState(false)
  const [messageModalShown, setMessageModalShown] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const RenderContent = () => {
    return (
      <>
        <Tab 
          index={activeTab} 
          onTabChange={(index) => {
            setActiveTab(index)
            setShowCategories(false)
          }}
        />

        {activeTab == 0 && <Product />}
        {activeTab == 1 && !showCategories && <Dropdown onSelect={() => setShowCategories(true)} />}
        {activeTab == 1 && showCategories && <Product />}
      </>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader  
          placeholder="Search in Store"
          onSearch={(val) => {
            setSearchValue(val)
          }}
        />

        {searchValue != "" &&
        <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
        </View>}

        {searchValue == "" && 
        <Store 
          data={{
            following: true,
            name: "Face Mask PH",
            location: "Malabon, Manila",
            rating: 4.0,
            chatResponse: 40,
            totalProducts: 152
          }}
          onToggleFollow={(val) => {
            if(val == false) setMessageModalShown(true) //Unfollow
            else if(val == true) Toast.show("You are now following Face Mask PH") //Followed
          }} 
        />}

        {searchValue == "" && <RenderContent />}

        {messageModalShown && 
        <MessageModal
          type="success"  
          isVisible={messageModalShown}
          setIsVisible={(val) => setMessageModalShown(val)}
          message={"You unfollowed Face Mask PH"}
        />}

      </View>
    </View>
  );
};
