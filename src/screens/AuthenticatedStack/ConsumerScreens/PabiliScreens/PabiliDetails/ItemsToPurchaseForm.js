import React, {useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';
import {VectorIcon, ICON_SET} from '../../../../../revamp';
import {FlatList} from 'react-native-gesture-handler';

const PurchaseForm = ({item, length, index, onRemovePress, onItemChange, onQuantityChange}) => {
  return (
    <View style={{flexDirection: 'row', marginBottom: 10}}>
      <TextInput
        value={item.description}
        onChangeText={(value) => {
          onItemChange({description: value, index});
        }}
        placeholder="ex. Apples"
        style={styles.description}
        placeholderTextColor={LIGHT}
      />
      <View style={{width: 10}} />
      <TextInput
        value={item.quantity}
        onChangeText={(value) => {
          onQuantityChange({quantity: value, index});
        }}
        placeholder="ex. 1 pack"
        style={styles.quantity}
        placeholderTextColor={LIGHT}
      />
      {index !== 0 || length > 1 ? (
        <TouchableOpacity
          onPress={() => onRemovePress(index)}
          style={{height: 50, width: 45, justifyContent: 'center', alignItems: 'flex-end'}}>
          <VectorIcon iconSet={ICON_SET.Evil} name="close" size={35} color={COLOR.MEDIUM} />
        </TouchableOpacity>
      ) : (
        <View style={{height: 50, width: 45}} />
      )}
    </View>
  );
};

const PurchaseFormList = ({itemsToPurchase, removeItemFormOnIndex, onItemChange, onQuantityChange}) => {
  return itemsToPurchase.map((item, index) => {
    return (
      <PurchaseForm
        item={item}
        index={index}
        length={itemsToPurchase.length}
        onRemovePress={removeItemFormOnIndex}
        onItemChange={onItemChange}
        onQuantityChange={onQuantityChange}
      />
    );
  });
};

const FORM_DATA = {description: '', quantity: ''};

const PromoForm = ({initialData: itemsToPurchase, onDataChange}) => {
  // const [itemsToPurchase, setItemsToPurchase] = useState(initialData);

  const removeItemFormOnIndex = (index) => {
    const itemsMirror = [...itemsToPurchase];
    console.log({REMOVING: itemsMirror});
    itemsMirror.splice(index, 1);

    console.log({REMOVED: itemsMirror});

    // setItemsToPurchase(itemsMirror);
    onDataChange(itemsMirror);
  };

  const addItemForm = () => {
    const itemsMirror = [...itemsToPurchase];

    // setItemsToPurchase([...itemsMirror, FORM_DATA]);
    onDataChange([...itemsMirror, FORM_DATA]);
  };

  const onItemChange = ({description, index}) => {
    const itemsMirror = [...itemsToPurchase];

    console.log({itemsMirror: JSON.stringify(itemsMirror, null, 4)});

    const changingRow = itemsMirror[index];

    const updatedRow = {
      ...changingRow,
      description: description,
    };

    // console.log({updatedRow});

    itemsMirror[index] = updatedRow;

    // console.log({itemsMirror});

    // setItemsToPurchase(itemsMirror);
    onDataChange(itemsMirror);
  };

  const onQuantityChange = ({quantity, index}) => {
    const itemsMirror = [...itemsToPurchase];

    const changingRow = itemsMirror[index];

    const updatedRow = {
      ...changingRow,
      quantity: quantity,
    };

    console.log({updatedRow});

    itemsMirror[index] = updatedRow;

    console.log({itemsMirror});

    // setItemsToPurchase(itemsMirror);
    onDataChange(itemsMirror);
  };

  return (
    <>
      <View>
        <Text style={{fontFamily: FONT.BOLD}}>Items to Purchase</Text>
        <View style={styles.spacing} />
        <PurchaseFormList
          itemsToPurchase={itemsToPurchase}
          removeItemFormOnIndex={removeItemFormOnIndex}
          onItemChange={onItemChange}
          onQuantityChange={onQuantityChange}
        />
        {/* <FlatList
          data={itemsToPurchase}
          renderItem={(item, index) => (
            <PurchaseForm
              item={item}
              index={index}
              onRemovePress={removeItemFormOnIndex}
              onItemChange={onItemChange}
              onQuantityChange={onQuantityChange}
            />
          )} 
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        /> */}
        {itemsToPurchase.length < 20 && (
          <TouchableOpacity onPress={addItemForm}>
            <Text style={{fontFamily: FONT.BOLD, color: COLOR.ORANGE}}>+ Add more items</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(PromoForm);

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: COLOR.ATHENS_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  description: {
    height: 50,
    backgroundColor: COLOR.ATHENS_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 3,
  },
  quantity: {
    height: 50,
    backgroundColor: COLOR.ATHENS_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  spacing: {height: 2},
});
