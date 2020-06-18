import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert, Dimensions, TouchableHighlight} from 'react-native';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT} from '../res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const Item = ({index, data, selected, setSelected, onSelect}) => {
  const isSelected = index == selected;

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableHighlight
        onPress={() => {
          setSelected(index);
          if (index != 4) {
            onSelect(data[index]);
          }
        }}
        style={{borderRadius: 10}}
        underlayColor={'rgba(253, 186, 28, 0.5)'}>
        <View style={isSelected ? styles.itemTypeSelected : styles.itemType}>
          <FAIcon name="image" size={36} color={LIGHT} />
        </View>
      </TouchableHighlight>

      <Text style={{fontWeight: 'bold', fontSize: 11.5}}>{data[index]}</Text>
    </View>
  );
};

export const ItemTypes = ({onSelect, initialData}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const data = ['Food', 'Document', 'Clothing', 'Electronics', 'Others'];

  // if (initialData) {
  //   alert(initialData);
  //   if (data.includes(initialData)) {
  //     alert('1-4');
  //   } else {
  //     setSelectedIndex(4);
  //   }
  // }

  return (
    <View>
      <Text style={styles.label}>Item Description</Text>
      <View style={{marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Item index={0} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={1} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={2} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={3} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={4} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
      </View>
      {selectedIndex == 4 && (
        <TextInput
          style={[styles.input, {marginTop: 20}]}
          placeholder="Please describe your item"
          onChangeText={onSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 5,
    paddingLeft: 20,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontWeight: 'bold',
  },
  itemType: {
    height: itemDimension,
    width: itemDimension,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MEDIUM,

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTypeSelected: {
    height: itemDimension,
    width: itemDimension,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLOR,
  },
});
