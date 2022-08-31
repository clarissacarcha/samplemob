import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';

//COMPONENTS
import {ContextChannelForm} from '../ContextProvider';
import {PreviousNextButton} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';
//GRAPHQL, HOOKS
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_FULL_VERIFIED_UPGRADE_REQUEST} from 'toktokwallet/graphql';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/react-hooks';
import {usePrompt} from 'src/hooks';
import {TransactionUtility} from 'toktokwallet/util';
import {useSelector} from 'react-redux';

import CONSTANTS from 'common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE, COLOR, SHADOW, SIZE} = CONSTANTS;

export const ReviewAndConfirm = () => {
  const {pepInfo, setCurrentIndex} = useContext(ContextChannelForm);
  const navigation = useNavigation();
  const prompt = usePrompt();
  const tokwaAccount = useSelector(state => state.toktokWallet);

  const [postFullyVerifiedUpgradeRequest, {loading}] = useMutation(POST_FULL_VERIFIED_UPGRADE_REQUEST, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      TransactionUtility.StandardErrorHandling({
        error,
        navigation,
        prompt,
      });
    },
    onCompleted: response => {
      let result = response.postFullyVerifiedUpgradeRequest;
      if (result.requestStatus === 2) {
        prompt({
          type: 'success',
          title: 'Video Call Schedule',
          message:
            'Your schedule has been submitted. Kindly wait for our representative to call on the schedule provided.',
          event: 'TOKTOKBILLSLOAD',
          onPress: () => {
            navigation.pop(2);
            navigation.navigate('ToktokWalletFullyVerifiedApplication', {doneVcs: true});
          },
        });
      }
    },
  });

  const onPressConfirm = () => {
    let {callChannelId, selectedDay, selectedTime, videoCallContactDetails} = pepInfo.videocall;

    let input = {
      videoCallContactDetails,
      accountTypeId: +tokwaAccount.person.accountType.level,
      callChannelId: callChannelId,
      preferredVcsDayMin: selectedDay.pickerData.min,
      preferredVcsDayMax: selectedDay.pickerData.max,
      preferredVcsTimeMin: selectedTime.pickerData.min,
      preferredVcsTimeMax: selectedTime.pickerData.max,
    };

    postFullyVerifiedUpgradeRequest({
      variables: {
        input,
      },
    });
  };

  return (
    <>
      <AlertOverlay visible={loading} />

      <View style={styles.container}>
        <View style={{marginBottom: 16}}>
          <Text style={{fontFamily: FONT.BOLD}}>Review and Confirm</Text>
          <Text style={{paddingTop: 8, color: '#525252', fontSize: FONT_SIZE.S}}>
            Review all the details provided before clicking "Confirm".
          </Text>
        </View>
        <Text style={{fontFamily: FONT.BOLD, color: COLOR.ORANGE}}>Video Call Schedule</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
          <Text style={{color: '#525252', fontFamily: FONT.BOLD}}>{pepInfo.videocall.callChannel}</Text>
          <Text>{pepInfo.videocall.videoCallContactDetails}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
          <Text style={{color: '#525252', fontFamily: FONT.BOLD}}>{pepInfo.videocall.selectedDay.label}</Text>
          <Text>{pepInfo.videocall.selectedDay.description}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20}}>
          <Text style={{color: '#525252', fontFamily: FONT.BOLD}}>Time</Text>
          <Text>{pepInfo.videocall.selectedTime.description}</Text>
        </View>
      </View>
      <PreviousNextButton
        label="Previous"
        labelTwo="Confirm"
        onPressNext={onPressConfirm}
        onPressPrevious={() => setCurrentIndex(oldval => oldval - 1)}
        hasShadow
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
