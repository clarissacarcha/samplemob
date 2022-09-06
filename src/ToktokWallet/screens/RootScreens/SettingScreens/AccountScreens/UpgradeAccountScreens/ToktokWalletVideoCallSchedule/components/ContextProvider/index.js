import React, {createContext, useState} from 'react';

export const ContextChannelForm = createContext(null);
const {Provider} = ContextChannelForm;

export const ContextProvider = ({children}) => {
  const [pepInfo, setPepInfo] = useState({
    videocall: {
      videoCallContactDetails: '',
      callChannelId: '',
      callChannel: '',
      preferredVcsDayMin: '',
      preferredVcsDayMax: '',
      preferredVcsTimeMin: '',
      preferredVcsTimeMax: '',
      selectedDay: {
        label: 'Weekday',
        description: 'Monday - Friday',
        value: 0,
        pickerData: {
          index: 0,
          min: 2,
          max: 6,
        },
      },
      selectedTime: {
        label: 'Morning',
        description: '08:00 AM - 12:00 PM',
        value: 0,
        pickerData: {
          index: 0,
          min: '08:00',
          max: '12:00',
        },
      },
    },
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Provider
      value={{
        pepInfo,
        setPepInfo,
        currentIndex,
        setCurrentIndex,
      }}>
      {children}
    </Provider>
  );
};
