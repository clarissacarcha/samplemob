import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {APP_FLAVOR, COLOR, DARK, MEDIUM, LIGHT} from '../../../res/constants';
import {HeaderBack, HeaderTitle, AlertOverlay} from '../../../components';
import {GET_DELIVERY_CANCELLATION_CATEGORIES, POST_DELIVERY_CANCELLATION} from '../../../graphql';
import {onError} from '../../../util/ErrorUtility';
import _ from 'lodash';

const TalkToUs = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Order', 'Cancellation']} />,
  });

  const {deliveryId, onCancelCallback} = route.params;

  let dropDownRef = useRef(null);
  const [reasons, setReasons] = useState([
    {
      label: 'Select a reason',
      value: '0',
    },
  ]);
  const [selectedReason, setSelectedReason] = useState('0');
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [description, setDescription] = useState('');

  const {data, loading, error} = useQuery(GET_DELIVERY_CANCELLATION_CATEGORIES, {
    fetchPolicy: 'network-only',
    variables: {
      filter: {
        appFlavor: APP_FLAVOR,
      },
    },
    onCompleted: ({getDeliveryCancellationCategories}) => {
      console.log(getDeliveryCancellationCategories);

      const mappedReasons = getDeliveryCancellationCategories.map(reason => {
        return {
          label: reason.name,
          value: reason.id,
        };
      });

      setReasons([
        {
          label: 'Select a reason',
          value: '0',
        },
        ...mappedReasons,
        {
          label: 'Others (Please Specify)',
          value: '999',
        },
      ]);
    },
  });

  const [postDeliveryCancellation, {loading: postLoading}] = useMutation(POST_DELIVERY_CANCELLATION, {
    onError,
    onCompleted: ({postDeliveryCancellation}) => {
      //
      // console.log(JSON.stringify(postDeliveryCancellation, null, 4));

      onCancelCallback(postDeliveryCancellation);
      navigation.pop();
    },
  });

  const onConfirm = () => {
    if (selectedReason === '0') {
      Alert.alert('', 'Please select a reason.');
      return;
    }

    if (selectedReason === '999' && _.trim(description) === '') {
      Alert.alert('', 'Please specify a description.');
      return;
    }

    postDeliveryCancellation({
      variables: {
        input: {
          appFlavor: APP_FLAVOR,
          deliveryId: deliveryId,
          deliveryCancellationCategoryId: selectedReason === '999' ? null : selectedReason,
          description: _.trim(description),
        },
      },
    });
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something Went Wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AlertOverlay visible={postLoading} />
      <Text style={styles.label}>Reason</Text>
      <DropDownPicker
        defaultValue={'0'}
        items={reasons}
        containerStyle={styles.pickerContainerStyle}
        style={styles.pickerStyle}
        dropDownStyle={styles.pickerDropDown}
        arrowColor={COLOR}
        labelStyle={{justifyContent: 'flex-start'}}
        itemStyle={{marginLeft: 10}}
        activeItemStyle={{alignItems: 'flex-start'}}
        // zIndex={1000}
        dropDownMaxHeight={350}
        isVisible={isDropDownVisible}
        onOpen={() => {
          setIsDropDownVisible(true);
          dropDownRef.current.blur();
        }}
        onChangeItem={({value}) => {
          setIsDropDownVisible(false);
          setSelectedReason(value);
        }}
      />
      <View style={{height: 20}} />
      <Text style={styles.label}>Description ({selectedReason === '999' ? 'Required' : 'Optional'})</Text>
      <TextInput
        ref={dropDownRef}
        value={description}
        onChangeText={value => setDescription(value)}
        style={styles.input}
        placeholder="Description"
        placeholderTextColor={LIGHT}
        keyboardType="default"
        textAlignVertical="top"
        onFocus={() => {
          setIsDropDownVisible(false);
        }}
        blurOnSubmit
        multiline
      />

      <TouchableHighlight onPress={onConfirm} underlayColor={COLOR} style={{borderRadius: 10, marginTop: 20}}>
        <View style={styles.submit}>
          <Text style={{color: COLOR, fontSize: 16}}>Confirm</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TalkToUs);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBox: {
    height: 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
  },
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10,
  },

  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
  pickerContainerStyle: {
    height: 50,
  },
  pickerStyle: {
    backgroundColor: 'white',
    borderColor: MEDIUM,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  pickerDropDown: {
    backgroundColor: 'white',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: MEDIUM,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    color: DARK,
    flex: 1,
    flexWrap: 'wrap',
  },
  submit: {
    flexDirection: 'row',
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
