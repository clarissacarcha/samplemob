import React from 'react';
import {StyleSheet, Text, View, Image, TextInput, Pressable} from 'react-native';
import CONSTANTS from '../../../../../common/res/constants';
import {DARK, MEDIUM, LIGHT} from '../../../../../res/constants';
import ToggleSwitch from 'toggle-switch-react-native';
import ContactIcon from '../../../../../assets/icons/contacts.png';
import {ThrottledOpacity} from '../../../../../components_section';

export const AddressForm = ({
  addressObj,
  errorText,
  isCustomSelected,
  setIsEdited,
  customLabel,
  setCustomLabel,
  errorAddressNameField,
  setErrorAddressNameField,
  onSearchMap,
  confirmedLocation,
  errorAddressField,
  landmark,
  setLandMark,
  showToggleFunc,
  isDefault,
  setIsDefault,
  contactName,
  setContactName,
  contactNumber,
  onMobileChange,
  onPressContacts,
}) => {
  return (
    <>
      {isCustomSelected && (
        <>
          <Text style={styles.label}>Address Name</Text>
          <TextInput
            value={customLabel}
            onChangeText={
              addressObj?.id
                ? value => {
                    setIsEdited(true), setCustomLabel(value), setErrorAddressNameField(false);
                  }
                : value => {
                    setCustomLabel(value), setErrorAddressNameField(false);
                  }
            }
            style={[styles.input, errorAddressNameField && {borderWidth: 1, borderColor: CONSTANTS.COLOR.RED}]}
            placeholderTextColor={LIGHT}
            returnKeyType="done"
          />
          {errorAddressNameField && <Text style={{marginLeft: 16, color: CONSTANTS.COLOR.RED}}>{errorText}</Text>}
        </>
      )}

      <Text style={styles.label}>Address</Text>
      <View>
        <Pressable onPress={onSearchMap}>
          <View pointerEvents="none">
            <TextInput
              numberOfLines={2}
              multiline
              value={confirmedLocation?.place?.formattedAddress}
              style={[styles.input, errorAddressField && {borderWidth: 1, borderColor: CONSTANTS.COLOR.RED}]}
            />
          </View>
        </Pressable>
        {errorAddressField && <Text style={{marginLeft: 16, color: CONSTANTS.COLOR.RED}}>{errorText}</Text>}
      </View>

      <Text style={styles.label}>Landmark (optional)</Text>
      <Text style={styles.sublabel}>
        Complete address or landmark of nearby location for accurate and faster delivery.
      </Text>
      <TextInput
        maxLength={320}
        value={landmark}
        onChangeText={
          addressObj?.id
            ? value => {
                setIsEdited(true), setLandMark(value);
              }
            : value => setLandMark(value)
        }
        style={styles.input}
        multiline={true}
        placeholder="e.g. In front of sari-sari station "
        placeholderTextColor={LIGHT}
      />

      {showToggleFunc() && (
        <>
          <View style={styles.lineDivider} />
          <View style={styles.toggleContainer}>
            <Text>Set as default address</Text>
            {/*-------TO DO: ADD CONDITION----*/}
            <ToggleSwitch
              isOn={isDefault}
              onColor={CONSTANTS.COLOR.ORANGE}
              offColor={CONSTANTS.COLOR.MEDIUM}
              size="small"
              onToggle={
                addressObj?.id
                  ? () => {
                      setIsDefault(!isDefault), setIsEdited(true);
                    }
                  : () => setIsDefault(!isDefault)
              }
            />
          </View>
        </>
      )}

      <View style={styles.bottomlineDivider} />

      <Text style={[styles.label, {marginBottom: 0, color: 'black'}]}> Contact Details (optional)</Text>
      <View style={[styles.lineDivider, {marginHorizontal: 16, marginBottom: 0}]} />
      <Text style={styles.label}>Contact Name</Text>
      <TextInput
        value={contactName}
        onChangeText={
          addressObj?.id
            ? value => {
                setContactName(value), setIsEdited(true);
              }
            : value => setContactName(value)
        }
        style={styles.input}
        placeholderTextColor={LIGHT}
        returnKeyType="done"
      />

      <Text style={styles.label}>Mobile Number</Text>
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
            flex: 1,
            flexDirection: 'row',
            marginRight: 16,
            borderRadius: 10,
          }}>
          <View
            style={{
              borderRightColor: '#CCCCCC',
              borderRightWidth: 2,
              padding: 16,
              justifyContent: 'center',
            }}>
            <Text>+63</Text>
          </View>

          <TextInput
            value={contactNumber}
            keyboardType="number-pad"
            onChangeText={onMobileChange}
            maxLength={10}
            defaultValue={contactNumber}
            style={{padding: 16, flex: 1}}
            placeholderTextColor={LIGHT}
            returnKeyType="done"
          />
        </View>
        <ThrottledOpacity delay={4000} onPress={() => onPressContacts()}>
          <View style={{backgroundColor: CONSTANTS.COLOR.ORANGE, padding: 10, borderRadius: 5, alignSelf: 'flex-end'}}>
            <Image source={ContactIcon} resizeMode={'contain'} style={{height: 35, width: 35}} />
          </View>
        </ThrottledOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    fontSize: CONSTANTS.FONT_SIZE.M,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  sublabel: {
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: CONSTANTS.FONT_SIZE.S,
    color: MEDIUM,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  input: {
    marginHorizontal: 16,
    backgroundColor: CONSTANTS.COLOR.MEDIUM_DARK,
    borderRadius: 10,
    padding: 16,
    color: DARK,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  lineDivider: {
    marginVertical: 16,
    marginHorizontal: -16,
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
  bottomlineDivider: {
    marginTop: 16,
    marginHorizontal: -16,
    borderBottomWidth: 8,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
  },
});
