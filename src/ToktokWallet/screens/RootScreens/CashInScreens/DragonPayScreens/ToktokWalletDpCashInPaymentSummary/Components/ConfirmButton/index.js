import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TransactionUtility} from 'toktokwallet/util';

//GRAPHQL & HOOKS
import {useAccount} from 'toktokwallet/hooks';
import {useMutation} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_REQUEST_CASH_IN, POST_CASH_IN_PAYPANDA_REQUEST} from 'toktokwallet/graphql';
import {usePrompt} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert, useThrottle} from 'src/hooks';
import {useSelector} from 'react-redux';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//COMPONENTS
import {OrangeButton} from 'toktokwallet/components';
import {AlertOverlay} from 'src/components';

//FONTS & COLORS & IMAGES
import {COLOR, FONT_SIZE} from 'src/res/variables';

export const ConfirmButton = ({route}) => {
  const prompt = usePrompt();
  const navigation = useNavigation();
  const {onSuccess} = route.params;
  const {tokwaAccount} = useAccount();

  return (
    <>
      {/* <AlertOverlay visible={postFinalizeOtcLoading || postInitializeOtcLoading} /> */}
      <View style={styles.buttonContainer}>
        <OrangeButton label="Confirm" onPress={onSuccess} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLOR.WHITE,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
  },
});
