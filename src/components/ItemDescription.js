import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert, Dimensions, TouchableHighlight, Image} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT} from '../res/constants';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';
import _ from 'lodash';

import Document from '../assets/icons/document.png';
import Food from '../assets/icons/food.png';
import Clothing from '../assets/icons/clothing.png';
import Large from '../assets/icons/large.png';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const Item = ({index, data, selected, setSelected, onSelect, scrollToEnd}) => {
  const isSelected = index == selected;

  const icons = [Document, Food, Clothing, Large, Large];

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableHighlight
        onPress={() => {
          setSelected(index);
          if (index != 4) {
            onSelect(data[index]);
          } else {
            onSelect('');
          }
          scrollToEnd();
        }}
        style={{borderRadius: 10}}
        underlayColor={'rgba(253, 186, 28, 0.5)'}>
        <View style={isSelected ? styles.itemTypeSelected : styles.itemType}>
          {index != 4 ? (
            <Image style={{height: 36, width: 36, resizeMode: 'contain'}} source={icons[index]} />
          ) : (
            <FA5Icon name="ellipsis-h" size={36} color={COLOR} />
          )}
        </View>
      </TouchableHighlight>

      <Text style={{fontFamily: 'Rubik-Medium', fontSize: 11, color: isSelected ? DARK : MEDIUM}}>{data[index]}</Text>
    </View>
  );
};

const Component = ({onSelect, initialData, scrollToEnd, constants}) => {
  const data = ['Document', 'Food', 'Clothing', 'Large', 'Others'];

  let initialDataIndex = null;

  if (initialData != '') {
    const index = data.findIndex(cargo => {
      return cargo == initialData;
    });

    initialDataIndex = index == -1 ? 4 : index;
  }

  const [selectedIndex, setSelectedIndex] = useState(initialDataIndex);

  return (
    <View>
      <Text style={styles.label}>Item Description</Text>
      <View style={{marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Item
          index={0}
          data={data}
          selected={selectedIndex}
          setSelected={setSelectedIndex}
          onSelect={onSelect}
          scrollToEnd={scrollToEnd}
        />
        <Item
          index={1}
          data={data}
          selected={selectedIndex}
          setSelected={setSelectedIndex}
          onSelect={onSelect}
          scrollToEnd={scrollToEnd}
        />
        <Item
          index={2}
          data={data}
          selected={selectedIndex}
          setSelected={setSelectedIndex}
          onSelect={onSelect}
          scrollToEnd={scrollToEnd}
        />
        <Item
          index={3}
          data={data}
          selected={selectedIndex}
          setSelected={setSelectedIndex}
          onSelect={onSelect}
          scrollToEnd={scrollToEnd}
        />
        <Item
          index={4}
          data={data}
          selected={selectedIndex}
          setSelected={setSelectedIndex}
          onSelect={onSelect}
          scrollToEnd={scrollToEnd}
        />
      </View>
      {selectedIndex == 4 && (
        <TextInput
          value={initialData}
          style={[styles.input, {marginTop: 20}]}
          placeholder="Please describe your item"
          onChangeText={onSelect}
          placeholderTextColor={LIGHT}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export const ItemDescription = connect(
  mapStateToProps,
  null,
)(Component);

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
  },
  label: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
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
