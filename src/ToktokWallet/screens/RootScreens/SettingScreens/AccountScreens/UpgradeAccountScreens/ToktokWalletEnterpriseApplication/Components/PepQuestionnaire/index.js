import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {PepQuestionnaire as PepQuestionnaireComponent} from 'toktokwallet/components';
import {ContextEnterpriseApplication} from '../ContextProvider';

export const PepQuestionnaire = () => {
  const {pepInfo, setPepInfo, setCurrentIndex} = useContext(ContextEnterpriseApplication);

  return (
    <View style={styles.container}>
      <PepQuestionnaireComponent
        pepInfo={pepInfo}
        setPepInfo={setPepInfo}
        setCurrentIndex={setCurrentIndex}
        hasPreviousButton={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
