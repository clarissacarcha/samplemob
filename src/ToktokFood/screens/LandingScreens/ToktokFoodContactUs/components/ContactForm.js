import React, {useState, useEffect, useContext} from 'react';
import {Platform, StyleSheet, View, Image, Text, FlatList, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

// Components
import HeaderImageBackground from 'toktokfood/components/HeaderImageBackground';
import Separator from 'toktokfood/components/Separator';
import Loader from 'toktokfood/components/Loader';
import DialogMessage from 'toktokfood/components/DialogMessage';

// Hooks
import {useUserLocation} from 'toktokfood/hooks';
import {useSelector} from 'react-redux';
import {moderateScale, getStatusbarHeight, verticalScale, getDeviceHeight} from 'toktokfood/helper/scale';
import {SamplePolicy} from 'toktokfood/helper/strings';
import {arrow_right, email_ic, call_ic} from 'toktokfood/assets/images';
import YellowButton from 'toktokfood/components/YellowButton';
import {TOKTOK_FOOD_GRAPHQL_CLIENT} from 'src/graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import { POST_CONTACT_US } from 'toktokfood/graphql/toktokfood';
import { onErrorAlert } from 'src/util/ErrorUtility';
import { useAlert } from 'src/hooks';

// Fonts & Colors
import {COLOR, FONT, FONT_SIZE} from 'res/variables';

export const ContactForm = ({  }) => {

  const {customerInfo} = useSelector((state) => state.toktokFood);
  const {user} = useSelector((state) => state.session);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState({ type: '', show: false, message: '' });
  const alert = useAlert();

  const [postContactUs, {loading, error}] = useLazyQuery(POST_CONTACT_US, {
    client: TOKTOK_FOOD_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: (error) => {
      onErrorAlert({alert, error})
    },
    onCompleted: ({postContactUs}) => {
      let { success, message } = postContactUs
      if(success){
        setResponse({ message, show: true, type: 'success' })
      } else {
        setResponse({ message, show: true, type: 'error' })
      }
    },
  });

  const onPressSubmit = () => {
    if(message != ''){
      let { firstName, lastName, email } = customerInfo
      postContactUs({
        variables: {
          input: {
            sendToEmail: "mmoran@cloudpanda.ph",
            name: `${firstName} ${lastName}`,
            email: email,
            message: message,
          }
        }
      })
    }
  }

  return (
    <View style={styles.container}>
      <Loader visibility={loading} message="Sending..." hasImage={false} loadingIndicator />
      <DialogMessage
        visibility={response.show}
        title={response.type.charAt(0).toUpperCase() + response.type.slice(1)}
        messages={response.message}
        type={response.type}
        onCloseModal={() => {
          setMessage('');
          setResponse({ message: '', type: '', show: false });
        }}
      />
      <View style={styles.input}>
        <TextInput
          value={message}
          style={{ textAlignVertical: 'top', marginTop: verticalScale(-10), height: verticalScale(230)}}
          placeholder={'Message'}
          placeholderTextColor={'#9E9E9E'}
          multiline={true}
          numberOfLines={5}
          onChangeText={(msg) => setMessage(msg)}
        />
      </View>
      <View style={styles.btnContainer}>
        <YellowButton
          disabled={message == ''}
          onPress={onPressSubmit}
          label='Submit'
          btnStyle={styles.btnStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  btnContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(30)
  },
  btnStyle: {
    width: '50%',
    borderRadius: 5
  }
});
