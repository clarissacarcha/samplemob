import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, TextInput} from 'react-native';
import {YellowButton, VectorIcon, ICON_SET} from 'src/revamp';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_SOURCE_OF_INCOME} from 'toktokwallet/graphql';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

//SELF IMPORTS
import {SourceOfIncomeModal} from './SourceOfIncomeModal';
import {CustomTextInput} from 'toktokwallet/components';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, SIZE, FONT_SIZE} = CONSTANTS;

export const SourceOfIncome = ({pepInfoAnswer, setPepInfo, errorMessage, setErrorMessage}) => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(pepInfoAnswer.selected);
  const alert = useAlert();

  const [getSourceOfIncome, {loading}] = useLazyQuery(GET_SOURCE_OF_INCOME, {
    client: TOKTOK_WALLET_ENTEPRISE_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: ({getSourceOfIncome}) => {
      const data = [...getSourceOfIncome, {id: '0', description: 'Others'}];
      const finalData = data.map((item, index) => {
        return {
          ...item,
          selected: false,
        };
      });

      setData(finalData);
    },
    onError: error => {
      onErrorAlert({alert, error});
    },
  });

  const openModal = () => {
    setVisible(true);
  };

  const doneProcess = () => {
    const sourceOfIncomeId = selectedData.map(data => data.id);
    const sourceOfIncomeDes = selectedData.map(data => data.description);

    setPepInfo(state => {
      return {
        ...state,
        questionnaire: {
          ...state.questionnaire,
          sourceOfIncomeId,
          sourceOfIncomeDes,
          selectedSourceOfIncome: selectedData,
        },
      };
    });
    handleErrorMessage(2);
    handleErrorMessage(3);
  };

  const removeSelected = index => {
    const findIndex = data.findIndex(d => d.id === selectedData[index].id);
    const currentData = [...data];
    currentData[findIndex] = {
      ...currentData[findIndex],
      selected: !currentData[findIndex].selected,
    };
    if (selectedData[index].id == 0) {
      setPepInfo(state => {
        return {
          ...state,
          questionnaire: {
            ...state.questionnaire,
            sourceOfIncome: '',
            sourceOfIncomeDes: '',
          },
        };
      });
    }
    setData(currentData);
    selectedData.splice(index, 1);
    setSelectedData(selectedData);
    doneProcess();
  };

  const onChangeText = value => {
    handleErrorMessage(3);
    setPepInfo(state => {
      return {
        ...state,
        questionnaire: {
          ...state.questionnaire,
          sourceOfIncome: value,
        },
      };
    });
  };

  const handleErrorMessage = index => {
    setErrorMessage(state => {
      state[index] = '';
      return [...state];
    });
  };

  useEffect(() => getSourceOfIncome(), []);
  useEffect(() => doneProcess(), [selectedData]);

  return (
    <>
      <SourceOfIncomeModal
        visible={visible}
        setVisible={setVisible}
        data={data}
        setData={setData}
        loading={loading}
        doneProcess={doneProcess}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
      />
      <View style={{marginTop: 10}}>
        <Text style={{fontFamily: FONT.BOLD, fontSize: FONT_SIZE.S, color: '#525252'}}>Source of Income</Text>
        <TouchableOpacity
          onPress={openModal}
          style={{
            ...styles.input,
            ...styles.selectionContainer,
            ...styles.shadow,
            ...(errorMessage[2] != '' ? styles.errorBorder : {}),
          }}>
          <Text style={{flex: 1, color: '#9E9E9E', fontSize: FONT_SIZE.M, fontFamily: FONT.REGULAR}}>
            Check all that applies
          </Text>
          <VectorIcon iconSet={ICON_SET.FontAwesome5} name="chevron-down" color={COLOR.ORANGE} size={15} />
        </TouchableOpacity>
      </View>
      {errorMessage[2] != '' && <Text style={styles.errorMessage}>{errorMessage[2]}</Text>}
      {selectedData.length > 0 && (
        <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
          {selectedData.map((item, index) => (
            <View
              style={{
                ...styles.input,
                padding: 2,
                height: 30,
                marginHorizontal: 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>{item.description}</Text>
              <TouchableHighlight
                hitSlop={{top: 40, right: 40, bottom: 40, left: 40}}
                onPress={() => removeSelected(index)}
                underlayColor={'transparent'}>
                <View style={{height: 30, width: 20, justifyContent: 'center', alignItems: 'flex-end'}}>
                  <VectorIcon color={'#9E9E9E'} size={15} iconSet={ICON_SET.AntDesign} name="close" />
                </View>
              </TouchableHighlight>
            </View>
          ))}
        </View>
      )}
      {pepInfoAnswer?.value.includes('0') && (
        <View style={{marginTop: 10}}>
          <CustomTextInput
            placeholder="Specify other source of income"
            value={pepInfoAnswer.others}
            onChangeText={onChangeText}
            placeholderTextColor="#9E9E9E"
            errorMessage={errorMessage[3]}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F8F8F8',
    marginTop: 5,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    paddingHorizontal: 10,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'white',
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  errorMessage: {
    color: COLOR.RED,
    fontSize: FONT_SIZE.S,
    marginTop: 5,
  },
});
