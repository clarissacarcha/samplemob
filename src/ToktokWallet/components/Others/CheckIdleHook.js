import React from 'react'
import { CheckIdleStateContext } from "."
export const CheckIdleHook = ()=> {
    const checkidlle = React.useContext(CheckIdleStateContext)
    return checkidlle
}