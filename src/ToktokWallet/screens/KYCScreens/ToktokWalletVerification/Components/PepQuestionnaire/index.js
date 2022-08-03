import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {PepQuestionnaire as PepQuestionnaireComponent} from 'toktokwallet/components';
import {VerifyContext} from '../VerifyContextProvider';

export const PepQuestionnaire = () => {
  const {pepInfo, setPepInfo, setCurrentIndex} = useContext(VerifyContext);

  return (
    <View style={styles.container}>
      <PepQuestionnaireComponent pepInfo={pepInfo} setPepInfo={setPepInfo} setCurrentIndex={setCurrentIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
