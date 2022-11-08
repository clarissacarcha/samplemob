import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLOR} from '../../../../../res/constants';
import CONSTANTS from '../../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../../components_section';

export const AddressButtons = ({
  saveNewAddress,
  initiateSaveEdit,
  onAddressDelete,
  addressObj,
  addressIdFromService,
}) => {
  return (
    <>
      {!addressObj?.id && !addressIdFromService && (
        <View style={styles.submitContainer}>
          <ThrottledOpacity delay={4000} onPress={saveNewAddress} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </ThrottledOpacity>
        </View>
      )}

      {addressIdFromService && (
        <View style={styles.submitContainer}>
          <ThrottledOpacity delay={4000} onPress={initiateSaveEdit} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.submit}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </ThrottledOpacity>
        </View>
      )}

      {addressObj?.id && (
        <View style={[styles.submitContainer, styles.editAddressContainer]}>
          <ThrottledOpacity delay={4000} onPress={onAddressDelete} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={styles.deleteButtonWraper}>
              <Text style={[styles.submitText, {color: CONSTANTS.COLOR.ORANGE}]}>Delete</Text>
            </View>
          </ThrottledOpacity>

          <ThrottledOpacity delay={4000} onPress={initiateSaveEdit} underlayColor={COLOR} style={{borderRadius: 10}}>
            <View style={[styles.submit, {paddingHorizontal: '18%'}]}>
              <Text style={styles.submitText}>Save</Text>
            </View>
          </ThrottledOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  submitContainer: {
    paddingHorizontal: 32,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  submit: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
  },
  submitText: {
    marginVertical: 11,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  editAddressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButtonWraper: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '18%',
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    backgroundColor: CONSTANTS.COLOR.WHITE,
  },
});
