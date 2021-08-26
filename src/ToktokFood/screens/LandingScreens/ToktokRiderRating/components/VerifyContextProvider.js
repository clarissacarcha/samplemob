import React, { createContext, useState } from 'react';
import { availableTips } from 'toktokfood/helper/strings';

export const VerifyContext = createContext()
const {Provider} = VerifyContext

export const VerifyContextProvider = ({children})=> {

    const [riderInformation, setRiderInformation] = useState({
        name: "Edward Nolasco Rosario",
        contactNo: "09097570947",
    });
    const [rating, setRating] = useState(1);
    const [toktokwalletBalance, setToktokwalletBalance] = useState("0.00");
    const [activeTab, setActiveTab] = useState(availableTips[0]);
    const [otherAmount, setOtherAmount] = useState("");
    const [rateComments, setRateComments] = useState("");
    const [hasToktokWallet, setHasToktokWallet] = useState(true);
    const [errorAmountMessage, setErrorAmountMessage] = useState("")

    return (
        <Provider
            value={{
                riderInformation,
                setRiderInformation,
                rating,
                setRating,
                toktokwalletBalance,
                setToktokwalletBalance,
                activeTab,
                setActiveTab,
                otherAmount,
                setOtherAmount,
                rateComments,
                setRateComments,
                hasToktokWallet,
                setHasToktokWallet,
                errorAmountMessage,
                setErrorAmountMessage
            }}
        >
            {children}
        </Provider>
    )
}
