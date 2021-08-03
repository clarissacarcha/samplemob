import { filter } from 'lodash';
import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import { SearchBar } from 'react-native-elements'
import {LandingSubHeader} from '../../../Components';
import { useLazyQuery } from '@apollo/react-hooks';
import { TOKTOK_MALL_GRAPHQL_CLIENT } from '../../../../graphql';
import {SEARCH_PRODUCT} from '../../../../graphql/toktokmall/model';

const testdata = ["Gaming Chair", "Mousepad", "Face mask", "Pillow", "Ballpen"]

export const ToktokMallSearch = ({navigation}) => {

  const [filteredData, setFilteredData] = useState(testdata)
  const [searchValue, setSearchValue] = useState('')  

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>

      <LandingSubHeader 
        onSearch={(val) => {
          setSearchValue(val)
          if(val != "") setFilteredData([])
          else if(val == "") setFilteredData(testdata)
        }} 
        onSubmit={() => {
          navigation.navigate("ToktokMallCategoriesList", {searchValue: searchValue})
        }} 
      />

      <View style={{flex: 1}}>

        {/* {filteredData.length == 0 && 
        <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text style={{color: "#9E9E9E", fontSize: 14}}>No results found</Text>
        </View>} */}

        {filteredData.length > 0 &&
        <>
        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 14}}>Search History</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 12, textAlign: 'right', color: '#F6841F'}}>Clear History</Text>
          </View>
        </View> 
        <FlatList 
          data={filteredData}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          renderItem={({item}) => 
            <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
              <Text style={{color: "#9E9E9E", fontSize: 14}}>{item}</Text>
            </View>
          }
        />
        </>}        

      </View>
    </View>
  );
};
