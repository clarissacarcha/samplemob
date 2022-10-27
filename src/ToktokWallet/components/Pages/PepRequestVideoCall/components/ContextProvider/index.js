import React, {createContext, useState, useEffect} from 'react';

export const ContextChannelForm = createContext(null);
const {Provider} = ContextChannelForm;
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {GET_CALL_CHANNELS} from 'toktokwallet/graphql/model';
import {onErrorAlert} from 'src/util/ErrorUtility';
import {useAlert} from 'src/hooks';

export const ContextProvider = ({children, pepInfo}) => {
  const videocall = pepInfo.videocall;

  const [selectedCallChannel, setSelectedCallChannel] = useState({
    id: videocall.callChannelId,
    channelName: videocall.callChannel,
  });
  const [callChannels, setCallChannels] = useState('');
  const [numberOrLink, setNumberOrLink] = useState(
    videocall.videoCallContactDetails ? videocall.videoCallContactDetails.replace('+63', '') : '',
  );
  const [dayPicked, setDayPicked] = useState({
    index: 0,
    min: 2,
    max: 6,
  });
  const [timePicked, setTimePicked] = useState({
    index: 0,
    min: '08:00',
    max: '12:00',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const alert = useAlert();

  const [getCallChannels, {loading: getCallChannelsLoading}] = useLazyQuery(GET_CALL_CHANNELS, {
    fetchPolicy: 'network-only',
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onError: error => {
      onErrorAlert({alert, error});
    },
    onCompleted: ({getCallChannels}) => {
      // const channels = getCallChannels.splice(0, 3);
      const channels = getCallChannels;
      setCallChannels(channels);
    },
  });

  useEffect(() => {
    getCallChannels();
  }, []);

  return (
    <Provider
      value={{
        callChannels,
        selectedCallChannel,
        setSelectedCallChannel,
        numberOrLink,
        setNumberOrLink,
        dayPicked,
        setDayPicked,
        timePicked,
        setTimePicked,
        errorMessage,
        setErrorMessage,
        getCallChannelsLoading,
      }}>
      {children}
    </Provider>
  );
};
