import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity, FlatList, SectionList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLOR, FONT } from '../../../../../res/variables';

//Main Components
import CustomIcon from '../../../../Components/Icons';
import {LandingHeader, AdsCarousel, StickyHomeHeader, LandingSubHeader} from '../../../../Components';

//Subcomponents
import {Categories, Offers, FlashSale, Vouchers, Suggestions} from './Components';

const Item = ({ title }) => (
  <View style={{}}>
    <Text style={{}}>{title}</Text>
  </View>
);

export const ToktokMallLandingScreen = () => {

  const [scrolling, setScrolling] = useState(false)

  const HandleOnScroll = (r) => {
    let ypos = r.nativeEvent.contentOffset.y
    if(ypos > 100) setScrolling(true)
    else if (ypos <= 100) setScrolling(false)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>     

      <StickyHomeHeader>
        <FlatList
          data={[1]}
          keyExtractor={(item, index) => item + index}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            console.log("scrolling...")
          }}
          renderItem={({ item }) => (
            <>
            {/* <AdsCarousel data={[1,2,3]} />   */}
            {/* <Categories data={[]} /> */}
            {/* <Offers data={[]} /> */}
            {/* <FlashSale data={[]} /> */}
            <Vouchers data={[]} />
            <Suggestions data={[]} />
            <View style={{height: 10}}></View>
            </>
          )}        
        />          
      </StickyHomeHeader>    

      {/* <View style={{display: !scrolling ? "flex" : "none"}}>
        <LandingHeader />
      </View>

      <View style={{display: scrolling ? "flex" : "none"}}>
        <LandingSubHeader />
      </View> */}

      {/* <LandingHeader />

      <FlatList
        data={[1]}
        keyExtractor={(item, index) => item + index}
        showsVerticalScrollIndicator={false}
        onScroll={HandleOnScroll}
        renderItem={({ item }) => (
          <>
            {!scrolling && <AdsCarousel data={[1,2,3]} />}  
            <Categories data={[]} />
            <Offers data={[]} />
            <FlashSale data={[]} />
            <Vouchers data={[]} />
            <Suggestions key={1} data={[]} />
            <View style={{height: 10}}></View>
          </>
        )}        
      />      */}

      {/* <SectionList         
        renderSectionHeader={({section: {title}}) => (<Text></Text>)}
        sections={[
          {title: 'Ads', data: [1], renderItem: () => <AdsCarousel />},
          {title: 'Categories', data: [1], renderItem: () => <Categories />},
          {title: 'Offers', data: [1], renderItem: () => <Offers />},
          {title: 'FlashSale', data: [1], renderItem: () => <FlashSale />},
          {title: 'Vouchers', data: [1], renderItem: () => <Vouchers />},
          {title: 'Suggestions', data: [1], renderItem: () => <Suggestions />},
        ]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
      /> */}

    </View>
  );
};