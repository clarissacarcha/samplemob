import React from 'react';
import {Text, StyleSheet, Image, View, Modal, ScrollView, FlatList} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import SuccessIMG from '../../../../assets/images/Sucess.png';
import {ThrottledOpacity} from '../../../../components_section';
import {numberFormat} from '../../../../helper';
import normalize from 'react-native-normalize';
import {color} from 'react-native-reanimated';

export const ServiceableArea = ({isVissible, setVissible, serviceableAreaList}) => {
  const ItemSeperatorView = () => {
    return <View style={styles.itemSeperatorStyle} />;
  };
  return (
    <Modal animationType="fade" transparent={true} visible={isVissible} style={StyleSheet.absoluteFill}>
      <View style={styles.transparent}>
        <View style={styles.card}>
          <View style={styles.container}>
            <View style={{marginTop: 30, marginLeft: 25}}>
              <Text
                style={{
                  fontSize: normalize(CONSTANTS.FONT_SIZE.XL),
                  color: CONSTANTS.COLOR.ORANGE,
                  fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
                }}>
                Serviceable Areas
              </Text>
            </View>
            <ItemSeperatorView />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={serviceableAreaList}
              renderItem={({item}) => (
                <View style={{marginTop: 20, marginLeft: 25}}>
                  <Text>{item}</Text>
                </View>
              )}
            />
            <View>
              <ThrottledOpacity
                delay={500}
                style={{
                  backgroundColor: 'red',
                  height: normalize(45),
                  width: normalize(280),
                  borderRadius: 5,
                  backgroundColor: CONSTANTS.COLOR.ORANGE,
                  borderWidth: 1,
                  borderColor: CONSTANTS.COLOR.ORANGE,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 20,
                  marginVertical: 30,
                }}
                onPress={() => {
                  setVissible(false);
                }}>
                <Text style={styles.buttonText}>OK</Text>
              </ThrottledOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    height: normalize(500),
  },
  transparent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderRadius: 10,
  },
  modalTitle: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL + 3,
    marginVertical: 20,
  },
  modalDescription: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: CONSTANTS.COLOR.BLACK,
  },
  imageDimensions: {
    width: 135,
    height: 120,
  },
  textHighlight: {
    color: CONSTANTS.COLOR.ORANGE,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  buttonText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    fontSize: CONSTANTS.FONT_SIZE.XL,
    color: CONSTANTS.COLOR.WHITE,
  },
  itemSeperatorStyle: {
    // height: 0.5,
    width: '100%',
    // backgroundColor: "#E4E4E4",
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
});
