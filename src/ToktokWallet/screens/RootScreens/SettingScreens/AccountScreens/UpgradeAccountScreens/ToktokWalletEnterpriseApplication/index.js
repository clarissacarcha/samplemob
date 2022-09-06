import React, {useRef, useState, useContext, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Separator, PageProgressBar} from 'toktokwallet/components';
import {HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_ENTERPRISE_UPGRADE_REQUEST} from 'toktokwallet/graphql';
import {useQuery} from '@apollo/react-hooks';
import {SomethingWentWrong} from 'src/components';
import {useAlert} from 'src/hooks';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {AlertOverlay} from 'src/components';
import CONSTANTS from 'common/res/constants';

//SELF IMPORTS
import {
  ApplicationComponent,
  PepQuestionnaire,
  ContextProvider,
  ContextEnterpriseApplication,
  BottomSheetIDType,
  HeaderReminders,
  PendingRequest,
  Resubmit,
  ReviewAndConfirm,
  SetRequestRecords,
  UploadForms,
  TakePhotoID,
} from './Components';

const {COLOR, FONT_SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const ToktokWalletEnterpriseApplication = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Upgrade Account'} />,
  });

  const MainComponent = () => {
    const {currentIndex} = useContext(ContextEnterpriseApplication);
    const [screens, setScreens] = useState([<PepQuestionnaire />, <ApplicationComponent />, <ReviewAndConfirm />]);
    const {setForms, validID1, validID2, pepInfo, setPepInfo} = useContext(ContextEnterpriseApplication);
    const IDTypeRef = useRef();
    const [idIndex, setIDIndex] = useState(1);
    const alert = useAlert();

    const onPress = index => {
      setIDIndex(index);
      IDTypeRef.current.expand();
    };

    const {data, error, loading} = useQuery(GET_ENTERPRISE_UPGRADE_REQUEST, {
      fetchPolicy: 'network-only',
      client: TOKTOK_WALLET_GRAPHQL_CLIENT,
      onError: error => onErrorAlert({alert, error, navigation}),
    });

    if (loading) {
      return <AlertOverlay visible={loading} />;
    }

    if (error) {
      return <SomethingWentWrong />;
    }

    if (data?.getEnterpriseUpgradeRequest?.status == 2 || data?.getEnterpriseUpgradeRequest?.status == 5) {
      return <PendingRequest enterpriseRequest={data?.getEnterpriseUpgradeRequest} />;
    }

    if (data?.getEnterpriseUpgradeRequest?.status == 3) {
      // Status is for compliance
      return (
        <>
          <Separator />
          <SetRequestRecords data={data?.getEnterpriseUpgradeRequest} />
          <ScrollView style={styles.container}>
            <HeaderReminders />
            <UploadForms />
            <TakePhotoID onPress={onPress} />
          </ScrollView>
          <Resubmit id={data?.getEnterpriseUpgradeRequest?.id} />
          <BottomSheetIDType
            ref={IDTypeRef}
            idIndex={idIndex}
            onChange={() => null}
            validID1={validID1}
            validID2={validID2}
          />
        </>
      );
    }
    return <PageProgressBar screens={screens} currentIndex={currentIndex} />;
  };
  return (
    <>
      <ContextProvider>
        <MainComponent />
      </ContextProvider>
    </>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF1D2',
  },
  progressBarItem: {
    flex: 1,
  },
});
