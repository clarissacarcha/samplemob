import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import constants from '../../../common/res/constants';
import {BackButton, PrimaryButton} from '../../../components_section/Buttons';
import {HeaderTitle, ModalCustomDescription} from '../../../components_section/Texts';
import {useToktokAlert} from '../../../hooks';

const DeveloperScreen = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <BackButton navigation={navigation} />,
    headerTitle: () => <HeaderTitle label={'Developer Mode'} />,
  });

  const onConfirm = () => {
    console.log('pressed func confirm');
  };

  const toktokAlert = useToktokAlert();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, paddingHorizontal: 16, paddingTop: 16}}>
      <PrimaryButton label={`Primary button`} />
      <View style={{flexDirection: 'row', marginVertical: 8, justifyContent: 'space-evenly'}}>
        <PrimaryButton
          label={`warning modal`}
          onPress={() => {
            toktokAlert({
              title: 'Simple warning modal',
              message: 'Simple modal example with title and message only',
            });
          }}
        />
        <PrimaryButton
          label={`warning modal w/ func`}
          onPress={() => {
            toktokAlert({
              title: 'Warning modal',
              message: 'Modal example with title, message, custom button text and function',
              onPressSingleButton: () => {
                console.log('Pressed warning modal w/ func.');
              },
              buttonSingleText: 'Close',
            });
          }}
        />
      </View>
      <View style={{flexDirection: 'row', marginVertical: 8, justifyContent: 'space-evenly'}}>
        <PrimaryButton
          label={`failed modal`}
          onPress={() => {
            toktokAlert({
              title: 'Simple failed modal',
              message: 'Simple modal example with title and message only',
              imageType: 'failed',
            });
          }}
        />
        <PrimaryButton
          label={`Modal w/ custom message`}
          onPress={() => {
            toktokAlert({
              title: 'Modal with custom message',
              message: 'Failed modal with custom message design',
              imageType: 'failed',
              customMessage: () => {
                return (
                  <ModalCustomDescription>
                    Custom message{' '}
                    <Text
                      style={{
                        fontFamily: constants.FONT_FAMILY.BOLD,
                        fontSize: constants.FONT_SIZE.M,
                        color: constants.COLOR.BLACK,
                      }}>
                      with bold text
                    </Text>{' '}
                    or insert other styles!
                  </ModalCustomDescription>
                );
              },
            });
          }}
        />
      </View>
      <View style={{flexDirection: 'row', marginVertical: 8, justifyContent: 'space-evenly'}}>
        <PrimaryButton
          label={`two buttons modal`}
          onPress={() => {
            toktokAlert({
              title: 'Two buttons modal',
              message: 'Two buttons with function',
              onPressButtonLeft: () => {
                console.log('pressed cancel');
              },
              onPressButtonRight: onConfirm,
              buttonLeftText: 'Cancel',
              buttonRightText: 'Confirm',
            });
          }}
        />
        <PrimaryButton
          label={`no image and title modal`}
          onPress={() => {
            toktokAlert({
              message: 'Simple modal example without title and image',
              noImage: true,
            });
          }}
        />
      </View>
      <View style={{flexDirection: 'row', marginVertical: 8, justifyContent: 'space-evenly'}}>
        <PrimaryButton
          label={`sample success modal`}
          onPress={() => {
            toktokAlert({
              title: 'Booking confirmed',
              message: 'Simple modal example without title and image',
              imageType: 'success',
            });
          }}
        />
      </View>
    </ScrollView>
  );
};

export default DeveloperScreen;
