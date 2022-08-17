import React, {useState, useContext} from 'react';
import {PageProgressBar, CheckIdleState, HeaderBack, HeaderTitleRevamp} from 'toktokwallet/components';
import {ContextProvider, ContextChannelForm, VideoCallSchedule, ReviewAndConfirm} from './components';

const MainComponent = () => {
  const {currentIndex} = useContext(ContextChannelForm);
  const [screens] = useState([<VideoCallSchedule />, <ReviewAndConfirm />]);

  return <PageProgressBar screens={screens} currentIndex={currentIndex} />;
};

export const ToktokWalletVideoCallSchedule = ({navigation}) => {
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitleRevamp label={'Upgrade Account'} />,
  });

  return (
    <CheckIdleState>
      <ContextProvider>
        <MainComponent />
      </ContextProvider>
    </CheckIdleState>
  );
};
