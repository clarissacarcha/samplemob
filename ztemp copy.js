import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {COLOR, DARK, MAP_DELTA_LOW, MEDIUM, LIGHT} from '../res/constants';
import {useQuery} from '@apollo/react-hooks';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';
import _ from 'lodash';

import {GET_CARGO_TYPES} from '../graphql';

const width = Dimensions.get('window').width;
const itemDimension = (width - 120) / 5;

const Item = ({index, data, selected, setSelected, onSelect, scrollToEnd, cargo, type}) => {
  const isSelected = index == selected;

  return (
    <View style={{alignItems: 'center'}}>
      <TouchableHighlight
        onPress={() => {
          setSelected(index);
          if (index != 4) {
            onSelect(data[index]);
          } else {
            scrollToEnd();
            onSelect('');
          }
        }}
        style={{borderRadius: 10}}
        underlayColor={'rgba(253, 186, 28, 0.5)'}>
        <View style={isSelected ? styles.itemTypeSelected : styles.itemType}>
          <FAIcon name="image" size={36} color={LIGHT} />
        </View>
      </TouchableHighlight>

      <Text style={{fontWeight: 'bold', fontSize: 11, color: isSelected ? DARK : MEDIUM}}>{type}</Text>
    </View>
  );
};

const Component = ({onSelect, initialData, scrollToEnd, constants}) => {
  const data = ['Food', 'Document', 'Clothing', 'Electronics', 'Others'];

  const {data: dataB, loading, error} = useQuery(GET_CARGO_TYPES, {
    fetchPolicy: 'network-only',
  });

  let initialDataIndex = null;

  if (initialData != '') {
    const index = data.findIndex(cargo => {
      return cargo == initialData;
    });

    initialDataIndex = index == -1 ? 4 : index;
  }

  const [selectedIndex, setSelectedIndex] = useState(initialDataIndex);

  if (loading) {
    return (
      <View>
        <Text style={styles.label}>Item Description</Text>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={24} color={COLOR} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.label}>Item Description</Text>
      <Text>{JSON.stringify(dataB.getCargoTypes)}</Text>
      <View style={{marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
        {dataB.getCargoTypes.map(cargo, index => (
          <Item
            index={index}
            type={cargo.type}
            cargo={cargo}
            data={data}
            selected={selectedIndex}
            setSelected={setSelectedIndex}
            onSelect={onSelect}
          />
        ))}

        {/* <Item index={0} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={1} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={2} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} />
        <Item index={3} data={data} selected={selectedIndex} setSelected={setSelectedIndex} onSelect={onSelect} /> */}
        <Item
          index={4}
          type="Others"
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
