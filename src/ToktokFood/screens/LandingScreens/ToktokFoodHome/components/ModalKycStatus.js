import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {wallet} from 'toktokfood/assets/images';
import {moderateScale} from 'toktokfood/helper/scale';

import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

const CreateButton = ({setShowModal}) => {
  const navigation = useNavigation();

  const onNavigateToktokWalletAccount = () => {
    setShowModal(false);
    navigation.navigate('ToktokWalletLoginPage');
  };

  return (
    <TouchableOpacity onPress={onNavigateToktokWalletAccount} style={styles.createButton}>
      <Text style={styles.createText}>Create my toktokwallet account</Text>
    </TouchableOpacity>
  );
};

const BrowseButton = ({setShowModal}) => {
  return (
    <TouchableOpacity onPress={() => setShowModal(false)} style={styles.browseButton}>
      <Text style={styles.browseButtonText}>Browse toktokfood</Text>
    </TouchableOpacity>
  );
};

const ModalKycStatus = () => {
  const {customerWallet} = useSelector(state => state.toktokFood);

  const [showModal, setShowModal] = useState(customerWallet);

  return (
    <View style={{flex: 1}}>
      <Modal isVisible={showModal === null} onBackdropPress={() => setShowModal(false)}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainerStyle} style={styles.content}>
            <Image source={wallet} style={styles.walletIcon} />

            <Text style={styles.header}>Use toktokwallet as payment method for faster transaction</Text>

            <Text style={styles.paragraph1}>
              Ordering from your favorite merchants just made easier with toktokfood! For faster transaction, use
              toktokwallet as your method of payment upon placing of order.
            </Text>

            <Text style={styles.paragraph1}>
              You may also use cash as your payment if you have submitted your requirements for toktokwallet
              verification with limitation*.
            </Text>

            <Text style={styles.paragraph2}>
              *Orders should not exceed PHP 2000.00 for users with pending toktokwallet verification
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <CreateButton setShowModal={setShowModal} />

            <BrowseButton setShowModal={setShowModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalKycStatus;

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
    marginVertical: moderateScale(100),
  },
  content: {
    paddingVertical: moderateScale(30),
    paddingHorizontal: moderateScale(20),
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  browseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.YELLOWTEXT,
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
  },
  browseButtonText: {
    color: COLORS.YELLOWTEXT,
    fontSize: FONT_SIZE.L,
    fontWeight: '600',
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.YELLOWTEXT,
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
  },
  createText: {
    color: 'white',
    fontSize: FONT_SIZE.L,
    fontWeight: '600',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  paragraph1: {
    fontSize: FONT_SIZE.L,
    marginBottom: moderateScale(15),
    textAlign: 'center',
  },
  paragraph2: {
    color: COLORS.YELLOWTEXT,
    fontSize: FONT_SIZE.L,
    textAlign: 'center',
  },
  walletIcon: {
    width: 70,
    height: 70,
    marginBottom: moderateScale(20),
  },
});
