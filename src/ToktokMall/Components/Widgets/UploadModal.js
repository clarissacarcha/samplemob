import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, Modal} from 'react-native';
import {FONT} from '../../../res/variables';
import CustomIcon from '../Icons';

export const UploadModal = ({isVisible, setIsVisible, actions = []}) => {
  const [modalVisible, setModalVisible] = useState(isVisible || false);

  return (
    <>
      <View style={styles.centeredView}>
        <Modal animationType="none" transparent={true} visible={modalVisible}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
            <View
              style={{
                backgroundColor: 'white',
                width: '80%',
                paddingVertical: 22,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}>
              <View style={{flexDirection: 'row', alignContent: "flex-end"}}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setIsVisible(false);
                  }}
                  style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                  <CustomIcon.EvIcon name="close" size={24} color="#F6841F" />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                {actions.map(({icon, name, onPress}) => (
                  <TouchableOpacity
                    onPress={() => {
                      onPress();
                      setModalVisible(!modalVisible);
                      setIsVisible(false);
                    }}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{paddingVertical: 5}} />
                      <View>
                        <Image
                          source={icon}
                          style={{width: 120, height: 120, resizeMode: 'stretch', overflow: 'hidden'}}
                        />
                      </View>
                      <View style={{paddingVertical: 5}} />
                      <Text style={{fontSize: 14, color: '#F6841F', fontFamily: FONT.REGULAR, textAlign: 'center'}}>
                        {name}
                      </Text>
                      <View style={{paddingVertical: 10}} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    position: 'absolute',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
