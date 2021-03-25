import React from 'react'
import { HeaderTitle , HeaderBackClose } from '../../../../../components'

const GcashEnchashment = ({navigation})=> {

    navigation.setOptions({
        headerLeft: ()=> <HeaderBackClose/>,
        headerTitle: ()=> <HeaderTitle label={['Gcash Encashment','']}/>,
    })

    return (
        <>

        </>
    )
}

export default GcashEnchashment

