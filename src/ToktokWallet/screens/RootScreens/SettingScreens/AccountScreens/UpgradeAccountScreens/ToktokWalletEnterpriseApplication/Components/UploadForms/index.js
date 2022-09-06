import React, {useContext, useRef} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import {ContextEnterpriseApplication} from '../ContextProvider';

//SElF IMPORTS
import Form from './Form';

const bytesToMb = value => {
  return value / 1000000;
};

export const UploadForms = () => {
  const {forms, setFileUpload, setFileError, setForms} = useContext(ContextEnterpriseApplication);

  const onPress = async index => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      const fileTypesAccepted = ['pdf', 'jpeg', 'jpg', 'PDF', 'JPEG', 'JPG'];
      const filetype = res.type.split('/')[1];
      if (!fileTypesAccepted.includes(filetype)) {
        // Toast.show('Accepted file types are JPG, JPEG and PDF', Toast.LONG);
        return setFileError(index, 'Accepted file types are JPG, JPEG and PDF');
      }
      const fileSize = bytesToMb(+res.size);

      if (fileSize > 3) {
        return setFileError(index, 'File must not exceed 3MB');
      }

      setFileUpload(index, res);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker , exit any dialogs
      } else {
        throw error;
      }
    }
  };

  const onPressRemove = index => {
    forms[index].filename = '';
    forms[index].file = '';
    setForms([...forms]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={forms}
        extraData={[forms]}
        keyExtractor={item => item.name}
        renderItem={({item, index}) => {
          return (
            <Form item={item} index={index} onPress={onPress} onPressRemove={itemIndex => onPressRemove(itemIndex)} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});
