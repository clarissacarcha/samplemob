import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {LandingSubHeader, Dropdown, Product} from '../../../Components';

import {Tab, Store} from './components';

export const ToktokMallStore = () => {

  const [activeTab, setActiveTab] = useState(0)
  const [showCategories, setShowCategories] = useState(false)

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <View style={{flex: 1}}>

        <LandingSubHeader />

        <Store 
          data={{
            following: true,
            name: "Face Mask PH",
            location: "Malabon, Manila",
            rating: 4.0,
            chatResponse: 40,
            totalProducts: 152
          }} 
          />

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

      </View>
    </View>
  );
};
