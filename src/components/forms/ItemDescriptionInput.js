import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions, TouchableHighlight, Image} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT} from '../../res/constants';
import {SizedBox} from '../../components/widgets';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';
import _ from 'lodash';

import Document from '../../assets/icons/document.png';
import Food from '../../assets/icons/food.png';
import Clothing from '../../assets/icons/clothing.png';
import Large from '../../assets/icons/large.png';

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
        style={{borderRadius: 10, backgroundColor: 'white'}}
        underlayColor={'rgba(253, 186, 28, 0.5)'}>
        <View style={isSelected ? styles.itemTypeSelected : styles.itemType}>
          {index != 4 ? (
            <Image style={{height: 36, width: 36, resizeMode: 'contain'}} source={icons[index]} />
          ) : (
            <FA5Icon name="ellipsis-h" size={36} color={COLOR} />
          )}
        </View>
      </TouchableHighlight>

      <Text style={{fontFamily: 'Rubik-Medium', fontSize: 10, marginTop: 5, color: isSelected ? DARK : MEDIUM}}>
        {data[index]}
      </Text>
    </View>
  );
};

const Widget = ({initialValue, onChange, scrollToEnd, marginTop, marginBottom, constants}) => {
  const data = ['Document', 'Food', 'Clothing', 'Large', 'Others'];

  let initialValueIndex = null;

  if (initialValue !== '') {
    const index = data.findIndex((cargo) => {
      return cargo === initialValue;
    });

    initialValueIndex = index === -1 ? 4 : index;
  }

  const [selectedIndex, setSelectedIndex] = useState(initialValueIndex);

  return (
    <>
      {marginTop && <SizedBox />}
      <View>
        <Text style={styles.label}>Item Description</Text>
        <View style={styles.container}>
          <Item
            index={0}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onChange}
            scrollToEnd={scrollToEnd}
          />
          <Item
            index={1}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onChange}
            scrollToEnd={scrollToEnd}
          />
          <Item
            index={2}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onChange}
            scrollToEnd={scrollToEnd}
          />
          <Item
            index={3}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onChange}
            scrollToEnd={scrollToEnd}
          />
          <Item
            index={4}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onChange}
            scrollToEnd={scrollToEnd}
          />
        </View>
        {selectedIndex == 4 && (
          <TextInput
            value={initialValue}
            style={[styles.input, {marginTop: 5}]}
            placeholder="Please describe your item"
            onChangeText={onChange}
            placeholderTextColor={LIGHT}
          />
        )}
      </View>
      {marginBottom && <SizedBox />}
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export const ItemDescriptionInput = connect(mapStateToProps, null)(Widget);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingLeft: 20,
    height: 50,
    color: DARK,
    backgroundColor: 'white',
  },
  label: {
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
