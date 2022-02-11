import { numberFormat } from 'toktokwallet/helper'

import {
    postCheckIncomingLimit,
    postCheckOutgoingLimit
} from "./Resolvers";

export class AmountLimitHelper {

    static postCheckIncomingLimit = postCheckIncomingLimit;
    static postCheckOutgoingLimit = postCheckOutgoingLimit;

    static checkAccountIncomingWalletLimit = ({
        tokwaAccount,
        amount,
    })=> {
        try {
            const { 
                walletSize,
                incomingValueDailyLimit,
                incomingValueMonthlyLimit,
                incomingValueAnnualLimit,
            } = tokwaAccount.person.accountType

            const {
                balance
            } = tokwaAccount.wallet

            let message = ""

            if(incomingValueDailyLimit){
                message = AmountLimitHelper.checkIncomingValueDailyLimit({ incomingValueDailyLimit , amount , balance })
                if(message != "") return message
            }
            if(incomingValueMonthlyLimit){
                message = AmountLimitHelper.checkIncomingValueMonthlyLimit({ incomingValueMonthlyLimit , amount , balance })
                if(message != "") return message
            }
            if(incomingValueAnnualLimit){
                message = AmountLimitHelper.checkIncomingValueAnnualLimit({ incomingValueAnnualLimit , amount , balance })
                if(message != "") return message
            }
            if(walletSize){
                message = AmountLimitHelper.checkWalletSize({ walletSize , amount , balance })
                if(message != "") return message
            }

            return message
        }catch(error){
            throw error
        }
    }

    static checkAccountOutgoingWalletLimit = ({
        tokwaAccount,
        amount,
    }) => {
        try {
            const { 
                outgoingValueDailyLimit,
                outgoingValueMonthlyLimit,
                outgoingValueAnnualLimit
            } = tokwaAccount.person.accountType

            const {
                balance
            } = tokwaAccount.wallet
            
            let message = ""

            if(outgoingValueDailyLimit){
                message = AmountLimitHelper.checkOutgoingValueDailyLimit({ outgoingValueDailyLimit , amount , balance })
                if(message != "") return message
            }
            if(outgoingValueMonthlyLimit){
                message = AmountLimitHelper.checkOutgoingValueMonthlyLimit({ outgoingValueMonthlyLimit , amount, balance })
                if(message != "") return message
            }
            if(outgoingValueAnnualLimit){
                message = AmountLimitHelper.checkOutgoingValueAnnualLimit({ outgoingValueAnnualLimit , amount, balance })
                if(message != "") return message
            }
            
            return message
        }catch(error){
            throw error
        }
    }

    static checkWalletSize = ({
        walletSize,
        amount,
        balance
    })=> {
        let message = ""
        if(walletSize < (+amount + +balance)){
            message = `Max wallet size is reached. You can only cash-in another PHP ${numberFormat(walletSize - balance)}. `
                      + `Enter a lower cash-in amount.`
        }
        return message
    }

    static checkIncomingValueDailyLimit = ({
        incomingValueDailyLimit,
        amount,
        balance
    })=> {
        let message = ""
        if(incomingValueDailyLimit < (+amount + +balance)){
            message = `Incoming daily limit is reached. You can only cash-in another PHP ${numberFormat(incomingValueDailyLimit - balance)}. `
                      + `Enter a lower cash-in amount.`
        }
        return message
    }

    static checkIncomingValueMonthlyLimit = ({
        incomingValueMonthlyLimit,
        amount,
        balance
    })=> {
        let message = ""
        if(incomingValueMonthlyLimit < (+amount + +balance)){
            message = `Incoming monthly limit is reached. You can only cash-in another PHP ${numberFormat(incomingValueMonthlyLimit - balance)}. `
                      + `Enter a lower cash-in amount.`
        }
        return message
    }

    static checkIncomingValueAnnualLimit = ({
        incomingValueAnnualLimit,
        amount,
        balance
    })=> {
        let message = ""
        if(incomingValueAnnualLimit < (+amount + +balance)){
            message = `Incoming annual limit is reached. You can only cash-in another PHP ${numberFormat(incomingValueAnnualLimit - balance)}. `
                      + `Enter a lower cash-in amount.`
        }
        return message
    }

    static checkOutgoingValueDailyLimit = ({
        outgoingValueDailyLimit,
        amount,
        balance
    })=> {
        let message = ""
        if(outgoingValueDailyLimit < amount){
            message = `Outgoing daily limit is reached. You can only cash-out PHP ${numberFormat(outgoingValueDailyLimit)}. `
                      + `Enter a lower cash-out amount.`
        }
        return message
    }

    static checkOutgoingValueMonthlyLimit = ({
        outgoingValueMonthlyLimit,
        amount
    })=> {

    }

    static checkOutgoingValueAnnualLimit = ({
        outgoingValueAnnualLimit,
        amount
    })=> {

    }
}