import React from 'react';
import {StyleSheet, FlatList} from 'react-native';

//SELF IMPORTS
import {HeaderReminders, Submit, UploadForms, TakePhotoID} from '../../Components';

export const ApplicationComponent = () => {
  return (
    <>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <>
              <HeaderReminders />
              <UploadForms />
              <TakePhotoID />
            </>
          );
        }}
        style={styles.container}
      />
      <Submit />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
