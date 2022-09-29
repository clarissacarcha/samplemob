/**
 * @format
 * @flow
 */

import React, {useState, useRef} from 'react';

import type {PropsType} from './types';
import {BackgroundImage, ContentContainer, ReceiptDownloadContainer, ScrollViewContainer} from './Styled';
import ViewShot from 'react-native-view-shot';
import {useNavigation, useRoute} from '@react-navigation/native';

//COMPONENTS
import {OrangeButton, HeaderTitleRevamp, HeaderDownloadReceipt} from 'toktokwallet/components';
import ReceiptHeader from '../ReceiptHeader';
import ReceiptDetails from '../ReceiptDetails';

const MainComponent = ({route, props}) => {
  return (
    <ContentContainer>
      <ReceiptHeader receipt={route.params.receipt} />
      <ReceiptDetails receipt={route.params.receipt} children={props.children} />
    </ContentContainer>
  );
};

const ReceiptDownload = ({route, onCapturingScreen, props}) => {
  return (
    <ReceiptDownloadContainer>
      <ContentContainer onCapturingScreen={onCapturingScreen}>
        <ReceiptHeader receipt={route.params.receipt} />
        <ReceiptDetails receipt={route.params.receipt} children={props.children} />
      </ContentContainer>
    </ReceiptDownloadContainer>
  );
};

const Receipt = (props: PropsType): React$Node => {
  const navigation = useNavigation();
  const route = useRoute();
  const [onCapturingScreen, setOnCapturingScreen] = useState(false);
  const viewshotRef = useRef();
  const screenLabel = route.params?.screenLabel ? route.params.screenLabel : 'Bank Transfer';

  navigation.setOptions({
    headerLeft: () => null,
    headerTitle: () => <HeaderTitleRevamp label={'Transaction Receipt'} />,
    headerRight: () => (
      <HeaderDownloadReceipt
        viewshotRef={viewshotRef}
        refNo={route.params.receipt.referenceNumber}
        onPressDownloadReceipt={val => {
          setOnCapturingScreen(val);
        }}
      />
    ),
  });

  let status;
  switch (route.params.receipt.status) {
    case '0':
      status = 'Pending';
      break;
    case '1':
      status = 'Successful';
      break;
    case '2':
      status = 'Pending';
      break;
    default:
      status = 'Rejected';
      break;
  }

  const onPressOk = () => {
    if (screenLabel !== 'Bank Transfer' && status !== 'Successful') {
      navigation.navigate('ToktokWalletFullyVerifiedApplication');
      navigation.replace('ToktokWalletFullyVerifiedApplication');
    } else {
      navigation.navigate('ToktokWalletHomePage');
      navigation.replace('ToktokWalletHomePage');
    }
  };

  return (
    <>
      <BackgroundImage>
        <ScrollViewContainer onCapturingScreen={onCapturingScreen}>
          <ViewShot ref={viewshotRef} options={{format: 'jpg', quality: 0.9, result: 'tmpfile'}}>
            {onCapturingScreen ? (
              <ReceiptDownload route={route} onCapturingScreen={onCapturingScreen} props={props} />
            ) : (
              <MainComponent
                navigation={navigation}
                route={route}
                onCapturingScreen={onCapturingScreen}
                props={props}
              />
            )}
          </ViewShot>
        </ScrollViewContainer>
      </BackgroundImage>
      <OrangeButton label="OK" onPress={onPressOk} hasShadow />
    </>
  );
};

export default Receipt;
