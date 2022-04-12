import React from 'react';
import {Text, StyleSheet, Image, View, Modal, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import Delete from '../../../assets/icons/Delete.png';

export const Keyboard = ({setVerificationCode, verificationCode, onSubmit}) => {
  const onPress = value => {
    if (verificationCode.length < 6) {
      setVerificationCode(prevState => prevState + value);
    }
    if (verificationCode.length === 5) {
      onSubmit(verificationCode + value);
    }
  };
  const remove = () => {
    setVerificationCode(prevState => prevState.slice(0, prevState.length - 1));
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('1')}>
          <Text style={styles.text}>1</Text>
          <Text style={styles.text2}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('2')}>
          <Text style={styles.text}>2</Text>
          <Text style={styles.text2}>A B C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn1} onPress={() => onPress('3')}>
          <Text style={styles.text}>3</Text>
          <Text style={styles.text2}>D E F</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('4')}>
          <Text style={styles.text}>4</Text>
          <Text style={styles.text2}>G H I</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('5')}>
          <Text style={styles.text}>5</Text>
          <Text style={styles.text2}>J K L</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn1} onPress={() => onPress('6')}>
          <Text style={styles.text}>6</Text>
          <Text style={styles.text2}>M N O</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('7')}>
          <Text style={styles.text}>7</Text>
          <Text style={styles.text2}>P Q R S</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('8')}>
          <Text style={styles.text}>8</Text>
          <Text style={styles.text2}>T U V</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn1} onPress={() => onPress('9')}>
          <Text style={styles.text}>9</Text>
          <Text style={styles.text2}>W X Y Z</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, {marginBottom: 5}]}>
        <TouchableOpacity style={[styles.btn2, {marginRight: 5}]}></TouchableOpacity>
        <TouchableOpacity style={[styles.btn1, {marginRight: 5}]} onPress={() => onPress('0')}>
          <Text style={[styles.text, {paddingBottom: 5}]}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={remove}>
          <Image source={Delete} style={{height: 30}} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  btn1: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  btn2: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
  },
  text2: {
    fontSize: 10,
    marginBottom: 5,
    marginTop: -5,
  },
});
