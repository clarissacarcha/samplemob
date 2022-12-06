/* eslint-disable react-hooks/exhaustive-deps */
import React, {createContext, useState, useEffect} from 'react';
//GRAPHQL
import {TOKTOK_WALLET_GRAPHQL_CLIENT} from 'src/graphql';
import {POST_GENERATE_QR_CODE, GET_ACCOUNT_QR_CODES} from 'toktokwallet/graphql';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
export const VerifyContext = createContext();
const {Provider} = VerifyContext;

export const VerifyContextProvider = ({children}) => {
  const [qrOptions, setQrOptions] = useState('scan');
  const [amount, setAmount] = useState('');
  const [generatedQrCode, setGeneratedQrCode] = useState(null);
  const [recentQrCodes, setRecentQrCodes] = useState([]);
  const [onShare, setOnShare] = useState(false);

  const [postGenerateQRCode, {loading: generateQrCodeLoading}] = useMutation(POST_GENERATE_QR_CODE, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    onCompleted: data => {
      const {encryptedQRToken} = data.postGenerateQRCode;
      setGeneratedQrCode(encryptedQRToken);
      getAccountQrCodes();
    },
  });

  const [getAccountQrCodes, {loading: getAccountQrCodesLoading}] = useLazyQuery(GET_ACCOUNT_QR_CODES, {
    client: TOKTOK_WALLET_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setRecentQrCodes(data.getAccountQrCodes);
    },
  });

  useEffect(() => {
    getAccountQrCodes();
    postGenerateQRCode({
      variables: {
        input: {
          amount: amount !== '' ? parseFloat(amount) : 0,
        },
      },
    });
  }, []);

  return (
    <Provider
      value={{
        amount,
        setAmount,
        qrOptions,
        setQrOptions,
        generatedQrCode,
        setGeneratedQrCode,
        postGenerateQRCode,
        generateQrCodeLoading,
        recentQrCodes,
        setRecentQrCodes,
        getAccountQrCodes,
        getAccountQrCodesLoading,
        setOnShare,
        onShare,
      }}>
      {children}
    </Provider>
  );
};
