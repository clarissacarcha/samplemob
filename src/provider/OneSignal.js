// import React, {useEffect} from 'react';
// import OneSignal from 'react-native-onesignal';

// export const OneSignalProvider = ({children}) => {
//   useEffect(() => {
//     OneSignal.init('4152b91e-f370-4764-8c43-e2cb7f48e0a2');
//     OneSignal.inFocusDisplaying(0);
//     OneSignal.sendTags({
//       email: 'one@paykash.com',
//     });
//     OneSignal.addEventListener('ids', onId);

//     return () => {
//       OneSignal.removeEventListener('ids', onId);
//     };
//   }, []);

//   const onId = device => {
//     alert(JSON.stringify(device, null, 2));
//   };

//   return <>{children}</>;
// };
