import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {LandingSubHeader} from '../../../Components';

export const ToktokMallSearch = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LandingSubHeader />
      <View style={{flex: 1}}>

        <View style={{flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 14}}>Search History</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 12, textAlign: 'right', color: '#F6841F'}}>Clear History</Text>
          </View>
        </View>

        <FlatList 
          data={["Gaming Chair", "Mousepad", "Face mask", "Pillow", "Ballpen"]}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F7F7FA'}} />}
          renderItem={({item}) => <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
            <Text style={{color: "#9E9E9E", fontSize: 14}}>{item}</Text>
          </View>}
        />

      </View>
    </View>
  );
};
