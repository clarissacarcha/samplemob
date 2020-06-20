import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableHighlight, Alert} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../../components';
import {COLOR, DARK, MAP_DELTA_LOW, ORANGE, MEDIUM} from '../../../../res/constants';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import {ReactNativeFile} from 'apollo-upload-client';
import {PATCH_PERSON_PROFILE_PICTURE} from '../../../../graphql';
import {useMutation} from '@apollo/react-hooks';

const ChangeProfilePicture = ({navigation, route, session}) => {
  const {label} = route.params;
  const [image, setImage] = useState(false);

  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={label} />,
  });

  const onCameraPress = () => {
    const label = ['Change', 'Take a photo'];
    navigation.push('ProfileCamera', {label, setImage});
  };

  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      setImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const [patchPersonProfilePicture, {loading}] = useMutation(PATCH_PERSON_PROFILE_PICTURE, {
    onCompleted: res => Alert.alert('', res),
    // onError: error => {
    //   console.log(error);
    // },
    onError: ({graphQLErrors, networkError}) => {
      if (networkError) {
        console.log(networkError);
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      }
      if (graphQLErrors) {
        console.warn(graphQLErrors);
      }
    },
  });

  const onConfirmPicture = fileUri => {
    try {
      const rnFile = new ReactNativeFile({
        uri: fileUri,
        name: 'document.jpg',
        type: 'image/jpeg',
      });
      patchPersonProfilePicture({
        variables: {
          input: {
            tokUserId: session.user.person.id,
            file: rnFile,
          },
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  return !image ? (
    <View style={styles.container}>
      <TouchableHighlight style={styles.card} onPress={handleSelectFile}>
        <View style={{justifyContent: 'center', alignItems:'center',}}>
          <FAIcon name="image" size={100} color={MEDIUM} />
          <Text style={{color: 'white'}}>Select from gallery</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.card} onPress={onCameraPress}>
        <View style={{justifyContent: 'center', alignItems:'center',}}>
          <FAIcon name="camera" size={100} color={MEDIUM} />
          <Text style={{color: 'white'}}>Take a photo</Text>
        </View>
      </TouchableHighlight>
    </View>
  ) : (
    <View style={styles.imageContainer}>
      <Image source={{uri: image.uri}} style={{flex:1, width: '100%', height: '100%',}} />
      <TouchableHighlight style={[styles.button, {right: 50, bottom: 50}]} onPress={() => onConfirmPicture(image)}>
        <View style={styles.button}>
          <FAIcon name="check-circle" size={70} color={COLOR} />
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={[styles.button, {left: 50, bottom: 50}]} onPress={() => setImage(false)}>
        <View style={styles.button}>
          <FAIcon name="ban" size={70} color={COLOR} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeProfilePicture);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    width: '59%',
    margin: 49,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    borderRadius: 100,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
